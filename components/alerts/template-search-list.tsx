"use client"

import { useState } from "react"
import { FileText, Search, X } from 'lucide-react'

export function TemplateSearchList({
  templates,
  onSelect,
}: {
  templates: { name: string; date: string; description: string }[]
  onSelect: (t: { name: string; date: string; description: string }) => void
}) {
  const [q, setQ] = useState("")
  const filtered = templates.filter(t => t.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--subtle-text)]" />
        <input
          className="w-full h-9 rounded-md border border-[var(--border)] bg-[var(--panel-3)] pl-9 pr-9 text-sm outline-none"
          placeholder="finance & economics - examples"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q !== "" && (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--subtle-text)] hover:text-[var(--text)]"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="max-h-64 overflow-auto rounded-md border border-[var(--border)] divide-y">
        {filtered.map(t => (
          <button
            key={`${t.name}-${t.date}`}
            className="w-full text-left px-3 py-2 hover:bg-[var(--panel-3)]"
            onClick={() => onSelect(t)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-[var(--color-mid-blue)]" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-[var(--subtle-text)]">{t.description}</div>
                </div>
              </div>
              <div className="text-xs text-[var(--subtle-text)] whitespace-nowrap">{t.date}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-sm text-[var(--subtle-text)] text-center">No templates found</div>
        )}
      </div>
    </div>
  )
}
