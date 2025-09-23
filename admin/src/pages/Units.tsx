import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Plus, Eye, Edit, MoreHorizontal } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { listUnits, addUnit, updateUnit, Unit } from "@/lib/units"

const emptyForm: Omit<Unit, "id"> = {
  number: "",
  floor: 1,
  type: "Studio",
  tenant: null,
  contact: null,
  status: "available",
  moveIn: null,
  rent: 0,
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "occupied":
      return <Badge className="bg-success text-success-foreground">Occupied</Badge>
    case "available":
      return <Badge className="bg-primary text-primary-foreground">Available</Badge>
    case "maintenance":
      return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>
    case "reserved":
      return <Badge className="bg-accent text-accent-foreground">Reserved</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const Units = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [items, setItems] = useState<Unit[]>([])
  const [details, setDetails] = useState<Unit | null>(null)
  const [editItem, setEditItem] = useState<Unit | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)

  useEffect(() => {
    listUnits().then(setItems)
  }, [])

  const filteredUnits = useMemo(() => items.filter(unit => {
    const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                         unit.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter
    
    return matchesSearch && matchesStatus
  }), [items, searchTerm, statusFilter])

  return (
    <>
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Units Management</h1>
              <p className="text-muted-foreground mt-1">Manage all property units and tenant information</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark" onClick={() => { setAddForm(emptyForm); setIsAddOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </div>

          {/* Filters */}
          <Card className="card-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by unit number, tenant name, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Units Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Units ({filteredUnits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Move-in Date</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit) => (
                      <TableRow key={unit.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">{unit.number}</TableCell>
                        <TableCell>{unit.floor}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.tenant || <span className="text-muted-foreground">Vacant</span>}</TableCell>
                        <TableCell>{unit.contact || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell>{getStatusBadge(unit.status)}</TableCell>
                        <TableCell>
                          {unit.moveIn ? new Date(unit.moveIn).toLocaleDateString() : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="font-medium">${unit.rent.toLocaleString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetails(unit)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditItem(unit)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Unit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>

    {/* View Details */}
    <Dialog open={!!details} onOpenChange={() => setDetails(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unit {details?.number}</DialogTitle>
          <DialogDescription>Overview</DialogDescription>
        </DialogHeader>
        {details && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><span className="text-muted-foreground">Floor:</span> {details.floor}</p>
            <p><span className="text-muted-foreground">Type:</span> {details.type}</p>
            <p><span className="text-muted-foreground">Tenant:</span> {details.tenant || "Vacant"}</p>
            <p><span className="text-muted-foreground">Contact:</span> {details.contact || "-"}</p>
            <p><span className="text-muted-foreground">Status:</span> {details.status}</p>
            <p><span className="text-muted-foreground">Move-in:</span> {details.moveIn ? new Date(details.moveIn).toLocaleDateString() : "-"}</p>
            <p className="col-span-2"><span className="text-muted-foreground">Rent:</span> ${details.rent.toLocaleString()}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Add Unit */}
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Unit</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Number" value={addForm.number} onChange={(e) => setAddForm({ ...addForm, number: e.target.value })} />
          <Input type="number" placeholder="Floor" value={addForm.floor} onChange={(e) => setAddForm({ ...addForm, floor: Number(e.target.value) })} />
          <Input placeholder="Type" value={addForm.type} onChange={(e) => setAddForm({ ...addForm, type: e.target.value })} />
          <Input placeholder="Tenant (optional)" value={addForm.tenant ?? ""} onChange={(e) => setAddForm({ ...addForm, tenant: e.target.value || null })} />
          <Input placeholder="Contact (optional)" value={addForm.contact ?? ""} onChange={(e) => setAddForm({ ...addForm, contact: e.target.value || null })} />
          <Select value={addForm.status} onValueChange={(v) => setAddForm({ ...addForm, status: v as Unit["status"] })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={addForm.moveIn ?? ""} onChange={(e) => setAddForm({ ...addForm, moveIn: e.target.value || null })} />
          <Input type="number" placeholder="Rent" value={addForm.rent} onChange={(e) => setAddForm({ ...addForm, rent: Number(e.target.value) })} />
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={async () => { const created = await addUnit(addForm); setItems((prev) => [created, ...prev]); setIsAddOpen(false) }}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Edit Unit */}
    <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Unit {editItem?.number}</DialogTitle>
        </DialogHeader>
        {editItem && (
          <div className="grid grid-cols-2 gap-3">
            <Input value={editItem.number} onChange={(e) => setEditItem({ ...editItem, number: e.target.value })} />
            <Input type="number" value={editItem.floor} onChange={(e) => setEditItem({ ...editItem, floor: Number(e.target.value) })} />
            <Input value={editItem.type} onChange={(e) => setEditItem({ ...editItem, type: e.target.value })} />
            <Input value={editItem.tenant ?? ""} onChange={(e) => setEditItem({ ...editItem, tenant: e.target.value || null })} />
            <Input value={editItem.contact ?? ""} onChange={(e) => setEditItem({ ...editItem, contact: e.target.value || null })} />
            <Select value={editItem.status} onValueChange={(v) => setEditItem({ ...editItem, status: v as Unit["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={editItem.moveIn ?? ""} onChange={(e) => setEditItem({ ...editItem, moveIn: e.target.value || null })} />
            <Input type="number" value={editItem.rent} onChange={(e) => setEditItem({ ...editItem, rent: Number(e.target.value) })} />
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button onClick={async () => { if (!editItem) return; const saved = await updateUnit(editItem.id, { ...editItem, id: undefined as any }); setItems((prev) => prev.map((u) => u.id === saved.id ? saved : u)); setEditItem(null) }}>Save Changes</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}

export default Units