/**
 * 图标组件
 */

import { h } from 'vue'
import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 注册所有图标
export function registerIcons(app: App) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

// 导出常用图标
export {
  Search,
  Plus,
  Edit,
  Delete,
  View,
  Star,
  Clock,
  Picture,
  Folder,
  List,
  Lock,
  Bell,
  Check,
  User,
  Setting,
  Close,
  Refresh,
  Download,
  Upload,
  Share,
  More,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretDown,
  CirclePlus,
  CircleClose,
  CircleCheck,
  CircleMinus,
  Warning,
  InfoFilled,
  SuccessFilled,
  WarningFilled,
  Loading,
  Menu,
  Home,
  Document,
  Files,
  Notebook,
  Calendar,
  Timer,
  DataAnalysis,
  TrendCharts,
  PieChart,
  Histogram,
  Monitor,
  Phone,
  Location,
  Message,
  Notification,
  ChatDotRound,
  ChatLineSquare,
  Link,
  Connection,
  Grid,
  Sort,
  Filter,
  ZoomIn,
  ZoomOut,
  FullScreen,
  Crop,
  RefreshLeft,
  RefreshRight,
  Rank,
  SortDown,
  SortUp,
  Operation,
  DataLine,
  DataBoard,
  PieChart as PieChartIcon,
  Histogram as HistogramIcon,
  LineChart,
  TrendCharts as TrendChartsIcon
} from '@element-plus/icons-vue'

// 创建图标组件
export const Icon = (props: { name: string }) => {
  const icon = ElementPlusIconsVue[props.name as keyof typeof ElementPlusIconsVue]
  if (icon) {
    return h(icon)
  }
  return null
}
