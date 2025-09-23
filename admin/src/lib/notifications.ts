export interface NotificationItem {
  id: string
  title: string
  description?: string
  createdAt: string
  read: boolean
  color?: "green" | "blue" | "amber" | "red"
}

const STORAGE_KEY = "dh_notifications"

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return
  const seed: NotificationItem[] = [
    {
      id: crypto.randomUUID(),
      title: "New request submitted",
      description: "Unit 12B requested maintenance",
      createdAt: new Date().toISOString(),
      read: false,
      color: "green",
    },
    {
      id: crypto.randomUUID(),
      title: "Monthly report ready",
      description: "Download from Reports",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
      color: "blue",
    },
    {
      id: crypto.randomUUID(),
      title: "Pending complaint",
      description: "2 complaints awaiting review",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      color: "amber",
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
}

function readAll(): NotificationItem[] {
  seedIfEmpty()
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as NotificationItem[]) : []
}

function writeAll(items: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  await new Promise((r) => setTimeout(r, 250))
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function markAllRead(): Promise<void> {
  await new Promise((r) => setTimeout(r, 150))
  const items = readAll().map((n) => ({ ...n, read: true }))
  writeAll(items)
}

export async function addNotification(partial: Omit<NotificationItem, "id" | "createdAt" | "read">): Promise<NotificationItem> {
  const newItem: NotificationItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
    ...partial,
  }
  const items = [newItem, ...readAll()]
  writeAll(items)
  return newItem
}

export function getUnreadCount(items: NotificationItem[]): number {
  return items.filter((n) => !n.read).length
}


