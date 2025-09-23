"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import "@/styles/alerts.css"
import { alertCategories } from "@/lib/alert-config"

// Icon components for rendering
const renderIcon = (iconType: string) => {
  const iconProps = { className: "text-blue-600" }
  
  switch (iconType) {
    case "snowpipe":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <rect x="2" y="10" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="4" y="8" width="2" height="8" stroke="currentColor" strokeWidth="2"/>
          <rect x="18" y="8" width="2" height="8" stroke="currentColor" strokeWidth="2"/>
          <circle cx="6" cy="12" r="1" fill="currentColor"/>
          <circle cx="12" cy="12" r="1" fill="currentColor"/>
          <circle cx="18" cy="12" r="1" fill="currentColor"/>
          <path d="M1 12h2M21 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case "snowpark":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="6" r="1" fill="currentColor"/>
          <path d="M16 6l2-2M16 6l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case "openflow":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case "data-quality":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 8h10M7 12h8M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="19" cy="7" r="2" fill="currentColor"/>
        </svg>
      )
    case "cost-management":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <path d="M4 2h16l-2 20H6L4 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6h12" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 10h10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 13h8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 16h6" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="4" r="1" fill="currentColor"/>
        </svg>
      )
    case "trust-center":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case "security-iam":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2"/>
          <rect x="16" y="11" width="6" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="19" cy="15" r="1" fill="currentColor"/>
          <path d="M17 11V9a2 2 0 114 0v2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconProps.className}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
  }
}

