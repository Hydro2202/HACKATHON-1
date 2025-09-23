import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, AlertTriangle, CheckCircle, User, Wrench } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "complaint",
    title: "Plumbing issue reported",
    unit: "Unit 12A",
    tenant: "Sarah Johnson",
    time: "2 minutes ago",
    status: "pending",
    priority: "high"
  },
  {
    id: 2,
    type: "request",
    title: "Amenity booking approved",
    unit: "Unit 8B",
    tenant: "Mike Chen",
    time: "15 minutes ago",
    status: "approved",
    priority: "low"
  },
  {
    id: 3,
    type: "maintenance",
    title: "HVAC maintenance completed",
    unit: "Unit 5C",
    tenant: "Emma Davis",
    time: "1 hour ago",
    status: "completed",
    priority: "medium"
  },
  {
    id: 4,
    type: "complaint",
    title: "Noise complaint resolved",
    unit: "Unit 15A",
    tenant: "John Smith",
    time: "3 hours ago",
    status: "resolved",
    priority: "medium"
  },
  {
    id: 5,
    type: "request",
    title: "Move-in request submitted",
    unit: "Unit 3D",
    tenant: "Lisa Wong",
    time: "5 hours ago",
    status: "pending",
    priority: "low"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="destructive" className="text-xs">Pending</Badge>
    case "approved":
    case "completed":
    case "resolved":
      return <Badge variant="default" className="text-xs bg-success text-success-foreground">Resolved</Badge>
    case "in-progress":
      return <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">In Progress</Badge>
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "complaint":
      return <AlertTriangle className="w-4 h-4 text-destructive" />
    case "request":
      return <User className="w-4 h-4 text-primary" />
    case "maintenance":
      return <Wrench className="w-4 h-4 text-warning" />
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

export function RecentActivity() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest updates and actions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{activity.unit}</span>
                  <span>•</span>
                  <span>{activity.tenant}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                </div>
              </div>

              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {activity.tenant.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}