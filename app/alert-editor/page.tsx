"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/alerts/header"
import { LeftPanel } from "@/components/alerts/left-panel"
import { RightPanel } from "@/components/alerts/right-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import "@/styles/alerts.css"

function AlertsPageContent() {
  const [sql, setSql] = useState("")
  const searchParams = useSearchParams()

  // Handle template prepopulation from URL parameters
  useEffect(() => {
    const template = searchParams.get('template')
    const name = searchParams.get('name')
    
    if (template) {
      setSql(decodeURIComponent(template))
    }
  }, [searchParams])

  const [hasRun, setHasRun] = useState(false)

  const TEMPLATE_SQL: Record<string, string> = {
    "Demo: Snowpipe Failure Check": `-- Checking whether there are any failures in a custom event table for Snowpipe\nSELECT\n  observed_date,\n  COUNT(*) AS number_of_failures\n  -- If this count is > 0, we should send a notification\nFROM snowpipe_event_table\nWHERE observed_date > current_date() - 1\nAND RECORD['severity_text'] = 'ERROR'\nGROUP BY observed_date`,
  }

  const handleApplyTemplate = (templateName: string) => {
    const query = TEMPLATE_SQL[templateName]
    if (query) setSql(query)
  }

  return (
    <div className="sf-theme min-h-screen bg-[var(--panel)] text-[var(--text)]">
      <Header />
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-[calc(100vh-73px)]"
      >
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <LeftPanel onApplyTemplate={handleApplyTemplate} hasRun={hasRun} />
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-[var(--border)] hover:bg-[var(--color-primary)] transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <RightPanel
            sql={sql}
            setSql={setSql}
            onRunStart={() => setHasRun(false)}
            onRun={() => setHasRun(true)}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <Suspense fallback={<div className="sf-theme min-h-screen bg-[var(--panel)] flex items-center justify-center">Loading...</div>}>
      <AlertsPageContent />
    </Suspense>
  )
}