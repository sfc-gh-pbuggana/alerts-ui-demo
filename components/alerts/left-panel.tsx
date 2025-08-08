"use client"

import { useState } from "react"
import { Bell, CheckCircle2, ChevronDown, LoaderCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SEARCH_OPTIONS } from "./constants"
import { ConditionBuilder } from "./condition-builder"
import { TokenRow, TagToken, AddDestination } from "./notifications"
import { SearchDestination } from "./search-destination"
import { TemplateSearchList } from "./template-search-list"

function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-base font-semibold mb-2">{title}</h3>
}

function AdvancedInner() {
  const [notifyOk, setNotifyOk] = useState(true)
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifyOk(!notifyOk)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyOk ? "bg-[var(--color-primary)]" : "bg-gray-200"}`}
            aria-pressed={notifyOk}
            aria-label="Notify on ok"
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifyOk ? "translate-x-5" : "translate-x-1"}`} />
          </button>
        </div>
        <div className="grid gap-1">
          <div className="text-sm font-medium">Notify on ok</div>
          <div className="text-xs text-[var(--subtle-text)]">Send a notification when the alert returns to the status: OK</div>
        </div>
      </div>
      <div className="grid gap-1">
        <div className="text-sm font-medium">Notification frequency</div>
        <div className="text-xs text-[var(--subtle-text)]">
          Until the status returns to <span className="text-[var(--color-mid-blue)]">OK</span> send notifications:
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Select defaultValue="every-result">
            <SelectTrigger className="h-9 w-48 border-[var(--border)] bg-[var(--panel-3)] text-[var(--text)]">
              <SelectValue placeholder="Every result" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
              <SelectItem value="every-result">Every result</SelectItem>
              <SelectItem value="once-hour">Once per hour</SelectItem>
              <SelectItem value="once-day">Once per day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}

export function LeftPanel({ onApplyTemplate }: { onApplyTemplate: (name: string) => void }) {
  const [showCron, setShowCron] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "true">("idle")
  const [destinations, setDestinations] = useState<string[]>(["Email", "Webhook Destination 2"])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const addDestination = (name: string) => setDestinations((prev) => (prev.includes(name) ? prev : [...prev, name]))
  const removeDestination = (name: string) => setDestinations((prev) => prev.filter((d) => d !== name))

  const TEMPLATES = [
    { name: "Finance & Economics - Examples", date: "7/2/25", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor." },
    { name: "Finance & Economics - Examples", date: "6/30/25", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut." },
    { name: "Marketing KPI - Examples", date: "7/1/25", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore." },
  ]

  return (
    <aside className="overflow-y-auto h-full bg-[var(--panel)]">
      <div className="p-4 sm:p-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-[var(--color-mid-blue)]" />
            <h3 className="text-base font-semibold">Snowflake Alert Center</h3>
          </div>
          <p className="text-sm text-[var(--subtle-text)]">
            Write and run a query using the editor on the right. Once there is a valid query,
            configure the condition, schedule and notifications.
          </p>
        </section>

        <section>
          <SectionHeader title="Condition" />
          <ConditionBuilder />
          <div className="mt-3 flex items-center gap-3">
            <Button
              size="sm"
              className="bg-[var(--color-primary)] text-white hover:brightness-110"
              onClick={() => {
                setTesting(true)
                setTestResult("idle")
                setTimeout(() => {
                  setTesting(false)
                  setTestResult("true")
                }, 500)
              }}
              disabled={testing}
            >
              Test condition
            </Button>
            {testing ? (
              <span className="inline-flex items-center gap-2 text-[var(--subtle-text)] text-sm">
                <LoaderCircle className="h-4 w-4 animate-spin text-[var(--color-mid-blue)]" />
                Testing...
              </span>
            ) : testResult === "true" ? (
              <span className="inline-flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                True
              </span>
            ) : null}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="Load from Template" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                Browse available query templates
                <ChevronDown className="ml-2 h-4 w-4 text-[var(--subtle-text)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-[var(--text)] border-[var(--border)] p-2 w-[520px]">
              <TemplateSearchList templates={TEMPLATES} onSelect={(t) => onApplyTemplate(t.name)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section>
          <SectionHeader title="Schedule" />
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--subtle-text)]">Every</span>
              <div className="flex items-center gap-2">
                <Select defaultValue="1">
                  <SelectTrigger className="w-20 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                    {["1", "2", "3", "4", "6", "12"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="hour">
                  <SelectTrigger className="w-36 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                    <SelectItem value="minute">Minute</SelectItem>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-[var(--subtle-text)]">at</span>

              <Select defaultValue="24">
                <SelectTrigger className="w-64 h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                  <SelectValue placeholder="24 minutes past the hour" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                  {[0, 6, 12, 18, 24, 30, 36, 42, 48, 54].map((m) => (
                    <SelectItem key={m} value={String(m)}>{m} minutes past the hour</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="pt">
                <SelectTrigger className="w-[300px] h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                  <SelectItem value="pt">(UTC-07:00) Pacific Time (US and Canada)</SelectItem>
                  <SelectItem value="mt">(UTC-06:00) Mountain Time (US and Canada)</SelectItem>
                  <SelectItem value="ct">(UTC-05:00) Central Time (US and Canada)</SelectItem>
                  <SelectItem value="et">(UTC-04:00) Eastern Time (US and Canada)</SelectItem>
                  <SelectItem value="utc">(UTC+00:00) UTC</SelectItem>
                </SelectContent>
              </Select>

              <span className="ml-2 text-xs text-[var(--subtle-text)]">DST</span>
            </div>

            <button
              className="text-sm underline underline-offset-4 text-[var(--color-mid-blue)] hover:text-[var(--color-primary)] w-fit"
              onClick={() => setShowCron((s) => !s)}
            >
              {showCron ? "Hide cron syntax" : "Show cron syntax"}
            </button>

            {showCron && (
              <div className="rounded-md border border-[var(--border)] bg-[var(--panel-2)] p-3 text-sm">
                <div className="text-[var(--subtle-text)] mb-1">Cron</div>
                <code className="text-[var(--text)]">{"24 * * * *"}</code>
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader title="Notifications" />
          <div className="space-y-3">
            <TokenRow label="Send a notification on firing">
              {destinations.map((d) => (
                <TagToken key={d} text={d} onRemove={() => removeDestination(d)} />
              ))}
              <AddDestination onAdd={addDestination} options={SEARCH_OPTIONS} />
            </TokenRow>
            <TokenRow label="" ariaLabel="Add users or destinations">
              <SearchDestination options={SEARCH_OPTIONS} selected={destinations} onAdd={addDestination} />
            </TokenRow>
          </div>
        </section>

        <section>
          <Button className="h-9 bg-[var(--color-primary)] text-white hover:brightness-110">
            Finalize alert
          </Button>
        </section>

        <section>
          <button
            className="text-sm underline underline-offset-4 text-[var(--color-mid-blue)] hover:text-[var(--color-primary)]"
            onClick={() => setShowAdvanced((s) => !s)}
          >
            {showAdvanced ? "Hide advanced settings" : "Show advanced settings"}
          </button>
          {showAdvanced && (
            <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-4 space-y-4">
              <AdvancedInner />
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}
