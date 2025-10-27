import * as LucideIcons from 'lucide-react'
import * as HeroiconsOutline from '@heroicons/react/24/outline'
import * as HeroiconsSolid from '@heroicons/react/24/solid'
import Fuse from 'fuse.js'
import type { IconLibrary } from '@/types'

// Type for icon metadata
export interface IconMetadata {
  name: string
  library: IconLibrary
  tags: string[]
  category: string
}

// Lucide icons list (popular subset)
export const LUCIDE_ICONS: IconMetadata[] = [
  { name: 'Heart', library: 'lucide', tags: ['health', 'love', 'medical', 'cardiology'], category: 'medical' },
  { name: 'Activity', library: 'lucide', tags: ['health', 'heartbeat', 'pulse', 'monitor'], category: 'medical' },
  { name: 'Pill', library: 'lucide', tags: ['medication', 'medicine', 'drug', 'pharmacy'], category: 'medical' },
  { name: 'Syringe', library: 'lucide', tags: ['injection', 'vaccine', 'medical', 'needle'], category: 'medical' },
  { name: 'Stethoscope', library: 'lucide', tags: ['doctor', 'medical', 'health', 'examination'], category: 'medical' },
  { name: 'Thermometer', library: 'lucide', tags: ['temperature', 'fever', 'health', 'medical'], category: 'medical' },
  { name: 'DollarSign', library: 'lucide', tags: ['money', 'finance', 'cost', 'payment', 'price'], category: 'finance' },
  { name: 'CreditCard', library: 'lucide', tags: ['payment', 'finance', 'card', 'transaction'], category: 'finance' },
  { name: 'Wallet', library: 'lucide', tags: ['money', 'finance', 'payment', 'purse'], category: 'finance' },
  { name: 'TrendingUp', library: 'lucide', tags: ['growth', 'increase', 'chart', 'finance'], category: 'finance' },
  { name: 'TrendingDown', library: 'lucide', tags: ['decrease', 'loss', 'chart', 'finance'], category: 'finance' },
  { name: 'PiggyBank', library: 'lucide', tags: ['savings', 'money', 'finance', 'save'], category: 'finance' },
  { name: 'Smartphone', library: 'lucide', tags: ['phone', 'mobile', 'device', 'technology'], category: 'technology' },
  { name: 'Laptop', library: 'lucide', tags: ['computer', 'device', 'technology', 'work'], category: 'technology' },
  { name: 'Monitor', library: 'lucide', tags: ['screen', 'display', 'computer', 'technology'], category: 'technology' },
  { name: 'Cpu', library: 'lucide', tags: ['processor', 'chip', 'technology', 'computer'], category: 'technology' },
  { name: 'Database', library: 'lucide', tags: ['storage', 'data', 'technology', 'server'], category: 'technology' },
  { name: 'Server', library: 'lucide', tags: ['hosting', 'technology', 'data', 'computer'], category: 'technology' },
  { name: 'Wifi', library: 'lucide', tags: ['internet', 'wireless', 'connection', 'technology'], category: 'technology' },
  { name: 'Bluetooth', library: 'lucide', tags: ['wireless', 'connection', 'technology', 'device'], category: 'technology' },
  { name: 'Phone', library: 'lucide', tags: ['call', 'communication', 'contact', 'telephone'], category: 'communication' },
  { name: 'Mail', library: 'lucide', tags: ['email', 'message', 'communication', 'letter'], category: 'communication' },
  { name: 'MessageCircle', library: 'lucide', tags: ['chat', 'message', 'communication', 'talk'], category: 'communication' },
  { name: 'Send', library: 'lucide', tags: ['message', 'communication', 'mail', 'deliver'], category: 'communication' },
  { name: 'Bell', library: 'lucide', tags: ['notification', 'alert', 'reminder', 'alarm'], category: 'communication' },
  { name: 'Users', library: 'lucide', tags: ['people', 'group', 'team', 'community'], category: 'people' },
  { name: 'User', library: 'lucide', tags: ['person', 'profile', 'account', 'individual'], category: 'people' },
  { name: 'UserPlus', library: 'lucide', tags: ['add', 'person', 'invite', 'new'], category: 'people' },
  { name: 'Calendar', library: 'lucide', tags: ['date', 'schedule', 'time', 'event'], category: 'time' },
  { name: 'Clock', library: 'lucide', tags: ['time', 'hour', 'minute', 'watch'], category: 'time' },
  { name: 'Timer', library: 'lucide', tags: ['countdown', 'time', 'stopwatch', 'duration'], category: 'time' },
  { name: 'Home', library: 'lucide', tags: ['house', 'residence', 'building', 'property'], category: 'general' },
  { name: 'Building', library: 'lucide', tags: ['office', 'business', 'structure', 'company'], category: 'general' },
  { name: 'MapPin', library: 'lucide', tags: ['location', 'place', 'address', 'marker'], category: 'general' },
  { name: 'Globe', library: 'lucide', tags: ['world', 'international', 'global', 'earth'], category: 'general' },
  { name: 'Map', library: 'lucide', tags: ['navigation', 'location', 'direction', 'route'], category: 'general' },
  { name: 'Shield', library: 'lucide', tags: ['security', 'protection', 'safe', 'guard'], category: 'security' },
  { name: 'Lock', library: 'lucide', tags: ['security', 'private', 'secure', 'password'], category: 'security' },
  { name: 'Unlock', library: 'lucide', tags: ['open', 'access', 'security', 'public'], category: 'security' },
  { name: 'Key', library: 'lucide', tags: ['password', 'access', 'security', 'unlock'], category: 'security' },
  { name: 'Eye', library: 'lucide', tags: ['view', 'look', 'see', 'visible'], category: 'general' },
  { name: 'EyeOff', library: 'lucide', tags: ['hide', 'invisible', 'hidden', 'privacy'], category: 'general' },
  { name: 'Check', library: 'lucide', tags: ['correct', 'done', 'success', 'complete'], category: 'status' },
  { name: 'CheckCircle', library: 'lucide', tags: ['success', 'done', 'complete', 'confirmed'], category: 'status' },
  { name: 'X', library: 'lucide', tags: ['close', 'cancel', 'remove', 'delete'], category: 'status' },
  { name: 'XCircle', library: 'lucide', tags: ['error', 'cancel', 'close', 'failed'], category: 'status' },
  { name: 'AlertTriangle', library: 'lucide', tags: ['warning', 'caution', 'alert', 'danger'], category: 'status' },
  { name: 'AlertCircle', library: 'lucide', tags: ['warning', 'info', 'alert', 'caution'], category: 'status' },
  { name: 'Info', library: 'lucide', tags: ['information', 'help', 'details', 'about'], category: 'status' },
  { name: 'Star', library: 'lucide', tags: ['favorite', 'rating', 'bookmark', 'featured'], category: 'general' },
  { name: 'Bookmark', library: 'lucide', tags: ['save', 'mark', 'favorite', 'flag'], category: 'general' },
  { name: 'Download', library: 'lucide', tags: ['save', 'export', 'get', 'retrieve'], category: 'actions' },
  { name: 'Upload', library: 'lucide', tags: ['send', 'import', 'share', 'transfer'], category: 'actions' },
  { name: 'Share', library: 'lucide', tags: ['send', 'distribute', 'forward', 'export'], category: 'actions' },
  { name: 'Copy', library: 'lucide', tags: ['duplicate', 'clone', 'replicate', 'paste'], category: 'actions' },
  { name: 'Edit', library: 'lucide', tags: ['modify', 'change', 'update', 'pencil'], category: 'actions' },
  { name: 'Trash', library: 'lucide', tags: ['delete', 'remove', 'discard', 'bin'], category: 'actions' },
  { name: 'Settings', library: 'lucide', tags: ['config', 'options', 'preferences', 'gear'], category: 'actions' },
  { name: 'Search', library: 'lucide', tags: ['find', 'look', 'query', 'magnify'], category: 'actions' },
  { name: 'Filter', library: 'lucide', tags: ['sort', 'organize', 'refine', 'select'], category: 'actions' },
  { name: 'Plus', library: 'lucide', tags: ['add', 'new', 'create', 'increase'], category: 'actions' },
  { name: 'Minus', library: 'lucide', tags: ['remove', 'subtract', 'decrease', 'less'], category: 'actions' },
  { name: 'Sun', library: 'lucide', tags: ['light', 'bright', 'day', 'weather'], category: 'weather' },
  { name: 'Moon', library: 'lucide', tags: ['night', 'dark', 'sleep', 'weather'], category: 'weather' },
  { name: 'Cloud', library: 'lucide', tags: ['weather', 'sky', 'overcast', 'storage'], category: 'weather' },
  { name: 'CloudRain', library: 'lucide', tags: ['weather', 'rainy', 'precipitation', 'storm'], category: 'weather' },
  { name: 'Zap', library: 'lucide', tags: ['lightning', 'power', 'energy', 'electric'], category: 'general' },
  { name: 'Battery', library: 'lucide', tags: ['power', 'charge', 'energy', 'device'], category: 'technology' },
  { name: 'Flame', library: 'lucide', tags: ['fire', 'hot', 'burn', 'heat'], category: 'general' },
  { name: 'Droplet', library: 'lucide', tags: ['water', 'liquid', 'drop', 'wet'], category: 'general' },
  { name: 'Leaf', library: 'lucide', tags: ['nature', 'plant', 'eco', 'green'], category: 'nature' },
  { name: 'Tree', library: 'lucide', tags: ['nature', 'forest', 'plant', 'environment'], category: 'nature' },
  { name: 'Flower', library: 'lucide', tags: ['nature', 'plant', 'bloom', 'garden'], category: 'nature' },
  { name: 'ShoppingCart', library: 'lucide', tags: ['buy', 'purchase', 'shop', 'ecommerce'], category: 'commerce' },
  { name: 'ShoppingBag', library: 'lucide', tags: ['buy', 'purchase', 'shop', 'bag'], category: 'commerce' },
  { name: 'Tag', library: 'lucide', tags: ['label', 'price', 'category', 'mark'], category: 'commerce' },
  { name: 'Gift', library: 'lucide', tags: ['present', 'reward', 'bonus', 'prize'], category: 'general' },
  { name: 'Award', library: 'lucide', tags: ['prize', 'trophy', 'achievement', 'medal'], category: 'general' },
  { name: 'Target', library: 'lucide', tags: ['goal', 'aim', 'objective', 'focus'], category: 'general' },
  { name: 'Flag', library: 'lucide', tags: ['marker', 'banner', 'country', 'signal'], category: 'general' },
  { name: 'ThumbsUp', library: 'lucide', tags: ['like', 'approve', 'good', 'positive'], category: 'feedback' },
  { name: 'ThumbsDown', library: 'lucide', tags: ['dislike', 'bad', 'negative', 'disapprove'], category: 'feedback' },
  { name: 'Smile', library: 'lucide', tags: ['happy', 'emotion', 'positive', 'face'], category: 'feedback' },
  { name: 'Frown', library: 'lucide', tags: ['sad', 'unhappy', 'emotion', 'negative'], category: 'feedback' },
]

