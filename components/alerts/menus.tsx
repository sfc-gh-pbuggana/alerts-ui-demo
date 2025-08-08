"use client"

import { Check, ChevronDown, Database, BadgeIcon as IdCard } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ROLES, WAREHOUSES, DATABASES } from "./constants"

export function RoleWarehouseMenu({
  role,
  setRole,
  warehouse,
  setWarehouse,
}: {
  role: string
  setRole: (r: string) => void
  warehouse: string
  setWarehouse: (w: string) => void
}) {
  const whSize = WAREHOUSES.find((w) => w.name === warehouse)?.size ?? ""
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 h-8 px-2 rounded-md border border-[var(--border)] bg-[var(--panel-3)] text-sm text-[var(--text)] shrink-0 max-w-full">
          <IdCard className="h-4 w-4 text-[var(--color-mid-blue)]" />
          <span className="truncate max-w-[160px]">{role}</span>
          <span className="mx-2 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="truncate max-w-[200px]">{warehouse}</span>
          {whSize ? <span className="text-xs text-[var(--subtle-text)]">{' ('}{whSize}{')'}</span> : null}
          <ChevronDown className="h-4 w-4 text-[var(--subtle-text)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        avoidCollisions
        collisionPadding={12}
        className="bg-white text-[var(--text)] border-[var(--border)] w-[520px] max-w-[calc(100vw-24px)] p-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <DropdownMenuLabel className="text-xs text-[var(--subtle-text)] mb-1">Run as role</DropdownMenuLabel>
            <div className="max-h-60 overflow-auto rounded-md border border-[var(--border)]">
              {ROLES.map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)} className="flex items-center justify-between cursor-pointer">
                  <span>{r}</span>
                  {r === role ? <Check className="h-4 w-4 text-[var(--color-mid-blue)]" /> : null}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="text-xs text-[var(--subtle-text)] mb-1">Run on warehouse</DropdownMenuLabel>
            <div className="max-h-60 overflow-auto rounded-md border border-[var(--border)]">
              {WAREHOUSES.map((w) => (
                <DropdownMenuItem key={w.name} onClick={() => setWarehouse(w.name)} className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    {w.name}
                    <span className="text-xs text-[var(--subtle-text)]">({w.size})</span>
                  </span>
                  {w.name === warehouse ? <Check className="h-4 w-4 text-[var(--color-mid-blue)]" /> : null}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DatabaseSchemaMenu({
  database,
  setDatabase,
  schema,
  setSchema,
}: {
  database: string
  setDatabase: (d: string) => void
  schema: string
  setSchema: (s: string) => void
}) {
  const schemas = DATABASES[database] ?? []
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 h-8 px-2 rounded-md border border-[var(--border)] bg-[var(--panel-3)] text-sm text-[var(--text)] shrink-0">
          <Database className="h-4 w-4 text-[var(--color-mid-blue)]" />
          {database}
          <ChevronDown className="h-4 w-4 text-[var(--subtle-text)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        avoidCollisions
        collisionPadding={12}
        className="bg-white text-[var(--text)] border-[var(--border)] w-[520px] max-w-[calc(100vw-24px)] p-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <DropdownMenuLabel className="text-xs text-[var(--subtle-text)] mb-1">Databases</DropdownMenuLabel>
            <div className="max-h-60 overflow-auto rounded-md border border-[var(--border)]">
              {Object.keys(DATABASES).map((db) => (
                <DropdownMenuItem key={db} onClick={() => setDatabase(db)} className="flex items-center justify-between cursor-pointer">
                  <span>{db}</span>
                  {db === database ? <Check className="h-4 w-4 text-[var(--color-mid-blue)]" /> : null}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="text-xs text-[var(--subtle-text)] mb-1">Schemas</DropdownMenuLabel>
            <div className="max-h-60 overflow-auto rounded-md border border-[var(--border)]">
              {schemas.map((sc) => (
                <DropdownMenuItem key={sc} onClick={() => setSchema(sc)} className="flex items-center justify-between cursor-pointer">
                  <span>{sc}</span>
                  {sc === schema ? <Check className="h-4 w-4 text-[var(--color-mid-blue)]" /> : null}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
