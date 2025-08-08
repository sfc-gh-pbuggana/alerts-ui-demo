"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SaveTemplateModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (title: string, description: string) => void
}) {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div className="mt-[10vh] w-full max-w-xl rounded-xl border border-[var(--border)] bg-white shadow-xl">
          <div className="px-5 pt-4 pb-3 border-b border-[var(--border)]">
            <div className="text-lg font-semibold">Save Alert Query as a Template</div>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid gap-2">
              <label htmlFor="template-title" className="text-sm font-medium">Template Title</label>
              <input
                id="template-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title"
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="template-desc" className="text-sm font-medium">Template Description</label>
              <textarea
                id="template-desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe this template"
                rows={5}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] p-3 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-y"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-5 pb-5">
            <Button variant="outline" className="h-9" onClick={onClose}>Cancel</Button>
            <Button
              className="h-9 bg-[var(--color-primary)] text-white hover:brightness-110"
              onClick={() => onSave(title.trim(), desc.trim())}
              disabled={!title.trim()}
            >
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