// Heroicons list (popular subset)
export const HEROICONS: IconMetadata[] = [
  { name: 'HeartIcon', library: 'heroicons', tags: ['love', 'favorite', 'like', 'health'], category: 'general' },
  { name: 'CurrencyDollarIcon', library: 'heroicons', tags: ['money', 'finance', 'cost', 'payment'], category: 'finance' },
  { name: 'BanknotesIcon', library: 'heroicons', tags: ['money', 'cash', 'payment', 'finance'], category: 'finance' },
  { name: 'CreditCardIcon', library: 'heroicons', tags: ['payment', 'card', 'finance', 'transaction'], category: 'finance' },
  { name: 'ChartBarIcon', library: 'heroicons', tags: ['graph', 'data', 'statistics', 'analytics'], category: 'finance' },
  { name: 'ChartPieIcon', library: 'heroicons', tags: ['graph', 'data', 'statistics', 'analytics'], category: 'finance' },
  { name: 'PhoneIcon', library: 'heroicons', tags: ['call', 'contact', 'telephone', 'communication'], category: 'communication' },
  { name: 'EnvelopeIcon', library: 'heroicons', tags: ['email', 'mail', 'message', 'communication'], category: 'communication' },
  { name: 'ChatBubbleLeftIcon', library: 'heroicons', tags: ['message', 'communication', 'chat', 'talk'], category: 'communication' },
  { name: 'PaperAirplaneIcon', library: 'heroicons', tags: ['send', 'message', 'communication', 'deliver'], category: 'communication' },
  { name: 'BellIcon', library: 'heroicons', tags: ['notification', 'alert', 'reminder', 'alarm'], category: 'communication' },
  { name: 'UsersIcon', library: 'heroicons', tags: ['people', 'group', 'team', 'community'], category: 'people' },
  { name: 'UserIcon', library: 'heroicons', tags: ['person', 'profile', 'account', 'individual'], category: 'people' },
  { name: 'UserPlusIcon', library: 'heroicons', tags: ['add', 'person', 'invite', 'new'], category: 'people' },
  { name: 'CalendarIcon', library: 'heroicons', tags: ['date', 'schedule', 'time', 'event'], category: 'time' },
  { name: 'ClockIcon', library: 'heroicons', tags: ['time', 'hour', 'minute', 'watch'], category: 'time' },
  { name: 'HomeIcon', library: 'heroicons', tags: ['house', 'residence', 'building', 'main'], category: 'general' },
  { name: 'BuildingOfficeIcon', library: 'heroicons', tags: ['business', 'work', 'company', 'structure'], category: 'general' },
  { name: 'MapPinIcon', library: 'heroicons', tags: ['location', 'place', 'address', 'marker'], category: 'general' },
  { name: 'GlobeAltIcon', library: 'heroicons', tags: ['world', 'international', 'global', 'earth'], category: 'general' },
  { name: 'MapIcon', library: 'heroicons', tags: ['navigation', 'location', 'direction', 'route'], category: 'general' },
  { name: 'ShieldCheckIcon', library: 'heroicons', tags: ['security', 'protection', 'safe', 'verified'], category: 'security' },
  { name: 'LockClosedIcon', library: 'heroicons', tags: ['security', 'private', 'secure', 'password'], category: 'security' },
  { name: 'LockOpenIcon', library: 'heroicons', tags: ['open', 'access', 'public', 'unlocked'], category: 'security' },
  { name: 'KeyIcon', library: 'heroicons', tags: ['password', 'access', 'security', 'unlock'], category: 'security' },
  { name: 'EyeIcon', library: 'heroicons', tags: ['view', 'look', 'see', 'visible'], category: 'general' },
  { name: 'EyeSlashIcon', library: 'heroicons', tags: ['hide', 'invisible', 'hidden', 'privacy'], category: 'general' },
  { name: 'CheckIcon', library: 'heroicons', tags: ['correct', 'done', 'success', 'complete'], category: 'status' },
  { name: 'CheckCircleIcon', library: 'heroicons', tags: ['success', 'done', 'complete', 'confirmed'], category: 'status' },
  { name: 'XMarkIcon', library: 'heroicons', tags: ['close', 'cancel', 'remove', 'delete'], category: 'status' },
  { name: 'XCircleIcon', library: 'heroicons', tags: ['error', 'cancel', 'close', 'failed'], category: 'status' },
  { name: 'ExclamationTriangleIcon', library: 'heroicons', tags: ['warning', 'caution', 'alert', 'danger'], category: 'status' },
  { name: 'ExclamationCircleIcon', library: 'heroicons', tags: ['warning', 'info', 'alert', 'caution'], category: 'status' },
  { name: 'InformationCircleIcon', library: 'heroicons', tags: ['info', 'help', 'details', 'about'], category: 'status' },
  { name: 'StarIcon', library: 'heroicons', tags: ['favorite', 'rating', 'featured', 'bookmark'], category: 'general' },
  { name: 'BookmarkIcon', library: 'heroicons', tags: ['save', 'mark', 'favorite', 'flag'], category: 'general' },
  { name: 'ArrowDownTrayIcon', library: 'heroicons', tags: ['download', 'save', 'export', 'get'], category: 'actions' },
  { name: 'ArrowUpTrayIcon', library: 'heroicons', tags: ['upload', 'send', 'import', 'share'], category: 'actions' },
  { name: 'ShareIcon', library: 'heroicons', tags: ['send', 'distribute', 'forward', 'export'], category: 'actions' },
  { name: 'DocumentDuplicateIcon', library: 'heroicons', tags: ['copy', 'duplicate', 'clone', 'replicate'], category: 'actions' },
  { name: 'PencilIcon', library: 'heroicons', tags: ['edit', 'modify', 'change', 'update'], category: 'actions' },
  { name: 'TrashIcon', library: 'heroicons', tags: ['delete', 'remove', 'discard', 'bin'], category: 'actions' },
  { name: 'Cog6ToothIcon', library: 'heroicons', tags: ['settings', 'config', 'options', 'preferences'], category: 'actions' },
  { name: 'MagnifyingGlassIcon', library: 'heroicons', tags: ['search', 'find', 'look', 'query'], category: 'actions' },
  { name: 'FunnelIcon', library: 'heroicons', tags: ['filter', 'sort', 'organize', 'refine'], category: 'actions' },
  { name: 'PlusIcon', library: 'heroicons', tags: ['add', 'new', 'create', 'increase'], category: 'actions' },
  { name: 'MinusIcon', library: 'heroicons', tags: ['remove', 'subtract', 'decrease', 'less'], category: 'actions' },
  { name: 'SunIcon', library: 'heroicons', tags: ['light', 'bright', 'day', 'weather'], category: 'weather' },
  { name: 'MoonIcon', library: 'heroicons', tags: ['night', 'dark', 'sleep', 'weather'], category: 'weather' },
  { name: 'CloudIcon', library: 'heroicons', tags: ['weather', 'sky', 'overcast', 'storage'], category: 'weather' },
  { name: 'BoltIcon', library: 'heroicons', tags: ['lightning', 'power', 'energy', 'fast'], category: 'general' },
  { name: 'FireIcon', library: 'heroicons', tags: ['flame', 'hot', 'burn', 'heat'], category: 'general' },
  { name: 'ShoppingCartIcon', library: 'heroicons', tags: ['buy', 'purchase', 'shop', 'ecommerce'], category: 'commerce' },
  { name: 'ShoppingBagIcon', library: 'heroicons', tags: ['buy', 'purchase', 'shop', 'bag'], category: 'commerce' },
  { name: 'TagIcon', library: 'heroicons', tags: ['label', 'price', 'category', 'mark'], category: 'commerce' },
  { name: 'GiftIcon', library: 'heroicons', tags: ['present', 'reward', 'bonus', 'prize'], category: 'general' },
  { name: 'TrophyIcon', library: 'heroicons', tags: ['award', 'prize', 'achievement', 'medal'], category: 'general' },
  { name: 'FlagIcon', library: 'heroicons', tags: ['marker', 'banner', 'country', 'signal'], category: 'general' },
  { name: 'HandThumbUpIcon', library: 'heroicons', tags: ['like', 'approve', 'good', 'positive'], category: 'feedback' },
  { name: 'HandThumbDownIcon', library: 'heroicons', tags: ['dislike', 'bad', 'negative', 'disapprove'], category: 'feedback' },
  { name: 'FaceSmileIcon', library: 'heroicons', tags: ['happy', 'emotion', 'positive', 'smile'], category: 'feedback' },
  { name: 'FaceFrownIcon', library: 'heroicons', tags: ['sad', 'unhappy', 'emotion', 'negative'], category: 'feedback' },
  { name: 'BeakerIcon', library: 'heroicons', tags: ['science', 'lab', 'experiment', 'research'], category: 'medical' },
  { name: 'AcademicCapIcon', library: 'heroicons', tags: ['education', 'school', 'learning', 'graduate'], category: 'general' },
]

