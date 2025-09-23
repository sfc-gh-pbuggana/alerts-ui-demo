"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/sidebar"
import { 
  Search, 
  ChevronDown,
  FileText,
  Notebook,
  Activity,
  Calendar,
  Folder,
  ArrowUpDown,
  BarChart3,
  Database,
  User
} from "lucide-react"

export default function HomePage() {

  const quickActions = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Query data",
      description: "Create a SQL file in Workspaces"
    },
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: "Create Warehouse",
      description: "Manage compute resources"
    },
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      title: "Create User",
      description: "Provide access to collaborators"
    },
    {
      icon: <ArrowUpDown className="w-6 h-6 text-blue-600" />,
      title: "Upload local files",
      description: "Quickly convert data into tables"
    }
  ]

  const recentlyViewedData = [
    {
      title: "Customer Analytics Dashboard",
      type: "SQL File",
      viewed: "2 hours ago",
      updated: "3 hours ago"
    },
    {
      title: "MARKETING_CAMPAIGN_EFFECTIVENESS_ANALYSIS",
      type: "Streamlit",
      viewed: "5 hours ago",
      updated: "1 day ago"
    },
    {
      title: "SALES_PERFORMANCE_Q4_INSIGHTS_NOTEBOOK",
      type: "Notebook",
      viewed: "1 day ago",
      updated: "2 days ago"
    },
    {
      title: "Financial Reporting Suite",
      type: "SQL File",
      viewed: "2 days ago",
      updated: "2 days ago"
    },
    {
      title: "INVENTORY_OPTIMIZATION_ML_MODEL",
      type: "Streamlit",
      viewed: "2 days ago",
      updated: "1 week ago"
    },
    {
      title: "Product Performance Analysis",
      type: "SQL Worksheet",
      viewed: "3 days ago",
      updated: "3 days ago"
    },
    {
      title: "Customer Segmentation Study",
      type: "SQL Worksheet",
      viewed: "4 days ago",
      updated: "4 days ago"
    },
    {
      title: "Revenue Forecasting Model",
      type: "SQL Worksheet",
      viewed: "1 week ago",
      updated: "1 week ago"
    },
    {
      title: "Supply Chain Analytics",
      type: "SQL File",
      viewed: "1 week ago",
      updated: "1 week ago"
    },
    {
      title: "E-commerce Conversion Analysis",
      type: "SQL File",
      viewed: "2 weeks ago",
      updated: "2 weeks ago"
    },
    {
      title: "HR_WORKFORCE_ANALYTICS_INSIGHTS",
      type: "Notebook",
      viewed: "2 weeks ago",
      updated: "1 month ago"
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SQL File":
        return <FileText className="w-4 h-4" />
      case "Streamlit":
        return <Activity className="w-4 h-4" />
      case "Notebook":
        return <Notebook className="w-4 h-4" />
      case "SQL Worksheet":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search this account, Marketplace, and documentation"
                className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      {action.icon}
                      <div>
                        <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                        <CardDescription className="text-xs">{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recently viewed</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Button variant="ghost" size="sm" className="text-blue-600 border-b-2 border-blue-600">
                    All projects
                  </Button>
                  <Button variant="ghost" size="sm">
                    Files
                  </Button>
                  <Button variant="ghost" size="sm">
                    Notebooks
                  </Button>
                  <Button variant="ghost" size="sm">
                    Streamlit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dashboards
                  </Button>
                  <Button variant="ghost" size="sm">
                    Folders
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="font-medium">TITLE</TableHead>
                    <TableHead className="font-medium">TYPE</TableHead>
                    <TableHead className="font-medium">VIEWED ↓</TableHead>
                    <TableHead className="font-medium">UPDATED</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyViewedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {getTypeIcon(item.type)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 hover:underline cursor-pointer">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{item.type}</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.viewed}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
