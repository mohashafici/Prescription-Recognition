"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, User, FileText, Calendar, Pill, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays } from "date-fns"

interface PrescriptionLog {
  _id: string;
  ocr_text: string;
  found_drugs: string[];
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

export default function LogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<PrescriptionLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [dateRange, setDateRange] = useState("7") // Default to last 7 days
  const [sortField, setSortField] = useState<keyof PrescriptionLog>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('http://localhost:5000/api/admin/logs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch logs')
        }

        const data = await response.json()
        setLogs(data.logs)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch logs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [toast])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  const handleSort = (field: keyof PrescriptionLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredLogs = logs
    .filter((log) => {
      const searchLower = searchQuery.toLowerCase()
      const logDate = new Date(log.created_at)
      const cutoffDate = subDays(new Date(), parseInt(dateRange))
      
      return (
        (log.user.name.toLowerCase().includes(searchLower) ||
        log.user.email.toLowerCase().includes(searchLower) ||
        log.ocr_text.toLowerCase().includes(searchLower) ||
        log.found_drugs.some(drug => drug.toLowerCase().includes(searchLower))) &&
        logDate >= cutoffDate
      )
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const modifier = sortDirection === "asc" ? 1 : -1
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier
      }
      return 0
    })

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescription Logs</h2>
          <p className="text-muted-foreground">
            View all prescription recognition logs across all users
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, text, or drugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No logs found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground px-4">
              <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("user")}>
                User <ArrowUpDown className="h-4 w-4" />
              </div>
              <div className="col-span-5 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("ocr_text")}>
                OCR Text <ArrowUpDown className="h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("found_drugs")}>
                Drugs <ArrowUpDown className="h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("created_at")}>
                Date <ArrowUpDown className="h-4 w-4" />
              </div>
            </div>
            {paginatedLogs.map((log) => (
              <Card key={log._id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{log.user.name}</p>
                          <p className="text-sm text-muted-foreground">{log.user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-5">
                      <p className="text-sm line-clamp-2">{log.ocr_text}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {log.found_drugs.slice(0, 2).map((drug, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {drug}
                          </Badge>
                        ))}
                        {log.found_drugs.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{log.found_drugs.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 