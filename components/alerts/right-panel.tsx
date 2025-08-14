"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LoaderCircle, Play, Sparkles } from 'lucide-react'
import { DatabaseSchemaMenu, RoleWarehouseMenu } from "./menus"
import { DATABASES, ROLES, WAREHOUSES } from "./constants"
// Results UI moved to left panel
import { SaveTemplateModal } from "./save-template-modal"
import { SQLEditor, type SQLEditorHandle } from "./sql-editor"

export function RightPanel({ sql, setSql, onRun }: { sql: string; setSql: (v: string) => void; onRun: () => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const editorApiRef = useRef<SQLEditorHandle | null>(null)

  const [role, setRole] = useState(ROLES[0])
  const [warehouse, setWarehouse] = useState(WAREHOUSES[0].name)
  const [database, setDatabase] = useState(Object.keys(DATABASES)[0])
  const [schema, setSchema] = useState(DATABASES[Object.keys(DATABASES)[0]][0])

  useEffect(() => {
    const schemas = DATABASES[database]
    if (!schemas.includes(schema)) setSchema(schemas[0])
  }, [database, schema])

  return (
    <section className="flex flex-col h-full bg-[var(--panel-2)] border-l border-[var(--border)]">
      <div className="flex flex-wrap items-center gap-2 justify-between px-3 sm:px-4 py-2 border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              size="icon"
              className="h-8 w-8 rounded-md bg-[var(--color-primary)] text-white hover:brightness-110 p-0"
              onClick={() => {
                if (isRunning) return
                setIsRunning(true)
                onRun()
                setTimeout(() => setIsRunning(false), 1000)
              }}
              aria-label="Run"
            >
              <Play className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-1 h-8 w-8 rounded-md border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)] p-0"
                  aria-label="Run options"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="bg-white text-[var(--text)] border-[var(--border)] w-56 rounded-lg px-3 py-2 shadow-md"
              >
                <div className="text-sm font-medium">Run all</div>
                <div className="mt-1 text-xs text-[var(--subtle-text)]">{'⌘ + Shift + Enter'}</div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI button + hover bubble */}
            <div className="relative group ml-1">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-md border-[var(--border)] bg-[var(--panel-3)] text-[var(--color-mid-blue)] p-0 hover:bg-[var(--panel-3)]"
                aria-label="Get AI suggestions"
                aria-pressed={Boolean(editorApiRef.current?.isAiRowVisible?.())}
                onClick={() => {
                  const api = editorApiRef.current
                  if (!api) return
                  if (api.isAiRowVisible()) api.hideAiRow()
                  else api.showAiRow()
                }}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" aria-hidden="true">
                <div className="relative rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm shadow-sm whitespace-nowrap">
                  Get AI suggestions with {'⌘ + I'}
                  <div className="absolute -bottom-1 left-1/2 sf-tooltip-caret w-2 h-2 bg-white border border-[var(--border)]" />
                </div>
              </div>
            </div>

            {isRunning && <LoaderCircle className="ml-2 h-5 w-5 animate-spin text-[var(--color-mid-blue)]" aria-label="Running" />}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto min-w-0 max-w-full">
          <RoleWarehouseMenu role={role} setRole={setRole} warehouse={warehouse} setWarehouse={setWarehouse} />
          <DatabaseSchemaMenu database={database} setDatabase={setDatabase} schema={schema} setSchema={setSchema} />
        </div>
      </div>

      <div className="px-3 sm:px-4 py-2 text-sm font-medium border-b border-[var(--border)] bg-[var(--panel)]">
        Alert Query Editor
      </div>

      <div className="relative flex-1 overflow-hidden">
        <SQLEditor ref={editorApiRef as any} disabled={isRunning} value={sql} onChange={setSql} />
      </div>

      <div className="px-3 sm:px-4 py-3 border-t border-[var(--border)] bg-[var(--panel)]">
        <Button className="h-9 bg-[var(--color-primary)] text-white hover:brightness-110" onClick={() => setShowSaveModal(true)}>
          Save as Template
        </Button>
      </div>

      {/* Results moved to left panel per design request */}

      <SaveTemplateModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={() => setShowSaveModal(false)}
      />
    </section>
  )
}
