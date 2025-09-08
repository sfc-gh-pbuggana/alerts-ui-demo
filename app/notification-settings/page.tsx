"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Workload {
  id: string
  name: string
  enabled: boolean
}

interface WorkloadCategory {
  id: string
  name: string
  workloads: Workload[]
  expanded: boolean
  enabled: boolean
}

function Toggle({ checked, onToggle, id }: { checked: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
        checked ? "bg-[var(--color-primary)]" : "bg-gray-200"
      }`}
      onClick={onToggle}
      aria-pressed={checked}
      aria-labelledby={id}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

export default function NotificationSettingsPage() {
  const [categories, setCategories] = useState<WorkloadCategory[]>([
    {
      id: "ai-ml",
      name: "AI & ML",
      expanded: true,
      enabled: true,
      workloads: [
        { id: "studio", name: "Studio", enabled: true },
        { id: "cortex-analyst", name: "Cortex Analyst", enabled: true },
        { id: "cortex-search", name: "Cortex Search", enabled: true },
        { id: "features", name: "Features", enabled: false },
        { id: "models", name: "Models", enabled: true },
        { id: "evaluations", name: "Evaluations", enabled: false },
        { id: "document-ai", name: "Document AI", enabled: true },
        { id: "agents", name: "Agents", enabled: true },
        { id: "platform-intelligence", name: "Platform Intelligence", enabled: true },
      ]
    },
    {
      id: "ingestion",
      name: "Ingestion",
      expanded: true,
      enabled: true,
      workloads: [
        { id: "openflow", name: "Openflow", enabled: true },
        { id: "migration-workloads", name: "Migration Workloads", enabled: true },
      ]
    },
    {
      id: "governance-security",
      name: "Governance & Security",
      expanded: true,
      enabled: true,
      workloads: [
        { id: "users-roles", name: "Users & roles", enabled: true },
        { id: "trust-center", name: "Trust Center", enabled: false },
        { id: "network-policies", name: "Network policies", enabled: true },
        { id: "tags-policies", name: "Tags & policies", enabled: true },
      ]
    },
    {
      id: "cost-management",
      name: "Cost Management",
      expanded: true,
      enabled: true,
      workloads: [
        { id: "cost-management", name: "Cost management", enabled: true },
        { id: "accounts", name: "Accounts", enabled: false },
        { id: "admin-contacts", name: "Admin contacts", enabled: true },
        { id: "billing", name: "Billing", enabled: true },
        { id: "terms", name: "Terms", enabled: false },
        { id: "integrations", name: "Integrations", enabled: true },
      ]
    },
  ])

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

  const toggleCategoryEnabled = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            enabled: !cat.enabled,
            workloads: cat.workloads.map(workload => ({ ...workload, enabled: !cat.enabled }))
          } 
        : cat
    ))
  }

  const toggleWorkload = (categoryId: string, workloadId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            workloads: cat.workloads.map(workload =>
              workload.id === workloadId
                ? { ...workload, enabled: !workload.enabled }
                : workload
            )
          }
        : cat
    ))
  }

  const unsubscribeFromAll = () => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      enabled: false,
      workloads: cat.workloads.map(workload => ({ ...workload, enabled: false }))
    })))
  }

  const unsubscribeFromCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            enabled: false,
            workloads: cat.workloads.map(workload => ({ ...workload, enabled: false }))
          }
        : cat
    ))
  }

  return (
    <div className="sf-theme min-h-screen bg-[var(--panel)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <Link href="/alerts" className="inline-flex items-center gap-2 text-[var(--color-mid-blue)] hover:text-[var(--color-primary)]">
            <span aria-hidden>{"\u2190"}</span>
            Back
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Notification Subscriptions</h1>
          <p className="text-[var(--subtle-text)]">
            Enable or disable the reports, digests and notifications you receive from the platform
          </p>
          <button 
            className="border border-gray-400 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
            onClick={unsubscribeFromAll}
          >
            Unsubscribe from All Shown
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-[var(--border)] rounded-lg bg-white">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center gap-3 hover:bg-[var(--panel-3)] p-2 rounded transition-colors"
                  >
                    {category.expanded ? (
                      <ChevronDown className="h-4 w-4 text-[var(--subtle-text)]" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[var(--subtle-text)]" />
                    )}
                  </button>
                  <Toggle
                    checked={category.enabled}
                    onToggle={() => toggleCategoryEnabled(category.id)}
                    id={`category-${category.id}`}
                  />
                  <h2 className="text-lg font-medium">{category.name}</h2>
                </div>
                <button 
                  className="border border-gray-400 text-gray-800 hover:bg-gray-100 px-3 py-1 rounded-md text-sm"
                  onClick={() => unsubscribeFromCategory(category.id)}
                >
                  Unsubscribe from {category.name}
                </button>
              </div>

              {category.expanded && (
                <div className="border-t border-[var(--border)]">
                  {category.workloads.map((workload) => (
                    <div key={workload.id} className="p-4 border-b border-[var(--border)] last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Toggle
                          checked={workload.enabled}
                          onToggle={() => toggleWorkload(category.id, workload.id)}
                          id={`${category.id}-${workload.id}`}
                        />
                        <h3 className="font-medium" id={`${category.id}-${workload.id}`}>{workload.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


