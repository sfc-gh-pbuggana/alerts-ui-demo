"use client"

import { Bell, X } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TokenRow({ label, children, ariaLabel }: { label?: string; children: React.ReactNode; ariaLabel?: string }) {
  return (
    <div className="grid gap-2">
      {label ? <Label className="text-sm text-[var(--subtle-text)]">{label}</Label> : null}
      <div className="min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-2 py-2 flex flex-wrap items-center gap-2" aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  )
}

export function TagToken({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--panel-3)] border border-[var(--border)] pl-2 pr-1 py-1 text-xs">
      <Bell className="h-3.5 w-3.5 text-[var(--color-mid-blue)]" />
      <span className="px-1">{text}</span>
      {onRemove ? (
        <button className="group p-0.5 hover:bg-[var(--border)] rounded-sm" aria-label={`Remove ${text}`} onClick={onRemove}>
          <X className="h-3 w-3 text-[var(--subtle-text)] group-hover:text-[var(--text)]" />
        </button>
      ) : null}
    </span>
  )
}

export function AddDestination({ onAdd, options }: { onAdd: (name: string) => void; options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-xs px-2 py-1 rounded-md border border-dashed border-[var(--border)] text-[var(--color-mid-blue)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]">
          + Add destination
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-[var(--text)] border-[var(--border)] min-w-[260px]">
        <DropdownMenuLabel className="text-xs text-[var(--subtle-text)]">Quick add</DropdownMenuLabel>
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onAdd(opt)} className="cursor-pointer">
            {opt}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-[var(--border)]" />
        <DropdownMenuItem className="cursor-pointer text-[var(--color-primary)]">Set up new channel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
