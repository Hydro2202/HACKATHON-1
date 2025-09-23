import { useState } from "react"
import { Download, FileText, BarChart3, TrendingUp, Calendar, Filter } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const monthlyData = [
  { month: "Jan", occupancy: 85, complaints: 12, requests: 8, revenue: 45000 },
  { month: "Feb", occupancy: 88, complaints: 15, requests: 12, revenue: 48000 },
  { month: "Mar", occupancy: 92, complaints: 8, requests: 6, revenue: 52000 },
  { month: "Apr", occupancy: 89, complaints: 18, requests: 14, revenue: 49000 },
  { month: "May", occupancy: 94, complaints: 22, requests: 18, revenue: 55000 },
  { month: "Jun", occupancy: 91, complaints: 14, requests: 9, revenue: 53000 },
]

const reportsData = [
  {
    id: 1,
    title: "Monthly Occupancy Report",
    description: "Detailed analysis of unit occupancy rates and trends",
    type: "Occupancy",
    lastGenerated: "2024-01-20",
    status: "ready",
    format: "PDF"
  },
  {
    id: 2,
    title: "Complaints Resolution Analysis",
    description: "Performance metrics for complaint handling and resolution times",
    type: "Complaints",
    lastGenerated: "2024-01-19",
    status: "ready",
    format: "Excel"
  },
  {
    id: 3,
    title: "Revenue & Collections Report",
    description: "Monthly revenue analysis and rent collection statistics",
    type: "Financial",
    lastGenerated: "2024-01-18",
    status: "generating",
    format: "PDF"
  },
  {
    id: 4,
    title: "Maintenance Cost Analysis",
    description: "Breakdown of maintenance costs by category and unit",
    type: "Maintenance",
    lastGenerated: "2024-01-17",
    status: "ready",
    format: "Excel"
  },
  {
    id: 5,
    title: "Tenant Satisfaction Survey",
    description: "Analysis of tenant feedback and satisfaction scores",
    type: "Survey",
    lastGenerated: "2024-01-15",
    status: "scheduled",
    format: "PDF"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ready":
      return <Badge className="bg-success text-success-foreground">Ready</Badge>
    case "generating":
      return <Badge className="bg-warning text-warning-foreground">Generating</Badge>
    case "scheduled":
      return <Badge className="bg-primary text-primary-foreground">Scheduled</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState("6months")
  const [reportFilter, setReportFilter] = useState("all")
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<typeof reportsData[number] | null>(null)

  const filteredReports = reportsData.filter(report => {
    if (reportFilter === "all") return true
    return report.type.toLowerCase() === reportFilter.toLowerCase()
  })

  return (
    <>
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-1">Generate and analyze property management reports</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark" onClick={() => setIsGenerateOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Occupancy Trend */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Occupancy Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
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
                      <Line 
                        type="monotone" 
                        dataKey="occupancy" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
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
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--success))" 
                        fill="hsl(var(--success) / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Occupancy</p>
                    <p className="text-3xl font-bold text-foreground">89.8%</p>
                    <p className="text-xs text-success">+2.3% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-foreground">$53K</p>
                    <p className="text-xs text-success">+8.2% growth</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                    <p className="text-3xl font-bold text-foreground">2.4 days</p>
                    <p className="text-xs text-success">-0.3 days improved</p>
                  </div>
                  <Calendar className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reports Generated</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <FileText className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Reports</CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={reportFilter} onValueChange={setReportFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                      <SelectItem value="complaints">Complaints</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <Badge variant="outline">{report.type}</Badge>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                        <span>Format: {report.format}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === "ready" && (
                        <Button variant="outline" size="sm" onClick={() => alert(`Downloading ${report.title} (${report.format})`)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>

    {/* Generate Report */}
    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Custom Report</DialogTitle>
          <DialogDescription>Select filters and format, then generate.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger><SelectValue placeholder="Time range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsGenerateOpen(false); alert('Report generation started'); }}>Generate</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Report Details */}
    <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedReport?.title}</DialogTitle>
          <DialogDescription>{selectedReport?.description}</DialogDescription>
        </DialogHeader>
        {selectedReport && (
          <div className="text-sm text-muted-foreground">
            <p>Type: {selectedReport.type}</p>
            <p>Last generated: {new Date(selectedReport.lastGenerated).toLocaleDateString()}</p>
            <p>Format: {selectedReport.format}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}

export default Reports