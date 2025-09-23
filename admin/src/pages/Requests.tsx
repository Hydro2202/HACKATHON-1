import { useState } from "react"
import { Search, Filter, Plus, Clock, CheckCircle, XCircle, Eye, Calendar } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const requests = [
  {
    id: 1,
    unit: "12A",
    tenant: "Sarah Johnson",
    type: "Move-out",
    title: "Move-out request for end of month",
    description: "Planning to move out by January 31st, need deposit return process",
    priority: "medium",
    status: "pending",
    submissionDate: "2024-01-18",
    requestedDate: "2024-01-31",
    assignedTo: "Property Manager"
  },
  {
    id: 2,
    unit: "8B",
    tenant: "Mike Chen",
    type: "Amenity Booking",
    title: "Pool area reservation for party",
    description: "Request to book pool area for birthday party on weekend",
    priority: "low",
    status: "approved",
    submissionDate: "2024-01-17",
    requestedDate: "2024-01-25",
    assignedTo: "Admin User"
  },
  {
    id: 3,
    unit: "15A",
    tenant: "John Smith",
    type: "Maintenance",
    title: "AC filter replacement request",
    description: "Regular maintenance request for HVAC filter replacement",
    priority: "low",
    status: "completed",
    submissionDate: "2024-01-15",
    requestedDate: "2024-01-20",
    assignedTo: "Maintenance Team"
  },
  {
    id: 4,
    unit: "5C",
    tenant: "Emma Davis",
    type: "Special Request",
    title: "Pet registration approval",
    description: "Request to register new pet according to building policies",
    priority: "medium",
    status: "pending",
    submissionDate: "2024-01-20",
    requestedDate: "2024-01-22",
    assignedTo: null
  },
  {
    id: 5,
    unit: "20B",
    tenant: "Lisa Wong",
    type: "Move-in",
    title: "Early move-in request",
    description: "Request to move in 3 days before lease start date",
    priority: "high",
    status: "rejected",
    submissionDate: "2024-01-16",
    requestedDate: "2024-01-19",
    assignedTo: "Property Manager"
  }
]

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-destructive text-destructive-foreground">High</Badge>
    case "medium":
      return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
    case "low":
      return <Badge className="bg-muted text-muted-foreground">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
    case "approved":
      return <Badge className="bg-success text-success-foreground">Approved</Badge>
    case "completed":
      return <Badge className="bg-primary text-primary-foreground">Completed</Badge>
    case "rejected":
      return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-warning" />
    case "approved":
    case "completed":
      return <CheckCircle className="w-4 h-4 text-success" />
    case "rejected":
      return <XCircle className="w-4 h-4 text-destructive" />
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selected, setSelected] = useState<typeof requests[number] | null>(null)

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type.toLowerCase().includes(typeFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <>
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Requests Management</h1>
              <p className="text-muted-foreground mt-1">Manage tenant requests and special requests</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Request
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-3xl font-bold text-foreground">{requests.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-warning">{requests.filter(r => r.status === 'pending').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold text-success">{requests.filter(r => r.status === 'approved').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-primary">{requests.filter(r => r.status === 'completed').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="card-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests by unit, tenant, type, or title..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="move">Move-in/out</SelectItem>
                    <SelectItem value="amenity">Amenity Booking</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="special">Special Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Requests ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">#{request.id}</TableCell>
                        <TableCell className="font-medium">{request.unit}</TableCell>
                        <TableCell>{request.tenant}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div>
                            <p className="font-medium truncate">{request.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{request.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {getStatusBadge(request.status)}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(request.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {request.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelected(request)}>
                            <Eye className="w-4 h-4" />
                          </Button>
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

    <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request #{selected?.id}</DialogTitle>
          <DialogDescription>{selected?.title}</DialogDescription>
        </DialogHeader>
        {selected && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><span className="text-muted-foreground">Unit:</span> {selected.unit}</p>
            <p><span className="text-muted-foreground">Tenant:</span> {selected.tenant}</p>
            <p><span className="text-muted-foreground">Type:</span> {selected.type}</p>
            <p><span className="text-muted-foreground">Priority:</span> {selected.priority}</p>
            <p className="col-span-2"><span className="text-muted-foreground">Description:</span> {selected.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}

export default Requests