import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", pending: 12, resolved: 45, inProgress: 8 },
  { month: "Feb", pending: 15, resolved: 38, inProgress: 12 },
  { month: "Mar", pending: 8, resolved: 52, inProgress: 6 },
  { month: "Apr", pending: 18, resolved: 41, inProgress: 14 },
  { month: "May", pending: 22, resolved: 35, inProgress: 18 },
  { month: "Jun", pending: 14, resolved: 48, inProgress: 9 },
]

export function ComplaintsChart() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Complaints Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly complaint resolution trends</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="resolved" fill="hsl(var(--success))" name="Resolved" radius={[2, 2, 0, 0]} />
              <Bar dataKey="inProgress" fill="hsl(var(--warning))" name="In Progress" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(var(--destructive))" name="Pending" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}