export interface Unit {
  id: number
  number: string
  floor: number
  type: string
  tenant: string | null
  contact: string | null
  status: "occupied" | "available" | "maintenance" | "reserved"
  moveIn: string | null
  rent: number
}

const STORAGE_KEY = "dh_units"

const seedData: Unit[] = [
  { id: 1, number: "12A", floor: 12, type: "2BR/2BA", tenant: "Sarah Johnson", contact: "(555) 123-4567", status: "occupied", moveIn: "2023-01-15", rent: 2800 },
  { id: 2, number: "8B", floor: 8, type: "1BR/1BA", tenant: "Mike Chen", contact: "(555) 234-5678", status: "occupied", moveIn: "2023-03-20", rent: 2200 },
  { id: 3, number: "5C", floor: 5, type: "3BR/2BA", tenant: "Emma Davis", contact: "(555) 345-6789", status: "maintenance", moveIn: null, rent: 3200 },
  { id: 4, number: "15A", floor: 15, type: "2BR/2BA", tenant: "John Smith", contact: "(555) 456-7890", status: "occupied", moveIn: "2022-11-10", rent: 2900 },
  { id: 5, number: "3D", floor: 3, type: "Studio", tenant: null, contact: null, status: "available", moveIn: null, rent: 1800 },
  { id: 6, number: "20B", floor: 20, type: "Penthouse", tenant: "Lisa Wong", contact: "(555) 567-8901", status: "occupied", moveIn: "2023-06-01", rent: 4500 },
  { id: 7, number: "7A", floor: 7, type: "2BR/1BA", tenant: null, contact: null, status: "reserved", moveIn: null, rent: 2600 },
  { id: 8, number: "14C", floor: 14, type: "1BR/1BA", tenant: "David Kim", contact: "(555) 678-9012", status: "occupied", moveIn: "2023-02-28", rent: 2300 },
]

function readAll(): Unit[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    return seedData
  }
  return JSON.parse(raw) as Unit[]
}

function writeAll(units: Unit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(units))
}

export async function listUnits(): Promise<Unit[]> {
  await new Promise((r) => setTimeout(r, 200))
  return readAll()
}

export async function getUnit(id: number): Promise<Unit | undefined> {
  await new Promise((r) => setTimeout(r, 100))
  return readAll().find((u) => u.id === id)
}

export type NewUnit = Omit<Unit, "id">
export async function addUnit(data: NewUnit): Promise<Unit> {
  const units = readAll()
  const nextId = units.length ? Math.max(...units.map((u) => u.id)) + 1 : 1
  const unit: Unit = { id: nextId, ...data }
  writeAll([unit, ...units])
  await new Promise((r) => setTimeout(r, 150))
  return unit
}

export async function updateUnit(id: number, data: Partial<NewUnit>): Promise<Unit> {
  const units = readAll()
  const idx = units.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error("Unit not found")
  const updated = { ...units[idx], ...data }
  units[idx] = updated
  writeAll(units)
  await new Promise((r) => setTimeout(r, 150))
  return updated
}