export default function AlertsNoCodePage() {
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")

  const getCategoryPath = (categoryId: string) => {
    return `/alerts/${categoryId}`
  }

  // Sample alert execution data
  const allAlertExecutions = [
    {
      id: "ALT-5314",
      name: "Cost Anomaly Detection",
      type: "Cost Anomaly",
      category: "Cost Management",
      severity: 1,
      status: "Triggered",
      created: "2 hours ago",
      completed: "2 hours ago",
      owner: "ACCOUNTADMIN"
    },
    {
      id: "ALT-5313",
      name: "Snowpipe Load Failure",
      type: "Snowpipe Error",
      category: "Snowpipe",
      severity: 2,
      status: "Failed",
      created: "5 hours ago",
      completed: "-",
      owner: "ACCOUNTADMIN"
    },
    {
      id: "ALT-5311",
      name: "Data Quality Check",
      type: "Data Quality Issue",
      category: "Data Quality",
      severity: 3,
      status: "Resolved",
      created: "1 day ago",
      completed: "1 day ago",
      owner: "ACCOUNTADMIN"
    },
    {
      id: "ALT-5310",
      name: "Security Access Violation",
      type: "Security Alert",
      category: "Security & IAM",
      severity: 1,
      status: "Investigating",
      created: "3 days ago",
      completed: "-",
      owner: "ACCOUNTADMIN"
    },
    {
      id: "ALT-5309",
      name: "Snowpark Job Timeout",
      type: "Job Timeout",
      category: "Snowpark",
      severity: 2,
      status: "Resolved",
      created: "1 week ago",
      completed: "1 week ago",
      owner: "ACCOUNTADMIN"
    }
  ]

  // Filter the alert executions
  const filteredExecutions = allAlertExecutions.filter(alert => {
    return (statusFilter === "All" || alert.status === statusFilter) &&
           (categoryFilter === "All" || alert.category === categoryFilter) &&
           (severityFilter === "All" || alert.severity.toString() === severityFilter) &&
           (typeFilter === "All" || alert.type === typeFilter)
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden sf-theme bg-[var(--panel)] text-[var(--text)]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center gap-3 min-w-0">
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
            <span className="text-[var(--text)] font-medium">Alert Center</span>
          </nav>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--panel-3)] border border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">PRODUCT_MANAGER</span>
            <span className="text-sm text-[var(--subtle-text)]">SNOWMDOC (2X-Large)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--panel-3)] border border-[var(--border)]">
            <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">S</span>
            </div>
            <span className="text-sm font-medium">SNOWSCIENCE</span>
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
              Snowflake Alert Center
            </h1>
            <p className="text-lg text-[var(--subtle-text)] max-w-3xl">
              Fast, Easy and Secure alerting with Snowflake. Monitor your features and workloads with pre-configured alert templates. 
              Get started quickly with no-code alerts that notify you when things matter most.
            </p>
          </div>

          {/* Alert Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertCategories.map((category) => (
              <Link key={category.id} href={getCategoryPath(category.id)}>
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[var(--border-bright)] bg-[var(--panel)] border-[var(--border)]"
                >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--panel-3)] border border-[var(--border)]">
                        {renderIcon(category.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-[var(--text)]">
                          {category.name}
                        </CardTitle>
                        {category.preview && (
                          <Badge variant="secondary" className="mt-1 bg-blue-600 text-white">
                            PREVIEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                    >
                      Configure →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--subtle-text)] mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="text-sm text-[var(--subtle-text)]">
                    {category.templates.length} alert template{category.templates.length !== 1 ? 's' : ''} available
                  </div>
                </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Historical Alert Execution Runs */}
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                Recent Alert Execution History
              </h2>
              <p className="text-[var(--subtle-text)]">
                View the execution status and details of your recent alert runs
              </p>
            </div>

            <Card className="bg-[var(--panel)] border-[var(--border)]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[var(--text)]">
                    Alert Executions
                  </CardTitle>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    PREVIEW
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Triggered">Triggered</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Investigating">Investigating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Category</span>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Cost Management">Cost Management</SelectItem>
                        <SelectItem value="Snowpipe">Snowpipe</SelectItem>
                        <SelectItem value="Data Quality">Data Quality</SelectItem>
                        <SelectItem value="Security & IAM">Security & IAM</SelectItem>
                        <SelectItem value="Snowpark">Snowpark</SelectItem>
                        <SelectItem value="OpenFlow">OpenFlow</SelectItem>
                        <SelectItem value="Trust Center">Trust Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Severity</span>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Type</span>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Cost Anomaly">Cost Anomaly</SelectItem>
                        <SelectItem value="Snowpipe Error">Snowpipe Error</SelectItem>
                        <SelectItem value="Data Quality Issue">Data Quality Issue</SelectItem>
                        <SelectItem value="Security Alert">Security Alert</SelectItem>
                        <SelectItem value="Job Timeout">Job Timeout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span>{filteredExecutions.length} alerts</span>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm" className="ml-2">
                      Columns <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">ALERT ID</TableHead>
                      <TableHead className="font-medium">NAME</TableHead>
                      <TableHead className="font-medium">TYPE</TableHead>
                      <TableHead className="font-medium">ALERT CATEGORY</TableHead>
                      <TableHead className="font-medium">SEVERITY</TableHead>
                      <TableHead className="font-medium">STATUS</TableHead>
                      <TableHead className="font-medium">
                        <div className="flex items-center gap-1">
                          CREATED
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead className="font-medium">COMPLETED ON</TableHead>
                      <TableHead className="font-medium">OWNER</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.map((alert) => {
                      const getSeverityColor = (severity: number) => {
                        switch (severity) {
                          case 1: return "bg-red-100 text-red-800"
                          case 2: return "bg-orange-100 text-orange-800"
                          case 3: return "bg-yellow-100 text-yellow-800"
                          default: return "bg-gray-100 text-gray-800"
                        }
                      }

                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case "Triggered": return "bg-green-100 text-green-800"
                          case "Failed": return "bg-red-100 text-red-800"
                          case "Resolved": return "bg-green-100 text-green-800"
                          case "Investigating": return "bg-blue-100 text-blue-800"
                          default: return "bg-gray-100 text-gray-800"
                        }
                      }

                      return (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.id}</TableCell>
                          <TableCell>
                            <Link href={`/alert-detail/${alert.id}`} className="text-blue-600 hover:underline font-medium">
                              {alert.name}
                            </Link>
                          </TableCell>
                          <TableCell>{alert.type}</TableCell>
                          <TableCell>{alert.category}</TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                          </TableCell>
                          <TableCell>{alert.created}</TableCell>
                          <TableCell>{alert.completed}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs">A</span>
                              </div>
                              <span>ACCOUNTADM...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
