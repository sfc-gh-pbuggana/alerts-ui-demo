"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TokenRow, TagToken, AddDestination } from "@/components/alerts/notifications"
import { SearchDestination } from "@/components/alerts/search-destination"
import Sidebar from "@/components/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ArrowLeft, LoaderCircle, CheckCircle2, ChevronDown, ChevronRight, Plus, X } from "lucide-react"
import Link from "next/link"
import { getSQLTemplate } from "@/lib/sql-templates"
import "@/styles/alerts.css"

// Cost Management icon component - Receipt design
const CostManagementIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 2h16l-2 20H6L4 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6h12" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 10h10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 13h8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 16h6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="4" r="1" fill="currentColor"/>
  </svg>
)

// Edit pencil icon
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m10 2.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Professional notification channel icons
const EmailIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InAppIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 2a6 6 0 016 6c0 7-6 9-6 9s-6-2-6-9a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ExternalIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.5 14.5h7a2 2 0 002-2v-5a2 2 0 00-2-2h-7a2 2 0 00-2 2v5a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="1" fill="currentColor"/>
    <path d="M6.5 14.5L4 17M13.5 14.5L16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

interface AlertTemplate {
  id: string
  name: string
  description: string
  sqlTemplate: string
  enabled: boolean
}

const costManagementTemplates: AlertTemplate[] = [
  {
    id: "resource-monitor-notification",
    name: "Resource Monitor Notifications",
    description: "Receive email notifications from resource monitors",
    sqlTemplate: "",
    enabled: false
  },
  {
    id: "cost-spike",
    name: "Anomalies",
    description: "Get alerted when costs exceed predefined thresholds",
    sqlTemplate: "",
    enabled: false
  },
  {
    id: "budget-threshold-alerts",
    name: "Budget Threshold Alerts",
    description: "Monitor spending against custom budget thresholds",
    sqlTemplate: "",
    enabled: false
  }
]

