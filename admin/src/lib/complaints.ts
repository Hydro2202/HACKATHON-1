export interface Complaint {
  id: number
  unit: string
  tenant: string
  category: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "resolved"
  submissionDate: string
  assignedTo: string | null
  attachments: number
}

const STORAGE_KEY = "dh_complaints"

const seed: Complaint[] = []

function readAll(): Complaint[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return [...seed]
  }
  return JSON.parse(raw) as Complaint[]
}

function writeAll(items: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listComplaints(): Promise<Complaint[]> {
  await new Promise((r) => setTimeout(r, 120))
  return readAll()
}

export type NewComplaint = Omit<Complaint, "id" | "submissionDate" | "attachments">
export async function addComplaint(data: NewComplaint): Promise<Complaint> {
  const items = readAll()
  const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
  const created: Complaint = {
    id: nextId,
    submissionDate: new Date().toISOString(),
    attachments: 0,
    ...data,
  }
  writeAll([created, ...items])
  await new Promise((r) => setTimeout(r, 100))
  return created
}


