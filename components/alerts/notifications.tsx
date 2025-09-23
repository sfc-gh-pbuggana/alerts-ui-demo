"use client"

import { Bell, X, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

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
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [channelType, setChannelType] = useState<string>("email")
  const [nickname, setNickname] = useState<string>("")
  const [form, setForm] = useState<Record<string, string>>({})
  const [isInbound, setIsInbound] = useState<boolean>(false)

  const NOTIFICATION_TYPES: { value: string; label: string }[] = [
    { value: "email", label: "Email" },
    { value: "sns", label: "Amazon SNS" },
    { value: "azure-eg", label: "Azure Event Grid" },
    { value: "gcp-pubsub", label: "Google Pub/Sub" },
    { value: "slack", label: "Slack" },
    { value: "teams", label: "Microsoft Teams" },
  ]

  const requiresDirectionToggle = (type: string) => {
    return ["sns", "azure-eg", "gcp-pubsub"].includes(type)
  }

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const renderConfigFields = () => {
    if (channelType === "email") {
      return (
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="email-recipients">Recipients</Label>
            <Input id="email-recipients" placeholder="Comma-separated emails (e.g. alice@acme.com, bob@acme.com)" value={form.recipients || ""} onChange={(e) => updateField("recipients", e.target.value)} />
            <div className="text-xs text-[var(--subtle-text)]">Enter one or more email addresses to notify.</div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email-subject">Subject prefix (optional)</Label>
            <Input id="email-subject" placeholder="e.g. [ALERT]" value={form.subject || ""} onChange={(e) => updateField("subject", e.target.value)} />
          </div>
        </div>
      )
    }
    
    if (channelType === "slack") {
      return (
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="slack-url">Slack Webhook URL</Label>
            <Input id="slack-url" placeholder="https://hooks.slack.com/services/..." value={form.slackUrl || ""} onChange={(e) => updateField("slackUrl", e.target.value)} />
            <div className="text-xs text-[var(--subtle-text)]">Provide the Slack webhook URL for your channel or workspace.</div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="slack-channel">Channel (optional)</Label>
            <Input id="slack-channel" placeholder="#alerts" value={form.slackChannel || ""} onChange={(e) => updateField("slackChannel", e.target.value)} />
            <div className="text-xs text-[var(--subtle-text)]">Override the default channel configured in the webhook.</div>
          </div>
        </div>
      )
    }
    
    if (channelType === "teams") {
      return (
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="teams-url">Teams Webhook URL</Label>
            <Input id="teams-url" placeholder="https://outlook.office.com/webhook/..." value={form.teamsUrl || ""} onChange={(e) => updateField("teamsUrl", e.target.value)} />
            <div className="text-xs text-[var(--subtle-text)]">Provide the Microsoft Teams webhook URL for your channel.</div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="teams-title">Message title (optional)</Label>
            <Input id="teams-title" placeholder="Alert Notification" value={form.teamsTitle || ""} onChange={(e) => updateField("teamsTitle", e.target.value)} />
          </div>
        </div>
      )
    }
    
    if (channelType === "sns") {
      if (isInbound) {
        return (
          <div className="grid gap-3">
            <div className="text-xs text-[var(--subtle-text)] bg-[var(--panel-3)] p-3 rounded-md">
              Note: SNS inbound integrations are used for receiving events from AWS into the platform, typically for auto-ingest scenarios.
            </div>
            <div className="grid gap-1">
              <Label htmlFor="sns-topic-arn">SNS Topic ARN</Label>
              <Input id="sns-topic-arn" placeholder="arn:aws:sns:us-east-1:123456789012:my-inbound-topic" value={form.snsTopicArn || ""} onChange={(e) => updateField("snsTopicArn", e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="sns-role-arn">IAM Role ARN</Label>
              <Input id="sns-role-arn" placeholder="arn:aws:iam::123456789012:role/platform-sns-role" value={form.snsRoleArn || ""} onChange={(e) => updateField("snsRoleArn", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">IAM role that the platform will assume to access SNS.</div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="sns-arn">Topic ARN</Label>
              <Input id="sns-arn" placeholder="arn:aws:sns:us-east-1:123456789012:my-topic" value={form.arn || ""} onChange={(e) => updateField("arn", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">Provide the Amazon SNS topic ARN the platform will publish to.</div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="aws-region">AWS Region</Label>
              <Input id="aws-region" placeholder="us-east-1" value={form.region || ""} onChange={(e) => updateField("region", e.target.value)} />
            </div>
            <div className="grid gap-1 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-1">
                <Label htmlFor="aws-key">Access Key ID</Label>
                <Input id="aws-key" placeholder="AKIA..." value={form.accessKey || ""} onChange={(e) => updateField("accessKey", e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="aws-secret">Secret Access Key</Label>
                <Input id="aws-secret" placeholder="••••••••" value={form.secretKey || ""} onChange={(e) => updateField("secretKey", e.target.value)} />
              </div>
            </div>
          </div>
        )
      }
    }
    
    if (channelType === "azure-eg") {
      if (isInbound) {
        return (
          <div className="grid gap-3">
            <div className="text-xs text-[var(--subtle-text)] bg-[var(--panel-3)] p-3 rounded-md">
              Note: Azure Event Grid inbound integrations receive events from Azure services into the platform.
            </div>
            <div className="grid gap-1">
              <Label htmlFor="eg-in-resource">Event Grid Topic Resource ID</Label>
              <Input id="eg-in-resource" placeholder="/subscriptions/sub/resourceGroups/rg/providers/Microsoft.EventGrid/topics/topic" value={form.resourceId || ""} onChange={(e) => updateField("resourceId", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">Used for inbound events to the platform.</div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="eg-in-key">Access key</Label>
              <Input id="eg-in-key" placeholder="Key for the topic" value={form.inKey || ""} onChange={(e) => updateField("inKey", e.target.value)} />
            </div>
          </div>
        )
      } else {
        return (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="eg-endpoint">Topic endpoint URL</Label>
              <Input id="eg-endpoint" placeholder="https://topic-name.region-1.eventgrid.azure.net/api/events" value={form.endpoint || ""} onChange={(e) => updateField("endpoint", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">Provide the Azure Event Grid topic endpoint URL.</div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="eg-key">Access key</Label>
              <Input id="eg-key" placeholder="Key for the topic" value={form.key || ""} onChange={(e) => updateField("key", e.target.value)} />
            </div>
          </div>
        )
      }
    }
    
    if (channelType === "gcp-pubsub") {
      if (isInbound) {
        return (
          <div className="grid gap-3">
            <div className="text-xs text-[var(--subtle-text)] bg-[var(--panel-3)] p-3 rounded-md">
              Note: Google Pub/Sub inbound integrations allow the platform to receive messages from GCP services.
            </div>
            <div className="grid gap-1">
              <Label htmlFor="ps-in-topic">Topic name</Label>
              <Input id="ps-in-topic" placeholder="projects/project/topics/topic" value={form.inTopic || ""} onChange={(e) => updateField("inTopic", e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="ps-in-sa">Service account JSON</Label>
              <Textarea id="ps-in-sa" placeholder='{ "type": "service_account", ... }' value={form.inServiceAccount || ""} onChange={(e) => updateField("inServiceAccount", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">Credentials used by the platform to pull from Pub/Sub.</div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="ps-topic">Topic name</Label>
              <Input id="ps-topic" placeholder="projects/project/topics/topic" value={form.topic || ""} onChange={(e) => updateField("topic", e.target.value)} />
              <div className="text-xs text-[var(--subtle-text)]">Provide the full Pub/Sub topic path.</div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="ps-sa">Service account JSON</Label>
              <Textarea id="ps-sa" placeholder='{ "type": "service_account", ... }' value={form.serviceAccount || ""} onChange={(e) => updateField("serviceAccount", e.target.value)} />
            </div>
          </div>
        )
      }
    }
    
    return null
  }

  const onSave = () => {
    toast({ title: "Notification channel saved", description: nickname ? `Saved ${nickname}` : "Saved new channel" })
    setOpen(false)
  }

  const onTest = () => {
    toast({ title: "Test notification sent", description: "Check your destination to confirm delivery." })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-xs px-2 py-1 rounded-md border border-dashed border-gray-300 text-blue-600 hover:text-blue-700 hover:border-blue-600">
          + Add destination
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-gray-900 border-gray-200 min-w-[260px]">
        <DropdownMenuLabel className="text-xs text-gray-600">Quick add</DropdownMenuLabel>
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onAdd(opt)} className="cursor-pointer">
            {opt}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem className="cursor-pointer text-blue-600" onClick={() => setOpen(true)}>Set up new channel</DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Set up new channel</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[var(--subtle-text)]">This flow will help you configure a new notification channel.</div>

          <div className="grid gap-3 mt-2">
            <div className="grid gap-1">
              <Label htmlFor="nickname">Nickname (optional)</Label>
              <Input id="nickname" placeholder="e.g. Prod Alerts Email" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>

            <div className="grid gap-1">
              <Label>Select Notification Channel to Create</Label>
              <Select value={channelType} onValueChange={setChannelType}>
                <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]">
                  <SelectValue placeholder="Choose a channel type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white text-[var(--text)] border-[var(--border)] shadow-md">
                  {NOTIFICATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresDirectionToggle(channelType) && (
              <div className="grid gap-1">
                <Label>Direction</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isInbound}
                      onCheckedChange={setIsInbound}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm">{isInbound ? "Inbound" : "Outbound"}</span>
                  </div>
                  <div className="text-xs text-[var(--subtle-text)]">
                    {isInbound ? "Receive events from cloud services into the platform" : "Send notifications from the platform to cloud services"}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              <h4 className="text-sm font-medium">Enter notification configuration</h4>
              <a href="#" target="_blank" rel="noreferrer" aria-label="Open documentation">
                <HelpCircle className="h-4 w-4 text-[var(--color-mid-blue)]" />
              </a>
            </div>

            {renderConfigFields()}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onTest}>Send me a Test Notification</Button>
            <Button className="h-9 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800" onClick={onSave}>Save Notification Channel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  )
}