export default function CostManagementAlertsPage() {
  const searchParams = useSearchParams()
  const [templateStates, setTemplateStates] = useState<Record<string, boolean>>({})
  const [inAppUsers, setInAppUsers] = useState<string[]>([])
  const [emailUsers, setEmailUsers] = useState<string[]>([])
  const [selectedEmailRoles, setSelectedEmailRoles] = useState<string[]>([])
  const [selectedInAppRoles, setSelectedInAppRoles] = useState<string[]>([])
  const [externalDestinations, setExternalDestinations] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [budgetThresholds, setBudgetThresholds] = useState<{[key: string]: string}>({
    "Production": "10000",
    "Development": "5000",
    "Testing": "2000"
  })
  const [highlightedTemplate, setHighlightedTemplate] = useState<string | null>(null)
  
  // Channel visibility state
  const [visibleChannels, setVisibleChannels] = useState<Set<string>>(new Set(['email']))
  
  // Expandable section states
  const [emailRolesExpanded, setEmailRolesExpanded] = useState(true)
  const [emailUsersExpanded, setEmailUsersExpanded] = useState(false)
  const [inAppExpanded, setInAppExpanded] = useState(true)
  const [inAppRolesExpanded, setInAppRolesExpanded] = useState(true)
  const [inAppUsersExpanded, setInAppUsersExpanded] = useState(false)
  const [externalExpanded, setExternalExpanded] = useState(true)

  // Handle highlight parameter from URL
  useEffect(() => {
    const highlight = searchParams.get('highlight')
    if (highlight) {
      setHighlightedTemplate(highlight)
      // Pre-select the highlighted template
      setTemplateStates(prev => ({
        ...prev,
        [highlight]: true
      }))
      // Set a timeout to remove the highlight after animation
      setTimeout(() => {
        setHighlightedTemplate(null)
      }, 3000)
    }
  }, [searchParams])

  const handleTemplateToggle = (templateId: string, enabled: boolean) => {
    setTemplateStates(prev => ({
      ...prev,
      [templateId]: enabled
    }))
  }

  const addInAppUser = (name: string) => setInAppUsers((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeInAppUser = (name: string) => setInAppUsers((prev) => prev.filter((u) => u !== name))
  const addEmailUser = (name: string) => setEmailUsers((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeEmailUser = (name: string) => setEmailUsers((prev) => prev.filter((u) => u !== name))
  const addExternalDestination = (name: string) => setExternalDestinations((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeExternalDestination = (name: string) => setExternalDestinations((prev) => prev.filter((d) => d !== name))
  
  const addEmailRole = (role: string) => setSelectedEmailRoles((prev) => (prev.includes(role) ? prev : [...prev, role]))
  const removeEmailRole = (role: string) => setSelectedEmailRoles((prev) => prev.filter((r) => r !== role))
  const addInAppRole = (role: string) => setSelectedInAppRoles((prev) => (prev.includes(role) ? prev : [...prev, role]))
  const removeInAppRole = (role: string) => setSelectedInAppRoles((prev) => prev.filter((r) => r !== role))

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

  const updateBudgetThreshold = (category: string, value: string) => {
    setBudgetThresholds(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const addBudgetCategory = () => {
    const newCategory = `Category ${Object.keys(budgetThresholds).length + 1}`
    setBudgetThresholds(prev => ({
      ...prev,
      [newCategory]: "1000"
    }))
  }

  const removeBudgetCategory = (category: string) => {
    setBudgetThresholds(prev => {
      const newThresholds = { ...prev }
      delete newThresholds[category]
      return newThresholds
    })
  }

  const EXTERNAL_DESTINATIONS = [
    "Webhook Destination 1", 
    "Webhook Destination 2",
    "Google Pubsub Service 1",
    "PagerDuty 1",
    "Slack Webhook",
    "Microsoft Teams"
  ]

  const ROLES = [
    "ACCOUNTADMIN",
    "SECURITYADMIN", 
    "COSTADMIN",
    "ANALYST",
    "PBUGGANA_ALERTS_PRODUCT_ADMIN",
    "AAD_PROVISIONER",
    "AAD_PROVISIONER_SURAJ"
  ]

  const USER_OPTIONS = [
    "ASILVER","BDAVIS","CBROWN","DWHITE","EJONES","FGREEN","GHARRIS","HCLARK","IJACKSON","JWILLIAMS",
    "KADAMS","LLUCAS","MMILLER","NBAKER","OJOHNSON","PLEE","QROBERTS","RTHOMAS","SWILSON","TTAYLOR",
  ]

  const hasSelectedTemplates = Object.values(templateStates).some(enabled => enabled)

  const handleSaveAlerts = () => {
    if (!hasSelectedTemplates) return
    
    setIsSaving(true)
    
    setTimeout(() => {
      setIsSaving(false)
      setShowConfirmation(true)
      
      console.log("Saving Cost Management alerts...")
      console.log("Enabled templates:", Object.entries(templateStates).filter(([_, enabled]) => enabled))
      console.log("Email roles:", selectedEmailRoles)
      console.log("Email users:", emailUsers)
      console.log("In-app roles:", selectedInAppRoles)
      console.log("In-app users:", inAppUsers)
      console.log("External destinations:", externalDestinations)
    }, 3000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden sf-theme bg-[var(--panel)] text-[var(--text)]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center gap-3 min-w-0">
          <Link 
            href="/alerts"
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--panel-3)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--subtle-text)] hover:text-[var(--text)]" />
          </Link>
          <svg width="136" height="32" viewBox="0 0 136 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
            <g clipPath="url(#clip0_14399_3360)">
              <path fillRule="evenodd" clipRule="evenodd" d="M40.7469 9.97509C41.5393 9.97509 42.5346 10.3735 43.3218 10.9527C44.124 11.543 44.5046 12.1695 44.1132 12.5129C44.0537 12.5651 43.9925 12.6024 43.9286 12.625C43.7411 12.6911 43.5627 12.6315 43.3267 12.4622C43.252 12.4086 42.8098 12.0496 42.6561 11.9392C42.0497 11.5038 41.4188 11.2712 40.5795 11.2712C40.0666 11.2712 39.4223 11.4386 38.928 11.7281C38.333 12.0766 37.9925 12.5646 37.9925 13.1728C37.9925 13.5866 38.2122 13.9043 38.6555 14.1791C39.0115 14.3999 39.4123 14.5549 40.2522 14.8264C40.2455 14.8242 40.4465 14.8891 40.5031 14.9075C40.6109 14.9424 40.699 14.9713 40.7833 14.9995C40.8634 15.0263 40.9446 15.0532 41.0556 15.0898C41.0853 15.0996 41.1236 15.1122 41.1914 15.1346C41.2454 15.1524 41.2866 15.166 41.3266 15.1793C42.5984 15.6004 43.2234 15.864 43.7786 16.2797C44.5006 16.8201 44.8715 17.5289 44.8715 18.502C44.8715 19.4984 44.3954 20.4008 43.5592 21.034C42.7425 21.6342 41.7716 21.9148 40.5726 21.9148C39.785 21.9048 38.7948 21.6896 38.0805 21.3523C37.4497 21.0544 36.996 20.7639 36.7454 20.4867C36.4517 20.1617 36.4287 19.8347 36.7156 19.5653C36.8865 19.4047 37.0791 19.4107 37.3502 19.5416C37.4374 19.5837 37.9865 19.902 38.19 20.0033C38.8828 20.3483 39.6231 20.5378 40.574 20.5378C41.1019 20.5378 41.794 20.3781 42.3253 20.0923C43.001 19.729 43.3835 19.2004 43.3762 18.5032C43.371 18.0007 43.0834 17.603 42.5278 17.2597C42.1006 16.9957 41.6644 16.8235 40.7104 16.5043C40.6992 16.5006 40.6878 16.4968 40.6761 16.493C40.6151 16.473 39.3468 16.1166 38.9216 15.9645C37.3252 15.3932 36.4559 14.5597 36.4954 13.1696C36.5285 12.0042 36.9126 11.3674 37.8124 10.7472C38.5415 10.2447 39.5533 9.97509 40.7469 9.97509ZM48.2197 21.658C48.1049 21.8228 47.9092 21.9148 47.7001 21.9148H47.5406L47.5251 21.9104C47.3347 21.856 47.1684 21.7229 47.0791 21.5556C47.049 21.5204 47.0384 21.4863 47.0359 21.4418L47.0113 21.4173V10.6875C47.0113 10.3056 47.3094 9.99899 47.7001 9.99899C48.0716 9.99899 48.365 10.3101 48.365 10.6875V11.5094C49.2687 10.5596 50.5381 9.99899 51.8845 9.99899C54.5701 9.99899 56.7578 12.193 56.7578 14.8695V21.2263C56.7578 21.6169 56.451 21.9148 56.0689 21.9148C55.6869 21.9148 55.3801 21.6169 55.3801 21.2263V14.8695C55.3801 12.9411 53.8212 11.376 51.8845 11.376C49.9749 11.376 48.4116 12.9384 48.365 14.8695V21.336L48.3625 21.346L48.3616 21.3498C48.3221 21.5076 48.2934 21.5814 48.2197 21.658ZM64.2998 9.97509C67.4244 9.97509 69.9621 12.6779 69.9621 15.9449C69.9621 19.2119 67.4244 21.9148 64.2998 21.9148C61.191 21.9148 58.6375 19.2032 58.6375 15.9449C58.6375 12.6866 61.191 9.97509 64.2998 9.97509ZM93.6904 6.3955C93.6681 6.39793 93.6452 6.39935 93.6205 6.39975C92.9032 6.39476 92.4784 6.53079 92.2373 6.80053C91.9651 7.1201 91.7982 7.72786 91.7865 8.67456V9.80965L93.3226 9.80973C93.7171 9.79457 94.0409 10.1046 94.0305 10.4732C94.0403 10.8749 93.7348 11.1938 93.327 11.216H91.7865L91.7865 21.2437C91.8022 21.6288 91.4936 21.9515 91.1198 21.9515C90.7157 21.9515 90.4 21.6357 90.4163 21.2484V11.216L88.9798 11.2158C88.5873 11.1937 88.2827 10.8758 88.2827 10.4761C88.2827 10.1032 88.6051 9.79454 88.9862 9.80965H90.4163V8.67358C90.4275 7.35954 90.6566 6.50191 91.217 5.87853C91.7464 5.2692 92.5721 4.99337 93.6213 4.99337C93.646 4.99337 93.6706 4.99464 93.6949 4.99716C93.7192 4.99464 93.7437 4.99337 93.7683 4.99337H93.9529C94.3408 4.99337 94.6559 5.30834 94.6558 5.69858L94.6554 5.72167C94.6421 6.09897 94.3318 6.39975 93.9534 6.39975H93.768C93.7419 6.39975 93.7161 6.39833 93.6904 6.3955ZM78.8655 15.2382L76.2606 21.4589L76.2518 21.4676L76.2484 21.4777C76.1646 21.7291 75.8904 21.9148 75.6373 21.9148C75.564 21.9148 75.5101 21.9021 75.4008 21.8661C75.3661 21.8631 75.3346 21.8528 75.3062 21.8357C75.2887 21.8252 75.2768 21.8159 75.2615 21.8015C75.1303 21.7418 75.0406 21.634 74.9796 21.4814L71.0598 10.9449C70.9187 10.6064 71.0802 10.2029 71.4087 10.0538C71.7584 9.90814 72.1866 10.0849 72.302 10.4309L75.6205 19.4549L78.2103 13.2934C78.3218 13.0425 78.5982 12.8667 78.8652 12.8667C79.1522 12.8667 79.4309 13.0387 79.5451 13.2956L82.1335 19.454L85.4284 10.4311L85.4303 10.4263C85.5733 10.0833 85.9995 9.90731 86.3218 10.0538C86.6682 10.198 86.8382 10.6004 86.6962 10.9407L82.7977 21.4363C82.7422 21.575 82.6576 21.6877 82.5447 21.7723C82.4158 21.869 82.2979 21.9148 82.141 21.9148H82.0693L82.055 21.9139C81.8058 21.8827 81.5639 21.6994 81.4851 21.4621L78.8655 15.2382ZM97.3815 4.9566C97.7752 4.9566 98.0942 5.26654 98.0942 5.64509V21.2263C98.0942 21.6048 97.7752 21.9148 97.3815 21.9148C97.0071 21.9148 96.6927 21.6005 96.6927 21.2263V5.64509C96.6927 5.27092 97.0071 4.9566 97.3815 4.9566ZM110.061 19.8198C108.996 21.1269 107.436 21.9148 105.776 21.9148C102.644 21.9148 100.114 19.2276 100.114 15.9449C100.114 12.6622 102.644 9.97509 105.776 9.97509C107.444 9.97509 109.002 10.7497 110.061 12.0464V10.6636C110.061 10.2729 110.367 9.97509 110.749 9.97509C111.132 9.97509 111.438 10.2729 111.438 10.6636V21.2263C111.438 21.6005 111.124 21.9148 110.749 21.9148C110.375 21.9148 110.061 21.6005 110.061 21.2263V19.8198ZM64.2998 11.3282C61.9634 11.3282 60.0152 13.4133 60.0152 15.9449C60.0152 18.4719 61.9589 20.5378 64.2998 20.5378C66.6407 20.5378 68.5845 18.4719 68.5845 15.9449C68.5845 13.4133 66.6363 11.3282 64.2998 11.3282ZM115.253 16.6283L121.991 10.0602C122.275 9.77637 122.682 9.77637 122.962 10.056C123.251 10.3161 123.251 10.7507 122.965 11.0367L118.522 15.3325L122.998 20.7711C123.249 21.0782 123.225 21.4795 122.943 21.7616L122.933 21.7701C122.805 21.8726 122.65 21.9148 122.479 21.9148C122.241 21.9148 122.04 21.8343 121.93 21.6509L117.521 16.3305L115.253 18.5974V21.2263C115.253 21.6048 114.934 21.9148 114.54 21.9148C114.166 21.9148 113.851 21.6005 113.851 21.2263V5.64509C113.851 5.27092 114.166 4.9566 114.54 4.9566C114.934 4.9566 115.253 5.26654 115.253 5.64509V16.6283ZM125.325 16.275C125.496 18.6799 127.392 20.518 129.708 20.5376C129.713 20.5377 129.814 20.5377 129.972 20.5378L130.261 20.5378C131.681 20.5378 133.111 19.5903 133.939 18.2106C134.131 17.8828 134.553 17.793 134.863 17.9788L134.871 17.9844C135.188 18.2145 135.288 18.6155 135.093 18.9509C133.977 20.729 132.156 21.9148 130.261 21.9148C130.209 21.9148 130.14 21.9148 130.056 21.9148C129.923 21.9147 129.817 21.9147 129.757 21.9147L129.703 21.9146C126.512 21.8913 123.94 19.2287 123.94 15.9688C123.94 12.6525 126.529 9.97509 129.746 9.97509C132.795 9.97509 135.258 12.3855 135.504 15.5626V15.6343C135.504 16.0029 135.196 16.275 134.815 16.275H125.325ZM105.776 11.3282C103.432 11.3282 101.491 13.3977 101.491 15.9449C101.491 18.4875 103.427 20.5378 105.776 20.5378C108.14 20.5378 110.061 18.4964 110.061 15.9449C110.061 13.3888 108.136 11.3282 105.776 11.3282ZM125.416 14.9219H134.007C133.583 12.8511 131.801 11.3521 129.746 11.3521C127.652 11.3521 125.884 12.8202 125.416 14.9219Z" fill="#29B5E8" stroke="#29B5E8" strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.5976 20.2544C13.5413 20.4041 14.2624 21.2211 14.2624 22.2066V30.0233C14.2624 31.1153 13.3772 32 12.2854 32C11.1933 32 10.3084 31.115 10.3084 30.0233V25.6096L6.47198 27.8246C5.52325 28.3723 4.30861 28.0475 3.76053 27.0982C3.21232 26.1487 3.53778 24.935 4.48718 24.3868L11.2423 20.4867C11.6686 20.2406 12.1486 20.1707 12.5976 20.2544ZM18.0134 21.2131C18.5615 20.2638 19.7761 19.939 20.7248 20.4867L27.48 24.3868C28.4294 24.935 28.7548 26.1487 28.2066 27.0982C27.6585 28.0475 26.4439 28.3723 25.4952 27.8246L21.7107 25.6396V30.0233C21.7107 31.115 20.8258 32 19.7336 32C18.6418 32 17.7566 31.1153 17.7566 30.0233V22.3978C17.7176 21.9997 17.7981 21.586 18.0134 21.2131ZM0.266274 11.0982C0.81436 10.1489 2.029 9.82406 2.97773 10.3718L9.73284 14.2719C10.3798 14.6454 10.7371 15.3281 10.7255 16.0256C10.7313 16.7177 10.3745 17.3931 9.73284 17.7636L2.97773 21.6637C2.02832 22.2118 0.814481 21.8868 0.266274 20.9373C-0.281812 19.988 0.0442034 18.7736 0.99293 18.2259L4.81758 16.0177L0.99293 13.8096C0.0435233 13.2614 -0.281932 12.0477 0.266274 11.0982ZM31.7009 11.0982C32.2491 12.0477 31.9236 13.2614 30.9742 13.8096L27.1496 16.0177L30.9742 18.2259C31.9229 18.7736 32.249 19.988 31.7009 20.9373C31.1527 21.8868 29.9388 22.2118 28.9894 21.6637L22.2343 17.7636C21.5926 17.3931 21.2358 16.7177 21.2417 16.0256C21.2301 15.3281 21.5873 14.6454 22.2343 14.2719L28.9894 10.3718C29.9381 9.82406 31.1528 10.1489 31.7009 11.0982ZM16.3409 12.3218C16.491 12.3218 16.6994 12.4082 16.8059 12.5147L19.4853 15.1941C19.5914 15.3002 19.6782 15.5088 19.6782 15.6591V16.3409C19.6782 16.491 19.5918 16.6994 19.4853 16.8059L16.8059 19.4853C16.6998 19.5914 16.4912 19.6782 16.3409 19.6782H15.6591C15.509 19.6782 15.3006 19.5918 15.1941 19.4853L12.5147 16.8059C12.4086 16.6998 12.3218 16.4912 12.3218 16.3409V15.6591C12.3218 15.509 12.4082 15.3006 12.5147 15.1941L15.1941 12.5147C15.3002 12.4086 15.5088 12.3218 15.6591 12.3218H16.3409ZM16.0151 14.7126H15.9849C15.8748 14.7126 15.7223 14.7757 15.6441 14.854L14.854 15.6441C14.7759 15.7222 14.7126 15.8744 14.7126 15.9849V16.0151C14.7126 16.1252 14.7757 16.2777 14.854 16.3559L15.6441 17.146C15.7222 17.2241 15.8744 17.2874 15.9849 17.2874H16.0151C16.1252 17.2874 16.2777 17.2243 16.3559 17.146L17.146 16.3559C17.2241 16.2778 17.2874 16.1256 17.2874 16.0151V15.9849C17.2874 15.8748 17.2243 15.7223 17.146 15.6441L16.3559 14.854C16.2778 14.7759 16.1256 14.7126 16.0151 14.7126ZM12.2854 0C13.3772 0 14.2624 0.884672 14.2624 1.97669V9.79343C14.2624 10.3686 14.0168 10.8864 13.6246 11.2476C13.0041 11.8563 12.0313 12.0042 11.2423 11.5487L4.48718 7.64865C3.53778 7.10051 3.21232 5.88679 3.76053 4.93727C4.30861 3.98796 5.52325 3.66314 6.47198 4.21089L10.3084 6.42582V1.97669C10.3084 0.884993 11.1933 0 12.2854 0ZM19.7336 0C20.8258 0 21.7107 0.884993 21.7107 1.97669V6.39587L25.4952 4.21089C26.4439 3.66314 27.6585 3.98796 28.2066 4.93727C28.7548 5.88679 28.4294 7.10051 27.48 7.64865L20.7248 11.5487C19.7761 12.0965 18.5615 11.7716 18.0134 10.8223C17.7981 10.4494 17.7176 10.0358 17.7566 9.63769V1.97669C17.7566 0.884672 18.6418 0 19.7336 0Z" fill="#29B5E8"/>
            </g>
            <defs>
              <clipPath id="clip0_14399_3360">
                <rect width="135.54" height="32" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <Separator orientation="vertical" className="h-6 bg-[var(--border)]" />
          <nav className="text-sm text-[var(--subtle-text)] truncate">
            <Link href="/alerts" className="text-[var(--text)] font-medium hover:text-[var(--color-primary)]">Alert Center</Link>
            <span className="mx-2 text-[var(--subtle-text)]">/</span>
            <span className="text-[var(--text)]">Cost Management Alerts</span>
          </nav>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--panel-3)] border border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">PRODUCT_MANAGER</span>
            <span className="text-sm text-[var(--subtle-text)]">SNOWMDOC (2X-Large)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--panel-3)] border border-[var(--border)]">
            <div className="w-4 h-4 rounded bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-xs text-white font-bold">S</span>
            </div>
            <span className="text-sm font-medium">SNOWSCIENCE</span>
          </div>
        </div>
      </header>

        {/* Main Content - Same structure as other pages */}
        <main className="flex-1 overflow-y-auto max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--panel-3)] border border-[var(--border)]">
            <CostManagementIcon className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
              Cost Management Alert Configuration
            </h1>
            <p className="text-lg text-[var(--subtle-text)]">
              Monitor spending and resource usage to optimize costs
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Alert Templates */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Alert Templates</h3>
            <div className="space-y-3">
              {costManagementTemplates.map((template) => {
                const isEnabled = templateStates[template.id] || false
                const isHighlighted = highlightedTemplate === template.id
                return (
                  <div 
                    key={template.id} 
                    className={`flex items-start justify-between p-4 rounded-lg border transition-all duration-200 ${
                      isEnabled 
                        ? 'border-[var(--color-primary)] bg-blue-50 shadow-md' 
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                    } ${
                      isHighlighted 
                        ? 'ring-4 ring-yellow-300 ring-opacity-75 bg-yellow-50 border-yellow-400 animate-pulse' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <Switch 
                        id={template.id}
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={template.id} className={`text-sm font-semibold cursor-pointer leading-tight ${
                            isEnabled ? 'text-blue-800' : 'text-gray-900'
                          }`}>
                            {template.name}
                          </Label>
                          {template.id === "cost-spike" && (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">PREVIEW</Badge>
                          )}
                        </div>
                        <p className={`text-sm mt-2 leading-relaxed ${
                          isEnabled ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {template.description}
                        </p>
                        
                        {/* Custom configuration for Budget Threshold Alerts - Expanded by default */}
                        {template.id === "budget-threshold-alerts" && (
                          <div className={`mt-4 p-4 rounded-lg transition-all duration-200 ${
                            isEnabled 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <Label className={`text-sm font-medium ${
                                isEnabled ? 'text-blue-800' : 'text-gray-600'
                              }`}>
                                Budget Thresholds ($)
                              </Label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={addBudgetCategory}
                                className={`h-7 px-2 text-xs ${
                                  isEnabled 
                                    ? 'border-blue-300 text-blue-700 hover:bg-blue-100' 
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Category
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {Object.entries(budgetThresholds).map(([category, threshold]) => (
                                <div key={category} className="flex items-center gap-2">
                                  <Input
                                    value={category}
                                    onChange={(e) => {
                                      const newCategory = e.target.value
                                      const oldThreshold = budgetThresholds[category]
                                      setBudgetThresholds(prev => {
                                        const newThresholds = { ...prev }
                                        delete newThresholds[category]
                                        newThresholds[newCategory] = oldThreshold
                                        return newThresholds
                                      })
                                    }}
                                    className={`flex-1 h-8 text-sm bg-white ${
                                      isEnabled ? 'border-blue-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Category name"
                                  />
                                  <span className={`text-sm ${
                                    isEnabled ? 'text-blue-700' : 'text-gray-500'
                                  }`}>$</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={threshold}
                                    onChange={(e) => updateBudgetThreshold(category, e.target.value)}
                                    className={`w-32 h-8 text-sm bg-white ${
                                      isEnabled ? 'border-blue-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Budget"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeBudgetCategory(category)}
                                    className={`h-7 w-7 p-0 ${
                                      isEnabled 
                                        ? 'text-blue-600 hover:text-red-600 hover:bg-red-50' 
                                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <p className={`text-xs mt-2 ${
                              isEnabled ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              Alert when spending reaches 80% of these budget thresholds
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/alert-editor?template=${encodeURIComponent(getSQLTemplate(template.id)?.sql || "")}&name=${encodeURIComponent(template.name)}`}
                          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors ml-3"
                        >
                          <EditIcon />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit alert template</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notification Channels - Dynamic system */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Channels</h3>
            <div className="space-y-6">
              
              {/* Email Section - Always visible */}
              {visibleChannels.has('email') && (
                <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setEmailRolesExpanded(!emailRolesExpanded)}
                      className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                        <EmailIcon className="text-blue-600" />
                        Email (Snowflake Users)
                      </h4>
                      {emailRolesExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
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
                  
                  {emailRolesExpanded && (
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
                        <button
                          onClick={() => setEmailUsersExpanded(!emailUsersExpanded)}
                          className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                        >
                          <h5 className="text-md font-medium text-gray-700">Users</h5>
                          {emailUsersExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                        </button>
                        {emailUsersExpanded && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* In-App Section */}
              {visibleChannels.has('inapp') && (
                <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setInAppExpanded(!inAppExpanded)}
                      className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                        <InAppIcon className="text-blue-600" />
                        In-App (Snowsight)
                      </h4>
                      {inAppExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
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
                        <button
                          onClick={() => setInAppRolesExpanded(!inAppRolesExpanded)}
                          className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                        >
                          <h5 className="text-md font-medium text-gray-700">Roles</h5>
                          {inAppRolesExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                        </button>
                        {inAppRolesExpanded && (
                          <>
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
                          </>
                        )}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => setInAppUsersExpanded(!inAppUsersExpanded)}
                          className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                        >
                          <h5 className="text-md font-medium text-gray-700">Users</h5>
                          {inAppUsersExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                        </button>
                        {inAppUsersExpanded && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* External Section */}
              {visibleChannels.has('external') && (
                <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExternalExpanded(!externalExpanded)}
                      className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                        <ExternalIcon className="text-blue-600" />
                        External
                      </h4>
                      {externalExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
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
            </div>
          </div>

          {/* Schedule - Same structure */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Alert Schedule</h3>
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-[var(--subtle-text)]">Every</span>
                <div className="flex items-center gap-2">
                  <Select defaultValue="1">
                    <SelectTrigger className="w-20 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                      {["1", "2", "3", "4", "6", "12"].map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="day">
                    <SelectTrigger className="w-36 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                      <SelectItem value="minute">Minute</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm text-[var(--subtle-text)]">at</span>

                <Select defaultValue="0">
                  <SelectTrigger className="w-64 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                    <SelectValue placeholder="0 minutes past the hour" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                    {[0, 6, 12, 18, 24, 30, 36, 42, 48, 54].map((m) => (
                      <SelectItem key={m} value={String(m)}>{m} minutes past the hour</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select defaultValue="pt">
                  <SelectTrigger className="w-[300px] h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                    <SelectItem value="pt">(UTC-07:00) Pacific Time (US and Canada)</SelectItem>
                    <SelectItem value="mt">(UTC-06:00) Mountain Time (US and Canada)</SelectItem>
                    <SelectItem value="ct">(UTC-05:00) Central Time (US and Canada)</SelectItem>
                    <SelectItem value="et">(UTC-04:00) Eastern Time (US and Canada)</SelectItem>
                    <SelectItem value="utc">(UTC+00:00) UTC</SelectItem>
                  </SelectContent>
                </Select>

                <span className="ml-2 text-xs text-[var(--subtle-text)]">DST</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
            <Link href="/alerts">
              <Button 
                variant="outline" 
                className="px-6 py-2 border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-medium"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={handleSaveAlerts}
              disabled={isSaving || !hasSelectedTemplates}
              className={`px-6 py-2 font-medium border-0 flex items-center gap-2 ${
                hasSelectedTemplates 
                  ? '!bg-[var(--color-primary)] !text-white hover:!bg-[var(--color-primary-hover)] active:!bg-[var(--color-primary-pressed)]'
                  : '!bg-gray-300 !text-gray-500 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: hasSelectedTemplates ? 'var(--color-primary)' : '#d1d5db',
                color: hasSelectedTemplates ? 'white' : '#6b7280',
                border: 'none'
              }}
            >
              {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Alert Configuration'}
            </Button>
          </div>
        </div>
        </main>
      </div>

      {/* Success Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md bg-white border border-gray-200">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Alerts Successfully Configured
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Your Cost Management alert templates have been saved and activated. You should receive test notifications in each of your specified channels within the next few minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 !bg-[var(--color-primary)] !text-white hover:!bg-[var(--color-primary-hover)] font-medium"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none'
              }}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
