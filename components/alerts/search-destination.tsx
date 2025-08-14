"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchDestination({
  options,
  selected,
  onAdd,
}: {
  options: string[]
  selected: string[]
  onAdd: (name: string) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [tempSelection, setTempSelection] = useState<string[]>(selected)
  const results = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative flex items-center gap-2 w-full">
      <Input
        placeholder="Search to add users"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          setTempSelection(selected)
          setOpen(true)
        }}
        className="h-9 border-[var(--border)] bg-[var(--panel-3)] text-[var(--text)] placeholder:text-[var(--subtle-text)]"
      />
      <Button
        className="h-9 bg-[var(--color-primary)] text-white hover:brightness-110"
        onClick={() => {
          tempSelection
            .filter((u) => !selected.includes(u))
            .forEach((u) => onAdd(u))
          setQuery("")
          setOpen(false)
        }}
        disabled={tempSelection.length === selected.length}
      >
        Add
      </Button>

      {open && (
        <div className="absolute left-0 right-0 top-10 z-50 rounded-md border border-[var(--border)] bg-white shadow-md" role="listbox">
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 bg-[var(--panel-3)] border-[var(--border)] text-[var(--text)]"
            />
          </div>
          {results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[var(--subtle-text)]">No matches</div>
          ) : (
            <div className="max-h-56 overflow-auto py-1">
              {results.map((r) => {
                const checked = tempSelection.includes(r)
                const disabled = selected.includes(r)
                return (
                  <label key={r} className={`flex items-center gap-2 px-3 py-2 text-sm ${disabled ? "opacity-60" : "hover:bg-[var(--panel-3)]"}`}>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        if (disabled) return
                        setTempSelection((prev) => (v ? [...prev, r] : prev.filter((x) => x !== r)))
                      }}
                      className="size-4"
                    />
                    <span className="truncate">{r}</span>
                  </label>
                )
              })}
            </div>
          )}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-[var(--border)] bg-[var(--panel)]">
            <Button
              variant="outline"
              className="h-8"
              onClick={() => {
                setTempSelection(selected)
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              className="h-8 bg-[var(--color-primary)] text-white hover:brightness-110"
              onClick={() => {
                tempSelection
                  .filter((u) => !selected.includes(u))
                  .forEach((u) => onAdd(u))
                setQuery("")
                setOpen(false)
              }}
              disabled={tempSelection.length === selected.length}
            >
              Add selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
