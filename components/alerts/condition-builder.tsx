"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function ConditionBuilder() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select defaultValue="sum">
        <SelectTrigger className="h-9 w-36 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
          <SelectValue placeholder="Aggregation" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
          <SelectItem value="sum">Sum</SelectItem>
          <SelectItem value="avg">Average</SelectItem>
          <SelectItem value="min">Min</SelectItem>
          <SelectItem value="max">Max</SelectItem>
          <SelectItem value="count">Count</SelectItem>
        </SelectContent>
      </Select>

      <Input defaultValue="number_of_failures" className="h-9 w-40 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]" />

      <Select defaultValue="gt">
        <SelectTrigger className="h-9 w-20 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
          <SelectValue placeholder=">" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
          <SelectItem value="gt">{">"}</SelectItem>
          <SelectItem value="gte">{">="}</SelectItem>
          <SelectItem value="lt">{"<"}</SelectItem>
          <SelectItem value="lte">{"<="}</SelectItem>
          <SelectItem value="eq">{"="}</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="static">
        <SelectTrigger className="h-9 w-40 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
          <SelectValue placeholder="Value type" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
          <SelectItem value="static">Static Value</SelectItem>
          <SelectItem value="column">Column</SelectItem>
          <SelectItem value="percent">Percent Change</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Enter value to check" className="h-9 w-48 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]" />
    </div>
  )
}
