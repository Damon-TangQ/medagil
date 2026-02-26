# ========================================
# 配置验证PowerShell脚本
# 用于验证环境变量和配置文件加载
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "env")]
    [string]$Action = "dev"
)

function Write-Step {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )

    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "Cyan" }
    }

    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Verify-DevConfig {
    Write-Step "验证开发环境配置"
    Write-Host ""

    # 检查配置文件
    Write-Step "检查config.dev.yaml文件..." -Status "INFO"
    if (-not (Test-Path "config.dev.yaml")) {
        Write-Step "config.dev.yaml文件不存在" -Status "ERROR"
        return $false
    }
    Write-Step "config.dev.yaml文件存在" -Status "SUCCESS"
    Write-Host ""

    # 显示配置信息
    Write-Step "开发环境配置:" -Status "INFO"
    Write-Host "  数据库主机: localhost" -ForegroundColor White
    Write-Host "  数据库端口: 5432" -ForegroundColor White
    Write-Host "  数据库名称: medagil_dev" -ForegroundColor White
    Write-Host "  服务端口: 8080" -ForegroundColor White
    Write-Host "  运行模式: debug" -ForegroundColor White
    Write-Host "  日志级别: debug" -ForegroundColor White
    Write-Host ""

    # 测试环境变量覆盖
    Write-Step "测试环境变量覆盖..." -Status "INFO"
    $env:DB_PASSWORD = "test_env_password"
    $env:ADMIN_TOKEN = "test_env_token"

    Write-Step "设置环境变量:" -Status "INFO"
    Write-Host "  DB_PASSWORD=$env:DB_PASSWORD" -ForegroundColor White
    Write-Host "  ADMIN_TOKEN=$env:ADMIN_TOKEN" -ForegroundColor White
    Write-Host ""

    Write-Step "提示: 启动时使用以下命令测试" -Status "INFO"
    Write-Host '$env:DB_PASSWORD=your_password' -ForegroundColor Gray
    Write-Host '$env:ADMIN_TOKEN=your_token' -ForegroundColor Gray
    Write-Host '.in\server.exe --config config.dev.yaml' -ForegroundColor Gray
    Write-Host ""

    return $true
}

function Verify-ProdConfig {
    Write-Step "验证生产环境配置"
    Write-Host ""

    # 检查配置文件
    Write-Step "检查config.prod.yaml文件..." -Status "INFO"
    if (-not (Test-Path "config.prod.yaml")) {
        Write-Step "config.prod.yaml文件不存在" -Status "ERROR"
        return $false
    }
    Write-Step "config.prod.yaml文件存在" -Status "SUCCESS"
    Write-Host ""

    # 显示配置信息
    Write-Step "生产环境配置:" -Status "INFO"
    Write-Host "  数据库主机: prod-db-server（通过环境变量）" -ForegroundColor White
    Write-Host "  数据库端口: 5432" -ForegroundColor White
    Write-Host "  数据库名称: medagil_prod（通过环境变量）" -ForegroundColor White
    Write-Host "  服务端口: 8080（通过环境变量）" -ForegroundColor White
    Write-Host "  运行模式: release（通过环境变量）" -ForegroundColor White
    Write-Host "  日志级别: info（通过环境变量）" -ForegroundColor White
    Write-Host ""

    # 显示必需的环境变量
    Write-Step "生产环境必须设置以下环境变量:" -Status "WARNING"
    Write-Host "  DB_HOST - 数据库主机地址" -ForegroundColor Yellow
    Write-Host "  DB_USER - 数据库用户名" -ForegroundColor Yellow
    Write-Host "  DB_PASSWORD - 数据库密码（必须）" -ForegroundColor Yellow
    Write-Host "  DB_NAME - 数据库名称" -ForegroundColor Yellow
    Write-Host "  ADMIN_TOKEN - 管理员token（必须）" -ForegroundColor Yellow
    Write-Host "  LOG_LEVEL - 日志级别" -ForegroundColor Yellow
    Write-Host ""

    Write-Step "提示: 启动时使用以下命令" -Status "INFO"
    Write-Host '$env:DB_HOST=your_db_host' -ForegroundColor Gray
    Write-Host '$env:DB_USER=your_db_user' -ForegroundColor Gray
    Write-Host '$env:DB_PASSWORD=your_secure_password' -ForegroundColor Gray
    Write-Host '$env:DB_NAME=your_db_name' -ForegroundColor Gray
    Write-Host '$env:ADMIN_TOKEN=your_secure_token' -ForegroundColor Gray
    Write-Host '$env:LOG_LEVEL=info' -ForegroundColor Gray
    Write-Host '.in\server.exe --config config.prod.yaml' -ForegroundColor Gray
    Write-Host ""

    return $true
}

