"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchDestination({
  options,
  selected,
  onAdd,
  placeholder = "Search to add users",
}: {
  options: string[]
  selected: string[]
  onAdd: (name: string) => void
  placeholder?: string
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [tempSelection, setTempSelection] = useState<string[]>(selected)
  const results = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setTempSelection(selected) // Reset temp selection on outside click
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, selected])

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 w-full">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          setTempSelection(selected)
          setOpen(true)
        }}
        className="h-9 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500"
      />
      <Button
        className="h-9 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
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
        <div className="absolute left-0 right-0 top-10 z-50 rounded-md border border-gray-300 bg-white shadow-md" role="listbox">
          <div className="px-3 py-2 border-b border-gray-300">
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          {results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-600">No matches</div>
          ) : (
            <div className="max-h-56 overflow-auto py-1">
              {results.map((r) => {
                const checked = tempSelection.includes(r)
                const disabled = selected.includes(r)
                return (
                  <label key={r} className={`flex items-center gap-2 px-3 py-2 text-sm ${disabled ? "opacity-60" : "hover:bg-gray-50"}`}>
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
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-300 bg-white">
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
              className="h-8 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
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
