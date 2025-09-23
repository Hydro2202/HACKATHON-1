import { Building2, Users, AlertTriangle, ClipboardList, TrendingUp, Clock } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { OccupancyChart } from "@/components/dashboard/OccupancyChart"
import { ComplaintsChart } from "@/components/dashboard/ComplaintsChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's what's happening at your property.</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Units"
              value="190"
              change="+2 from last month"
              changeType="positive"
              icon={Building2}
              description="Occupied: 142"
            />
            <StatsCard
              title="Active Tenants"
              value="142"
              change="74.7% occupancy"
              changeType="positive"
              icon={Users}
            />
            <StatsCard
              title="Open Complaints"
              value="23"
              change="-5 from yesterday"
              changeType="positive"
              icon={AlertTriangle}
            />
            <StatsCard
              title="Pending Requests"
              value="16"
              change="Avg. 2.3 days to resolve"
              changeType="neutral"
              icon={ClipboardList}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OccupancyChart />
            <ComplaintsChart />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 card-shadow">
                <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary font-medium transition-smooth" onClick={() => navigate('/units')}>
                    Add New Unit
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-warning/5 hover:bg-warning/10 text-warning font-medium transition-smooth" onClick={() => navigate('/requests')}>
                    Schedule Maintenance
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-success/5 hover:bg-success/10 text-success font-medium transition-smooth" onClick={() => navigate('/reports')}>
                    Generate Report
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-card rounded-lg p-4 card-shadow">
                <h3 className="font-semibold text-foreground mb-3">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <span className="text-xs text-success font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Backup</span>
                    <span className="text-xs text-success font-medium">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Notifications</span>
                    <span className="text-xs text-success font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
