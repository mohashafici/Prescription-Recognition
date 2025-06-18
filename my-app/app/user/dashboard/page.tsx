"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, Clock, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardStats {
  total_uploads: number;
  last_upload: {
    created_at: string;
    ocr_text: string;
    found_drugs: string[];
  } | null;
  recent_scans: Array<{
    _id: string;
    created_at: string;
    ocr_text: string;
    found_drugs: string[];
  }>;
  success_rate: number;
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/user/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Prescription
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_uploads || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total prescriptions processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.success_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Prescriptions with drugs found
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Upload</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {stats?.last_upload ? formatDate(stats.last_upload.created_at) : 'No uploads yet'}
            </div>
            {stats?.last_upload && (
              <p className="text-xs text-muted-foreground">
                {stats.last_upload.found_drugs.length} drugs found
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recent_scans.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scans in the last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your most recent prescription scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recent_scans.length === 0 ? (
              <p className="text-center text-muted-foreground">No recent scans</p>
            ) : (
              <div className="space-y-4">
                {stats?.recent_scans.map((scan) => (
                  <div key={scan._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {scan.ocr_text.length > 100 
                          ? scan.ocr_text.substring(0, 100) + '...' 
                          : scan.ocr_text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(scan.created_at)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scan.found_drugs.length} drugs found
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/user/upload">
              <Button className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Prescription
              </Button>
            </Link>
            <Link href="/user/history">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 