// Combined list for searching
const ALL_ICONS = [...LUCIDE_ICONS, ...HEROICONS]

// Fuzzy search instance
const fuse = new Fuse(ALL_ICONS, {
  keys: ['name', 'tags', 'category'],
  threshold: 0.3,
  includeScore: true,
})

// Search icons
export function searchIcons(query: string, library?: IconLibrary): IconMetadata[] {
  if (!query.trim()) {
    return library
      ? ALL_ICONS.filter((icon) => icon.library === library)
      : ALL_ICONS
  }

  const results = fuse.search(query)
  const icons = results.map((result) => result.item)

  return library
    ? icons.filter((icon) => icon.library === library)
    : icons
}

// Get icon component by name
export function getIconComponent(library: IconLibrary, iconName: string) {
  if (library === 'lucide') {
    const Icon = (LucideIcons as any)[iconName]
    return Icon || LucideIcons.HelpCircle // Fallback
  } else {
    const Icon = (HeroiconsOutline as any)[iconName]
    return Icon || HeroiconsOutline.QuestionMarkCircleIcon // Fallback
  }
}

// Find closest match for an icon name (for AI suggestions)
export function findClosestIcon(iconName: string, library?: IconLibrary): IconMetadata | null {
  const results = fuse.search(iconName, { limit: 1 })
  if (results.length === 0) return null

  const match = results[0]
  if (library && match.item.library !== library) return null

  // Only return if match score is good enough (< 0.5)
  if (match.score && match.score < 0.5) {
    return match.item
  }

  return null
}
