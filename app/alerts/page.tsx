"use client"

import { useState } from "react"
import { Header } from "@/components/alerts/header"
import { LeftPanel } from "@/components/alerts/left-panel"
import { RightPanel } from "@/components/alerts/right-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import "@/styles/alerts.css"

export default function AlertsPage() {
  const [sql, setSql] = useState(`SELECT 
  COUNT(*) as total_records,
  AVG(amount) as avg_amount,
  MAX(created_at) as latest_record
FROM transactions 
WHERE created_at >= CURRENT_DATE() - INTERVAL '7 days'
  AND status = 'completed'`)

  return (
    <div className="sf-theme min-h-screen bg-[var(--panel)] text-[var(--text)]">
      <Header />
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-[calc(100vh-73px)]"
      >
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <LeftPanel />
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-[var(--border)] hover:bg-[var(--color-primary)] transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <RightPanel sql={sql} setSql={setSql} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}