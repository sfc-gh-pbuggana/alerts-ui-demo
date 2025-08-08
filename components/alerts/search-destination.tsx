"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  const results = options.filter((o) => !selected.includes(o) && o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative flex items-center gap-2 w-full">
      <Input
        placeholder="Search to add users"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="h-9 border-[var(--border)] bg-[var(--panel-3)] text-[var(--text)] placeholder:text-[var(--subtle-text)]"
      />
      <Button
        className="h-9 bg-[var(--color-primary)] text-white hover:brightness-110"
        onClick={() => {
          if (results[0]) {
            onAdd(results[0])
            setQuery("")
            setOpen(false)
          }
        }}
        disabled={results.length === 0}
      >
        Add
      </Button>

      {open && query.length > 0 && (
        <div className="absolute left-0 right-0 top-10 z-50 rounded-md border border-[var(--border)] bg-white shadow-md" role="listbox">
          {results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[var(--subtle-text)]">No matches</div>
          ) : (
            results.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onAdd(r)
                  setQuery("")
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--panel-3)]"
                role="option"
              >
                {r}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
