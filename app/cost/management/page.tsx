"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TokenRow, TagToken, AddDestination } from "@/components/alerts/notifications"
import { SearchDestination } from "@/components/alerts/search-destination"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { 
  Search, 
  ChevronDown,
  Bell,
  ArrowLeft,
  RefreshCw,
  Plus,
  MoreHorizontal,
  TrendingDown,
  Info,
  X,
  ChevronRight
} from "lucide-react"

export default function CostManagementPage() {
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [alertEnabled, setAlertEnabled] = useState(false)
  const [emailUsers, setEmailUsers] = useState<string[]>([])
  const [selectedEmailRoles, setSelectedEmailRoles] = useState<string[]>([])
  const [selectedInAppRoles, setSelectedInAppRoles] = useState<string[]>([])
  const [inAppUsers, setInAppUsers] = useState<string[]>([])
  const [externalDestinations, setExternalDestinations] = useState<string[]>([])
  
  // Channel visibility state
  const [visibleChannels, setVisibleChannels] = useState<Set<string>>(new Set(['email']))
  const [emailExpanded, setEmailExpanded] = useState(true)
  const [inAppExpanded, setInAppExpanded] = useState(true)
  const [externalExpanded, setExternalExpanded] = useState(true)

  // Notification management functions
  const addEmailUser = (name: string) => setEmailUsers((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeEmailUser = (name: string) => setEmailUsers((prev) => prev.filter((u) => u !== name))
  const addInAppUser = (name: string) => setInAppUsers((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeInAppUser = (name: string) => setInAppUsers((prev) => prev.filter((u) => u !== name))
  const addEmailRole = (role: string) => setSelectedEmailRoles((prev) => (prev.includes(role) ? prev : [...prev, role]))
  const removeEmailRole = (role: string) => setSelectedEmailRoles((prev) => prev.filter((r) => r !== role))
  const addInAppRole = (role: string) => setSelectedInAppRoles((prev) => (prev.includes(role) ? prev : [...prev, role]))
  const removeInAppRole = (role: string) => setSelectedInAppRoles((prev) => prev.filter((r) => r !== role))
  const addExternalDestination = (name: string) => setExternalDestinations((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeExternalDestination = (name: string) => setExternalDestinations((prev) => prev.filter((d) => d !== name))

  // Channel management functions
  const addChannel = (channelType: string) => {
    setVisibleChannels(prev => new Set([...prev, channelType]))
  }

  const removeChannel = (channelType: string) => {
    if (visibleChannels.size > 1) {
      setVisibleChannels(prev => {
        const newSet = new Set(prev)
        newSet.delete(channelType)
        return newSet
      })
    }
  }

  const availableChannels = [
    { id: 'inapp', label: 'In-App', disabled: visibleChannels.has('inapp') },
    { id: 'external', label: 'External', disabled: visibleChannels.has('external') }
  ].filter(channel => !channel.disabled)

  const ROLES = [
    "ACCOUNTADMIN",
    "SECURITYADMIN", 
    "COSTADMIN",
    "ANALYST"
  ]

  const USER_OPTIONS = [
    "ASILVER","BDAVIS","CBROWN","DWHITE","EJONES","FGREEN","GHARRIS","HCLARK","IJACKSON","JWILLIAMS"
  ]

  const EXTERNAL_DESTINATIONS = [
    "Webhook Destination 1", 
    "Slack Webhook",
    "Microsoft Teams",
    "PagerDuty 1"
  ]

  // Generate anomalies data for the table
  const anomaliesData = [
    {
      date: "August 19, 2025",
      consumption: "$3,282.01",
      expectedRange: "$1,601.94 - $3,095.80",
      overUnder: "+$186.21"
    },
    {
      date: "August 15, 2025", 
      consumption: "$2,295.19",
      expectedRange: "$1,221.07 - $2,154.68",
      overUnder: "+$140.51"
    },
    {
      date: "August 13, 2025",
      consumption: "$1,858.71", 
      expectedRange: "$1,246.10 - $1,823.48",
      overUnder: "+$35.23"
    },
    {
      date: "July 15, 2025",
      consumption: "$1,768.61",
      expectedRange: "$1,241.83 - $1,732.55", 
      overUnder: "+$34.06"
    }
  ]

  // Generate line chart data points
  const generateLineChartData = () => {
    const data = []
    const dates = []
    
    // Generate dates from Mon 23 Fri 27 to Fri 19
    const startDate = new Date('2023-06-23')
    for (let i = 0; i < 120; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    
    // Generate consumption data with trend and anomalies
    for (let i = 0; i < dates.length; i++) {
      const baseValue = 1500
      const trend = i * 20 // Upward trend
      const noise = Math.random() * 400 - 200
      
      let value = baseValue + trend + noise
      
      // Add some anomaly spikes
      if (i === 80 || i === 85 || i === 95 || i === 110) {
        value += 1000 + Math.random() * 500
      }
      
      data.push({
        date: dates[i],
        consumption: Math.max(1000, value),
        isAnomaly: i === 80 || i === 85 || i === 95 || i === 110,
        expectedMin: baseValue + trend * 0.7 + noise * 0.3,
        expectedMax: baseValue + trend * 1.3 + noise * 0.3
      })
    }
    
    return data
  }

  const chartData = generateLineChartData()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Cost Management</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>SNOWFLAKE_LEARNING_WH</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Budget
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <div className="flex space-x-8 border-b">
              <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300 px-0 pb-3 text-gray-600">
                Organization Overview
              </Button>
              <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300 px-0 pb-3 text-gray-600">
                Account Overview
              </Button>
              <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300 px-0 pb-3 text-gray-600">
                Consumption
              </Button>
              <div className="border-b-2 border-blue-600 px-0 pb-3">
                <span className="text-blue-600 font-medium">Anomalies</span>
                <Badge className="ml-2 bg-gray-100 text-gray-600 text-xs">PREVIEW</Badge>
              </div>
              <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300 px-0 pb-3 text-gray-600">
                Budgets
              </Button>
              <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300 px-0 pb-3 text-gray-600">
                Resource Monitors
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Time Period and Account */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Last 3 months</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-gray-100">
              <span>Account</span>
              <span className="font-medium">PM_AWS_US_WEST_2</span>
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Data latency</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Feedback</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowNotificationDialog(true)}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Learn</span>
              </Button>
            </div>
          </div>

          {/* Chart Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">Consumption (USD)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm">Anomaly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span className="text-sm">Expected range</span>
                </div>
              </div>
              
              {/* Line Chart */}
              <div className="relative h-80 bg-gray-50 rounded">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  {/* Grid lines */}
                  {[0, 1000, 2000, 3000, 4000, 5000].map((value, i) => (
                    <g key={i}>
                      <line 
                        x1="50" 
                        y1={250 - (value / 5000) * 200} 
                        x2="750" 
                        y2={250 - (value / 5000) * 200} 
                        stroke="#e5e7eb" 
                        strokeWidth="1"
                      />
                      <text 
                        x="40" 
                        y={255 - (value / 5000) * 200} 
                        fontSize="10" 
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        {value}
                      </text>
                    </g>
                  ))}
                  
                  {/* Expected range area */}
                  <path
                    d={`M 50 ${250 - (1500 / 5000) * 200} ${chartData.map((d, i) => 
                      `L ${50 + (i / chartData.length) * 700} ${250 - (d.expectedMax / 5000) * 200}`
                    ).join(' ')} ${chartData.map((d, i) => 
                      `L ${50 + ((chartData.length - 1 - i) / chartData.length) * 700} ${250 - (chartData[chartData.length - 1 - i].expectedMin / 5000) * 200}`
                    ).join(' ')} Z`}
                    fill="#e5e7eb"
                    opacity="0.3"
                  />
                  
                  {/* Main consumption line */}
                  <path
                    d={`M 50 ${250 - (chartData[0].consumption / 5000) * 200} ${chartData.map((d, i) => 
                      `L ${50 + (i / chartData.length) * 700} ${250 - (d.consumption / 5000) * 200}`
                    ).join(' ')}`}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Anomaly points */}
                  {chartData.map((d, i) => 
                    d.isAnomaly ? (
                      <circle
                        key={i}
                        cx={50 + (i / chartData.length) * 700}
                        cy={250 - (d.consumption / 5000) * 200}
                        r="4"
                        fill="#8b5cf6"
                      />
                    ) : null
                  )}
                  
                  {/* X-axis labels */}
                  <text x="50" y="280" fontSize="10" fill="#6b7280">Mon 23 Fri 27</text>
                  <text x="150" y="280" fontSize="10" fill="#6b7280">July</text>
                  <text x="250" y="280" fontSize="10" fill="#6b7280">Sat 05</text>
                  <text x="350" y="280" fontSize="10" fill="#6b7280">Wed 09</text>
                  <text x="450" y="280" fontSize="10" fill="#6b7280">Jul 13</text>
                  <text x="550" y="280" fontSize="10" fill="#6b7280">Thu 17</text>
                  <text x="650" y="280" fontSize="10" fill="#6b7280">Mon 21</text>
                  <text x="750" y="280" fontSize="10" fill="#6b7280">Fri 19</text>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Anomalies Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>DATE</span>
                        <TrendingDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">CONSUMPTION</TableHead>
                    <TableHead className="font-medium">EXPECTED RANGE</TableHead>
                    <TableHead className="font-medium">OVER/UNDER EXPECTED</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anomaliesData.map((anomaly, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{anomaly.date}</TableCell>
                      <TableCell>{anomaly.consumption}</TableCell>
                      <TableCell>{anomaly.expectedRange}</TableCell>
                      <TableCell className="text-green-600">{anomaly.overUnder}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Configuration Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Cost Anomaly Alert Configuration</DialogTitle>
            <DialogDescription>
              Configure notifications for cost anomaly detection in your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Alert Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Enable Cost Anomaly Alerts</h3>
                <p className="text-sm text-gray-600">Get notified when costs exceed expected thresholds</p>
              </div>
              <Switch
                checked={alertEnabled}
                onCheckedChange={setAlertEnabled}
              />
            </div>

            {alertEnabled && (
              <>
                {/* Email Notifications - Always visible */}
                {visibleChannels.has('email') && (
                  <div className="space-y-4 border rounded-lg p-4 relative">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setEmailExpanded(!emailExpanded)}
                        className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          📧 Email (Snowflake Users)
                        </h4>
                        {emailExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </button>
                      {visibleChannels.size > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-600"
                          onClick={() => removeChannel('email')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {emailExpanded && (
                      <div className="space-y-4 pl-3">
                        <div className="space-y-3">
                          <h5 className="text-md font-medium text-gray-700">Roles</h5>
                          <TokenRow label="" ariaLabel="Search and select roles for email notifications">
                            <SearchDestination options={ROLES} selected={selectedEmailRoles} onAdd={addEmailRole} placeholder="Search to add roles" />
                          </TokenRow>
                          {selectedEmailRoles.length > 0 && (
                            <div className="min-h-[36px] flex flex-wrap gap-2">
                              {selectedEmailRoles.map((role) => (
                                <TagToken key={role} text={role} onRemove={() => removeEmailRole(role)} />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-md font-medium text-gray-700">Users</h5>
                          <TokenRow label="" ariaLabel="Add specific users for email notifications">
                            <SearchDestination options={USER_OPTIONS} selected={emailUsers} onAdd={addEmailUser} />
                          </TokenRow>
                          {emailUsers.length > 0 && (
                            <div className="min-h-[36px] flex flex-wrap gap-2">
                              {emailUsers.map((u) => (
                                <TagToken key={u} text={u} onRemove={() => removeEmailUser(u)} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* In-App Notifications */}
                {visibleChannels.has('inapp') && (
                  <div className="space-y-4 border rounded-lg p-4 relative">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setInAppExpanded(!inAppExpanded)}
                        className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          📱 In-App (Snowsight)
                        </h4>
                        {inAppExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </button>
                      {visibleChannels.size > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-600"
                          onClick={() => removeChannel('inapp')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {inAppExpanded && (
                      <div className="space-y-4 pl-3">
                        <div className="space-y-3">
                          <h5 className="text-md font-medium text-gray-700">Roles</h5>
                          <TokenRow label="" ariaLabel="Search and select roles for in-app notifications">
                            <SearchDestination options={ROLES} selected={selectedInAppRoles} onAdd={addInAppRole} placeholder="Search to add roles" />
                          </TokenRow>
                          {selectedInAppRoles.length > 0 && (
                            <div className="min-h-[36px] flex flex-wrap gap-2">
                              {selectedInAppRoles.map((role) => (
                                <TagToken key={role} text={role} onRemove={() => removeInAppRole(role)} />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-md font-medium text-gray-700">Users</h5>
                          <TokenRow label="" ariaLabel="Add Snowsight users for in-app notifications">
                            <SearchDestination options={USER_OPTIONS} selected={inAppUsers} onAdd={addInAppUser} />
                          </TokenRow>
                          {inAppUsers.length > 0 && (
                            <div className="min-h-[36px] flex flex-wrap gap-2">
                              {inAppUsers.map((u) => (
                                <TagToken key={u} text={u} onRemove={() => removeInAppUser(u)} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* External Notifications */}
                {visibleChannels.has('external') && (
                  <div className="space-y-4 border rounded-lg p-4 relative">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExternalExpanded(!externalExpanded)}
                        className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          🔗 External
                        </h4>
                        {externalExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </button>
                      {visibleChannels.size > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-600"
                          onClick={() => removeChannel('external')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {externalExpanded && (
                      <div className="space-y-3 pl-3">
                        <TokenRow label="External notification destinations">
                          {externalDestinations.map((d) => (
                            <TagToken key={d} text={d} onRemove={() => removeExternalDestination(d)} />
                          ))}
                          <AddDestination onAdd={addExternalDestination} options={EXTERNAL_DESTINATIONS} />
                        </TokenRow>
                      </div>
                    )}
                  </div>
                )}

                {/* More Channels Button */}
                {availableChannels.length > 0 && (
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          More channels
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {availableChannels.map((channel) => (
                          <DropdownMenuItem 
                            key={channel.id}
                            onClick={() => addChannel(channel.id)}
                            className="cursor-pointer"
                          >
                            {channel.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowNotificationDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  // Save configuration logic here
                  setShowNotificationDialog(false)
                }}
                disabled={!alertEnabled}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}