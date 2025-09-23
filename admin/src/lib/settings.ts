export interface GeneralSettings {
  systemName: string
  timezone: string
  language: string
  currency: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  complaints: boolean
  requests: boolean
  maintenance: boolean
}

export interface UserSettings {
  adminName: string
  adminEmail: string
  role: string
  permissions: {
    manageUnits: boolean
    handleComplaints: boolean
    approveRequests: boolean
    generateReports: boolean
  }
}

export interface PropertySettings {
  propertyName: string
  totalUnits: number
  propertyAddress: string
  managementCompany: string
  emergencyContact: string
  amenities: string
}

export interface SecuritySettings {
  requireComplex: boolean
  twoFactor: boolean
  sessionTimeout: number
  maxSessions: number
  autoBackup: boolean
  backupTime: string
  retentionDays: number
}

export interface AppSettings {
  general: GeneralSettings
  notifications: NotificationSettings
  users: UserSettings
  property: PropertySettings
  security: SecuritySettings
}

const STORAGE_KEY = "dh_settings"

export function getDefaultSettings(): AppSettings {
  return {
    general: {
      systemName: "CondoAdmin Management System",
      timezone: "est",
      language: "en",
      currency: "usd",
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      complaints: true,
      requests: true,
      maintenance: false,
    },
    users: {
      adminName: "Admin User",
      adminEmail: "admin@condo.com",
      role: "admin",
      permissions: {
        manageUnits: true,
        handleComplaints: true,
        approveRequests: true,
        generateReports: true,
      },
    },
    property: {
      propertyName: "Sunset Tower Condominiums",
      totalUnits: 190,
      propertyAddress: "123 Main Street, Downtown, City, State 12345",
      managementCompany: "Property Management Co.",
      emergencyContact: "(555) 123-4567",
      amenities: "Pool, Gym, Rooftop Deck, Parking Garage, Concierge",
    },
    security: {
      requireComplex: true,
      twoFactor: false,
      sessionTimeout: 60,
      maxSessions: 3,
      autoBackup: true,
      backupTime: "02:00",
      retentionDays: 30,
    },
  }
}

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const defaults = getDefaultSettings()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  try {
    return { ...getDefaultSettings(), ...(JSON.parse(raw) as AppSettings) }
  } catch {
    const defaults = getDefaultSettings()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
}

export function saveSettings(partial: Partial<AppSettings>) {
  const current = loadSettings()
  const merged = { ...current, ...partial } as AppSettings
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}