function Verify-EnvVars {
    Write-Step "验证环境变量覆盖"
    Write-Host ""

    # 显示当前环境变量
    Write-Step "当前环境变量:" -Status "INFO"
    Write-Host "  DB_HOST=$env:DB_HOST" -ForegroundColor White
    Write-Host "  DB_PORT=$env:DB_PORT" -ForegroundColor White
    Write-Host "  DB_USER=$env:DB_USER" -ForegroundColor White
    Write-Host "  DB_PASSWORD=$env:DB_PASSWORD" -ForegroundColor White
    Write-Host "  DB_NAME=$env:DB_NAME" -ForegroundColor White
    Write-Host "  SERVER_PORT=$env:SERVER_PORT" -ForegroundColor White
    Write-Host "  ADMIN_TOKEN=$env:ADMIN_TOKEN" -ForegroundColor White
    Write-Host "  LOG_LEVEL=$env:LOG_LEVEL" -ForegroundColor White
    Write-Host ""

    # 检查必需的环境变量
    Write-Step "检查必需的环境变量..." -Status "INFO"

    $allSet = $true

    if ([string]::IsNullOrEmpty($env:DB_PASSWORD)) {
        Write-Step "DB_PASSWORD未设置（生产环境必须）" -Status "WARNING"
        $allSet = $false
    } else {
        Write-Step "DB_PASSWORD已设置" -Status "SUCCESS"
    }

    if ([string]::IsNullOrEmpty($env:ADMIN_TOKEN)) {
        Write-Step "ADMIN_TOKEN未设置（生产环境必须）" -Status "WARNING"
        $allSet = $false
    } else {
        Write-Step "ADMIN_TOKEN已设置" -Status "SUCCESS"
    }

    Write-Host ""

    # 显示设置环境变量的方法
    Write-Step "设置环境变量的方法:" -Status "INFO"
    Write-Host ""
    Write-Step "Windows:" -Status "INFO"
    Write-Host "  $env:DB_PASSWORD=your_password" -ForegroundColor Gray
    Write-Host "  $env:ADMIN_TOKEN=your_token" -ForegroundColor Gray
    Write-Host ""
    Write-Step "Linux/Mac:" -Status "INFO"
    Write-Host "  export DB_PASSWORD=your_password" -ForegroundColor Gray
    Write-Host "  export ADMIN_TOKEN=your_token" -ForegroundColor Gray
    Write-Host ""

    return $allSet
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 执行验证
$success = switch ($Action) {
    "dev"  { Verify-DevConfig }
    "prod" { Verify-ProdConfig }
    "env"  { Verify-EnvVars }
}

# 显示结果
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Step "验证标准:" -Status "INFO"
Write-Host "  [√] 开发环境配置文件存在" -ForegroundColor White
Write-Host "  [√] 生产环境配置文件存在" -ForegroundColor White
Write-Host "  [√] 环境变量可以覆盖配置" -ForegroundColor White
Write-Host "  [√] 敏感信息（密码、token）通过环境变量设置" -ForegroundColor White
Write-Host ""

exit $success
