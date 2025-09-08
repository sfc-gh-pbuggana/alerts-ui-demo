"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/placeholder-logo.svg"
          alt="Snowflake"
          className="h-7 w-auto"
        />
        <Separator orientation="vertical" className="h-6 bg-[var(--border)]" />
        <nav className="text-sm text-[var(--subtle-text)] truncate">
          <span className="text-[var(--text)] font-medium">Alert Center</span>
          <span className="mx-2 text-[var(--subtle-text)]">/</span>
          <span className="text-[var(--text)]">Test Alert Demo 1234</span>
        </nav>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          className="h-8 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)] hover:bg-[var(--panel-3)]"
        >
          Save
        </Button>
        <Button className="h-8 bg-[var(--color-primary)] text-white hover:brightness-110" variant="default">
          Create
        </Button>
      </div>
    </header>
  )
}
