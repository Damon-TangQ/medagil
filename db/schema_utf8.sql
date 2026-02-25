-- Medagil PostgreSQL schema for MVP
-- This file defines core relational tables to support:
-- - Users & auth
-- - Admin & RBAC
-- - Subscriptions, orders & payments
-- - Credits
-- - Projects, achievements
-- - Tasks & feedback
-- - Knowledge base metadata
-- - Content & operations, system settings, audit logs

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. ENUM TYPES
-- =========================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'deleted');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_provider') THEN
    CREATE TYPE auth_provider AS ENUM ('wechat', 'phone', 'email');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_status') THEN
    CREATE TYPE admin_status AS ENUM ('active', 'disabled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'expired', 'canceled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_billing_period') THEN
    CREATE TYPE plan_billing_period AS ENUM ('monthly', 'yearly', 'one_time');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'canceled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_channel') THEN
    CREATE TYPE payment_channel AS ENUM ('wechat_pay');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_txn_type') THEN
    CREATE TYPE credit_txn_type AS ENUM ('earn', 'spend', 'adjust');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('active', 'archived', 'deleted');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'achievement_status') THEN
    CREATE TYPE achievement_status AS ENUM ('draft', 'published', 'archived', 'deleted');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('pending', 'running', 'succeeded', 'failed', 'canceled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_input_type') THEN
    CREATE TYPE task_input_type AS ENUM ('text', 'file', 'mixed', 'voice', 'advanced');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kb_visibility') THEN
    CREATE TYPE kb_visibility AS ENUM ('private', 'team', 'public');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_status') THEN
    CREATE TYPE skill_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'offline');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'announcement_status') THEN
    CREATE TYPE announcement_status AS ENUM ('draft', 'scheduled', 'published', 'offline');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_status') THEN
    CREATE TYPE feedback_status AS ENUM ('new', 'in_progress', 'resolved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_status') THEN
    CREATE TYPE agent_status AS ENUM ('active', 'inactive', 'maintenance');
  END IF;
END$$;

-- Helper for timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 2. USERS & AUTH
-- =========================

CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  uuid            UUID NOT NULL DEFAULT uuid_generate_v4(),
  nickname        VARCHAR(255),
  email           VARCHAR(255),
  phone           VARCHAR(32),
  status          user_status NOT NULL DEFAULT 'active',
  avatar_url      TEXT,
  country         VARCHAR(64),
  organization    VARCHAR(255),
  title           VARCHAR(255),
  -- 褰撳墠鏈夋晥璁㈤槄淇℃伅閫氳繃 subscriptions 琛ㄨ绠楋紝涓嶅湪姝ゅ仛澶栭敭
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_users_email ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_phone ON users(phone) WHERE phone IS NOT NULL;

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 绗笁鏂?澶氱鐧诲綍鏂瑰紡锛堝井淇°€佹墜鏈哄彿銆侀偖绠辩瓑锛?CREATE TABLE IF NOT EXISTS user_auth_identities (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider         auth_provider NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  union_id         VARCHAR(255),
  extra_data       JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_user_auth_provider_user
  ON user_auth_identities(provider, provider_user_id);

CREATE INDEX IF NOT EXISTS idx_user_auth_user_id
  ON user_auth_identities(user_id);

-- 鐢ㄦ埛鏍囩锛堢敾鍍?杩愯惀鐢級
CREATE TABLE IF NOT EXISTS user_tags (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(128) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_tags_set_updated_at
BEFORE UPDATE ON user_tags
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS user_tag_relations (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_id      BIGINT NOT NULL REFERENCES user_tags(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_user_tag_relations_user_tag
  ON user_tag_relations(user_id, tag_id);

CREATE INDEX IF NOT EXISTS idx_user_tag_relations_tag_id
  ON user_tag_relations(tag_id);

-- =========================
-- 3. ADMIN & RBAC
-- =========================

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGSERIAL PRIMARY KEY,
  uuid          UUID NOT NULL DEFAULT uuid_generate_v4(),
  username      VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email         VARCHAR(255),
  status        admin_status NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_admin_users_email ON admin_users(email) WHERE email IS NOT NULL;

CREATE TRIGGER trg_admin_users_set_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS roles (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(128) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_roles_set_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS permissions (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(128) NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_permissions_set_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS role_permissions (
  id            BIGSERIAL PRIMARY KEY,
  role_id       BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_role_permissions_role_perm
  ON role_permissions(role_id, permission_id);

CREATE TABLE IF NOT EXISTS admin_user_roles (
  id          BIGSERIAL PRIMARY KEY,
  admin_id    BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id     BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_admin_user_roles_admin_role
  ON admin_user_roles(admin_id, role_id);

-- =========================
-- 4. SUBSCRIPTIONS, ORDERS & PAYMENTS
-- =========================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id               BIGSERIAL PRIMARY KEY,
  code             VARCHAR(64) NOT NULL UNIQUE, -- e.g. free, pro, max
  name             VARCHAR(128) NOT NULL,
  description      TEXT,
  plan_type        VARCHAR(32) NOT NULL,        -- personal / team
  billing_period   plan_billing_period NOT NULL,
  price_cents      BIGINT NOT NULL DEFAULT 0,
  currency         VARCHAR(16) NOT NULL DEFAULT 'CNY',
  credit_quota     BIGINT NOT NULL DEFAULT 0,   -- 姣忓懆鏈熺Н鍒嗛搴?  is_default       BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_subscription_plans_set_updated_at
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS subscriptions (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id          BIGINT NOT NULL REFERENCES subscription_plans(id),
  status           subscription_status NOT NULL,
  start_at         TIMESTAMPTZ NOT NULL,
  end_at           TIMESTAMPTZ NOT NULL,
  auto_renew       BOOLEAN NOT NULL DEFAULT FALSE,
  latest_order_id  BIGINT,
  cancel_reason    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE TRIGGER trg_subscriptions_set_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS orders (
  id                BIGSERIAL PRIMARY KEY,
  order_no          VARCHAR(64) NOT NULL UNIQUE,
  user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id           BIGINT NOT NULL REFERENCES subscription_plans(id),
  amount_cents      BIGINT NOT NULL,
  currency          VARCHAR(16) NOT NULL DEFAULT 'CNY',
  status            order_status NOT NULL DEFAULT 'pending',
  payment_channel   payment_channel NOT NULL DEFAULT 'wechat_pay',
  payment_time      TIMESTAMPTZ,
  refund_status     VARCHAR(32),
  refund_amount     BIGINT,
  description       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TRIGGER trg_orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 鏀粯娓犻亾渚т氦鏄撴槑缁嗭紙浠ュ井淇℃敮浠樹负涓伙級
CREATE TABLE IF NOT EXISTS payment_transactions (
  id                 BIGSERIAL PRIMARY KEY,
  order_id           BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  channel            payment_channel NOT NULL DEFAULT 'wechat_pay',
  out_trade_no       VARCHAR(64) NOT NULL,  -- 鍟嗘埛璁㈠崟鍙?  transaction_id     VARCHAR(128),          -- 娓犻亾鏂逛氦鏄撳彿
  raw_request        JSONB,
  raw_response       JSONB,
  notify_payload     JSONB,
  status             VARCHAR(32) NOT NULL,  -- success / fail / pending
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_payment_transactions_out_trade_no
  ON payment_transactions(out_trade_no);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id
  ON payment_transactions(order_id);

-- =========================
-- 5. CREDITS
-- =========================

CREATE TABLE IF NOT EXISTS credit_accounts (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_credits    BIGINT NOT NULL DEFAULT 0,
  available_credits BIGINT NOT NULL DEFAULT 0,
  frozen_credits   BIGINT NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  txn_type         credit_txn_type NOT NULL,
  amount           BIGINT NOT NULL, -- 姝ｆ暟锛沞arn 澧炲姞锛宻pend/adjust 鎸変笟鍔¤鍒欏鐞?  balance_after    BIGINT,
  reason_code      VARCHAR(64),     -- 濡?task_execution, subscription_bonus 绛?  biz_type         VARCHAR(64),     -- 涓氬姟绫诲瀷
  biz_id           BIGINT,          -- 涓氬姟涓婚敭锛堝 task_id, order_id锛?  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user_id_created_at
  ON credit_transactions(user_id, created_at DESC);

-- 鍙€夛細閰嶇疆绉垎瑙勫垯
CREATE TABLE IF NOT EXISTS credit_rules (
  id               BIGSERIAL PRIMARY KEY,
  code             VARCHAR(64) NOT NULL UNIQUE, -- e.g. register_bonus, share_reward
  name             VARCHAR(128) NOT NULL,
  description      TEXT,
  expression       TEXT,                         -- 璁＄畻瑙勫垯锛孧VP 鍙厛鐣欑┖鎴栫畝鍗曢厤缃?  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_credit_rules_set_updated_at
BEFORE UPDATE ON credit_rules
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- 6. FILES (瀵硅薄瀛樺偍鍏冩暟鎹?
-- =========================

CREATE TABLE IF NOT EXISTS files (
  id               BIGSERIAL PRIMARY KEY,
  owner_type       VARCHAR(64),       -- user / project / task / kb / system 绛?  owner_id         BIGINT,
  biz_type         VARCHAR(64),       -- avatar / task_input / task_output / kb_source 绛?  file_name        VARCHAR(512) NOT NULL,
  mime_type        VARCHAR(255),
  size_bytes       BIGINT,
  storage_key      VARCHAR(1024) NOT NULL, -- 瀵硅薄瀛樺偍璺緞鎴?key
  checksum         VARCHAR(128),
  extra_metadata   JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_files_biz_type ON files(biz_type);

-- =========================
-- 7. PROJECTS & ACHIEVEMENTS
-- =========================

-- 椤圭洰澶氱骇鍒嗙被
CREATE TABLE IF NOT EXISTS project_categories (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id    BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
  name         VARCHAR(255) NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_categories_user_id
  ON project_categories(user_id);

CREATE TRIGGER trg_project_categories_set_updated_at
BEFORE UPDATE ON project_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 椤圭洰鍩虹淇℃伅锛堣缁嗙粨鏋勩€佹枃妗ｅ唴瀹规斁 Mongo锛?CREATE TABLE IF NOT EXISTS projects (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id       BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  global_instruction TEXT, -- 鍏ㄥ眬鎸囦护鏂囨湰锛岄暱鏂囨湰鍙斁 Mongo锛屼粎鎽樿鍦ㄦ
  status            project_status NOT NULL DEFAULT 'active',
  is_pinned         BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id_status
  ON projects(user_id, status);

CREATE TRIGGER trg_projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 鎴愭灉搴撴潯鐩紙姝ｆ枃銆佺増鏈瓑鍦?Mongo锛?CREATE TABLE IF NOT EXISTS achievements (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id      BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  title           VARCHAR(255) NOT NULL,
  achievement_type VARCHAR(64), -- e.g. article, ppt, dataset 绛?  status          achievement_status NOT NULL DEFAULT 'draft',
  is_favorite     BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
  source_task_id  BIGINT,       -- 鏉ユ簮浠诲姟锛堝鏌愭鏅鸿兘浣撹緭鍑猴級
  main_file_id    BIGINT REFERENCES files(id) ON DELETE SET NULL,
  extra_metadata  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id_status
  ON achievements(user_id, status);

CREATE TRIGGER trg_achievements_set_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- 8. TASKS & FEEDBACK
-- =========================

-- 浠诲姟鍏冩暟鎹紙瀵硅瘽鍐呭銆佹楠よ鎯呮斁 Mongo锛?CREATE TABLE IF NOT EXISTS tasks (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id        BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  task_no           VARCHAR(64) NOT NULL UNIQUE,
  title             VARCHAR(255),
  agent_type        VARCHAR(64),           -- 瀵瑰簲 9 涓櫤鑳戒綋浠ｇ爜
  input_type        task_input_type NOT NULL DEFAULT 'text',
  status            task_status NOT NULL DEFAULT 'pending',
  priority          INTEGER NOT NULL DEFAULT 0,
  dify_app_id       VARCHAR(128),          -- Dify 搴旂敤/Workflow 鏍囪瘑
  dify_task_id      VARCHAR(128),          -- Dify 渚т换鍔?ID
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  error_code        VARCHAR(64),
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id_created_at
  ON tasks(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id
  ON tasks(project_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status);

CREATE TRIGGER trg_tasks_set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 浠诲姟鐩稿叧鏂囦欢锛堣緭鍏?杈撳嚭锛?CREATE TABLE IF NOT EXISTS task_files (
  id            BIGSERIAL PRIMARY KEY,
  task_id       BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_id       BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  role          VARCHAR(32) NOT NULL, -- input / output / reference
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_files_task_id
  ON task_files(task_id);

-- 鐢ㄦ埛瀵逛换鍔＄粨鏋滅殑璇勫垎涓庡弽棣?CREATE TABLE IF NOT EXISTS task_feedbacks (
  id            BIGSERIAL PRIMARY KEY,
  task_id       BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating        SMALLINT CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_feedbacks_task_id
  ON task_feedbacks(task_id);

-- =========================
-- 8.1 AGENTS (智能体定义)
-- =========================

CREATE TABLE IF NOT EXISTS agents (
  id              BIGSERIAL PRIMARY KEY,
  code            VARCHAR(64) NOT NULL UNIQUE, -- e.g. clinical_paper, basic_paper, review_paper, etc.
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  category        VARCHAR(64) NOT NULL, -- paper_writing, fund_application, thesis, research_tools
  status          agent_status NOT NULL DEFAULT 'active',
  dify_app_id     VARCHAR(128),          -- Dify 应用标识
  dify_workflow_id VARCHAR(128),         -- Dify Workflow 标识
  input_types     VARCHAR(255)[],        -- 支持的输入类型数组
  credit_cost     BIGINT NOT NULL DEFAULT 0, -- 执行一次消耗的积分
  is_public       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_agents_set_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- 9. KNOWLEDGE BASE METADATA
-- =========================

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id             BIGSERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  description    TEXT,
  visibility     kb_visibility NOT NULL DEFAULT 'private',
  owner_type     VARCHAR(32) NOT NULL DEFAULT 'user', -- user / admin / system / team
  owner_id       BIGINT,
  is_archived    BOOLEAN NOT NULL DEFAULT FALSE,
  created_by     BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_owner ON knowledge_bases(owner_type, owner_id);

CREATE TRIGGER trg_knowledge_bases_set_updated_at
BEFORE UPDATE ON knowledge_bases
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 鐭ヨ瘑鏂囨。鍏冩暟鎹紙鍐呭涓庡垏鐗囧悜閲忓湪 Mongo/Zilliz锛?CREATE TABLE IF NOT EXISTS knowledge_documents (
  id               BIGSERIAL PRIMARY KEY,
  kb_id            BIGINT NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  source_file_id   BIGINT REFERENCES files(id) ON DELETE SET NULL,
  title            VARCHAR(512),
  original_filename VARCHAR(512),
  status           VARCHAR(32) NOT NULL DEFAULT 'active', -- active / archived / deleted
  version          INTEGER NOT NULL DEFAULT 1,
  chunk_count      INTEGER,
  external_vector_id VARCHAR(128), -- Zilliz / 鍚戦噺搴撲腑鐨勯泦鍚堟爣璇嗘垨 ID
  extra_metadata   JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_kb_id
  ON knowledge_documents(kb_id);

CREATE TRIGGER trg_knowledge_documents_set_updated_at
BEFORE UPDATE ON knowledge_documents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 鏍囩
CREATE TABLE IF NOT EXISTS kb_tags (
  id          BIGSERIAL PRIMARY KEY,
  kb_id       BIGINT NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  name        VARCHAR(128) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_kb_tags_kb_name
  ON kb_tags(kb_id, name);

CREATE TABLE IF NOT EXISTS kb_document_tags (
  id            BIGSERIAL PRIMARY KEY,
  document_id   BIGINT NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  tag_id        BIGINT NOT NULL REFERENCES kb_tags(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_kb_document_tags_doc_tag
  ON kb_document_tags(document_id, tag_id);

-- =========================
-- 10. CONTENT & OPERATIONS
-- =========================

-- 鎶€鑳斤紙鍏叡鎶€鑳藉簱銆佸鏍哥瓑锛?CREATE TABLE IF NOT EXISTS skills (
  id              BIGSERIAL PRIMARY KEY,
  code            VARCHAR(64) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  status          skill_status NOT NULL DEFAULT 'draft',
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,
  dify_app_id     VARCHAR(128),
  created_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_skills_set_updated_at
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 閫氱煡涓庡叕鍛?CREATE TABLE IF NOT EXISTS announcements (
  id              BIGSERIAL PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  content         TEXT NOT NULL,
  status          announcement_status NOT NULL DEFAULT 'draft',
  publish_at      TIMESTAMPTZ,
  created_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_status_publish_at
  ON announcements(status, publish_at DESC);

CREATE TRIGGER trg_announcements_set_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 鐢ㄦ埛鍙嶉锛堟潵鑷€岃幏鍙栧府鍔┿€嶃€屽弽棣堛€嶇瓑鍏ュ彛锛?CREATE TABLE IF NOT EXISTS feedbacks (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
  source          VARCHAR(64), -- web / miniapp / admin / email 绛?  subject         VARCHAR(255),
  content         TEXT NOT NULL,
  status          feedback_status NOT NULL DEFAULT 'new',
  assigned_to     BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_status
  ON feedbacks(status);

CREATE TRIGGER trg_feedbacks_set_updated_at
BEFORE UPDATE ON feedbacks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 定时任务管理
CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  task_type       VARCHAR(64) NOT NULL, -- announcement_publish, data_backup, report_generate, etc.
  cron_expression VARCHAR(128) NOT NULL, -- Cron 表达式
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_run_at     TIMESTAMPTZ,
  next_run_at     TIMESTAMPTZ,
  created_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_by      BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_scheduled_tasks_set_updated_at
BEFORE UPDATE ON scheduled_tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- 11. SYSTEM SETTINGS & AUDIT
-- =========================

CREATE TABLE IF NOT EXISTS system_settings (
  id            BIGSERIAL PRIMARY KEY,
  key           VARCHAR(128) NOT NULL UNIQUE,
  value         JSONB NOT NULL,
  description   TEXT,
  updated_by    BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 绠＄悊绔搷浣滄棩蹇楋紙绯荤粺鏃ュ織锛?CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGSERIAL PRIMARY KEY,
  actor_type    VARCHAR(32) NOT NULL,  -- admin / user / system
  actor_id      BIGINT,
  action        VARCHAR(128) NOT NULL,
  resource_type VARCHAR(64),
  resource_id   BIGINT,
  ip_address    VARCHAR(64),
  user_agent    VARCHAR(512),
  details       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created_at
  ON audit_logs(actor_type, actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_created_at
  ON audit_logs(resource_type, resource_id, created_at DESC);

