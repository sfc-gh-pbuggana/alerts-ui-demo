"use client"

import React, { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { ArrowLeft, Clock, User, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

// SQL Syntax Highlighting Component matching the editor style
const SQLCodeBlock = ({ sql }: { sql: string }) => {
  const lines = sql.trim().split('\n')
  
  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <div className="text-sm font-mono">
        {lines.map((line, index) => (
          <div key={index} className="flex border-b border-gray-100 last:border-b-0">
            <span className="text-blue-500 select-none w-10 text-right mr-4 py-2 px-2 bg-gray-50 text-xs leading-5 border-r border-gray-200">
              {index + 1}
            </span>
            <div className="flex-1 py-2 px-3 leading-5">
              <span className="whitespace-pre-wrap">
                {line
                  .split(/(\b(?:SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT|INTO|VALUES|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|AS|AND|OR|NOT|IN|EXISTS|CASE|WHEN|THEN|ELSE|END|JOIN|LEFT|RIGHT|INNER|OUTER|ON|UNION|DISTINCT|COUNT|SUM|AVG|MAX|MIN|DATEADD|DATE_TRUNC|CURRENT_TIMESTAMP|OVER|ROWS|BETWEEN|PRECEDING|FOLLOWING)\b|'[^']*'|\d+\.?\d*|--.*$|\{\{[^}]+\}\})/gi)
                  .map((part, partIndex) => {
                    // SQL Keywords
                    if (/^(SELECT|FROM|WHERE|GROUP|BY|HAVING|ORDER|INSERT|INTO|VALUES|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|AS|AND|OR|NOT|IN|EXISTS|CASE|WHEN|THEN|ELSE|END|JOIN|LEFT|RIGHT|INNER|OUTER|ON|UNION|DISTINCT|COUNT|SUM|AVG|MAX|MIN|DATEADD|DATE_TRUNC|CURRENT_TIMESTAMP|OVER|ROWS|BETWEEN|PRECEDING|FOLLOWING)$/i.test(part)) {
                      return <span key={partIndex} className="text-blue-600 font-semibold">{part}</span>
                    }
                    // Functions
                    if (/^(SUM|AVG|COUNT|MAX|MIN|DATE_TRUNC|DATEADD|CURRENT_TIMESTAMP)$/i.test(part)) {
                      return <span key={partIndex} className="text-purple-600 font-medium">{part}</span>
                    }
                    // Strings
                    if (/^'[^']*'$/.test(part)) {
                      return <span key={partIndex} className="text-red-600">{part}</span>
                    }
                    // Numbers
                    if (/^\d+\.?\d*$/.test(part)) {
                      return <span key={partIndex} className="text-green-600">{part}</span>
                    }
                    // Comments
                    if (/^--.*$/.test(part)) {
                      return <span key={partIndex} className="text-gray-500 italic">{part}</span>
                    }
                    // Template variables
                    if (/^\{\{[^}]+\}\}$/.test(part)) {
                      return <span key={partIndex} className="text-purple-600 bg-purple-50 px-1 rounded border">{part}</span>
                    }
                    // Default
                    return <span key={partIndex} className="text-gray-800">{part}</span>
                  })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AlertDetailProps {
  params: Promise<{
    id: string
  }>
}

export default function AlertDetailPage({ params }: AlertDetailProps) {
  const resolvedParams = use(params)
  // Mock data based on alert ID
  const getAlertData = (id: string) => {
    const alertsData: Record<string, any> = {
      // Historical execution alerts
      "ALT-5314": {
        name: "Cost Anomaly Detection",
        type: "Cost Anomaly",
        category: "Cost Management",
        severity: 1,
        status: "Triggered",
        created: "2 hours ago",
        completed: "2 hours ago",
        owner: "ACCOUNTADMIN",
        conditionSql: `SELECT 
  DATE_TRUNC('day', start_time) as execution_date,
  SUM(credits_used) as daily_credits,
  AVG(SUM(credits_used)) OVER (
    ORDER BY DATE_TRUNC('day', start_time) 
    ROWS BETWEEN 6 PRECEDING AND 1 PRECEDING
  ) as avg_credits_7_days
FROM snowflake.account_usage.warehouse_metering_history 
WHERE start_time >= DATEADD('day', -30, CURRENT_TIMESTAMP())
GROUP BY DATE_TRUNC('day', start_time)
HAVING daily_credits > (avg_credits_7_days * 1.5)
ORDER BY execution_date DESC;`,
        actionSql: `-- Send notification when cost anomaly detected
INSERT INTO alerts.notifications (
  alert_id,
  alert_name,
  severity,
  message,
  created_at
) VALUES (
  '{{ alert_id }}',
  '{{ alert_name }}',
  {{ severity }},
  'Cost anomaly detected: Daily credits ({{ daily_credits }}) exceeded 7-day average ({{ avg_credits_7_days }}) by {{ ((daily_credits / avg_credits_7_days - 1) * 100)::NUMBER(5,2) }}%',
  CURRENT_TIMESTAMP()
);`,
        description: "Detects when daily credit consumption exceeds 150% of the 7-day rolling average",
        channels: ["Email: ACCOUNTADMIN, COSTADMIN", "In-App: All Cost Management Users", "Webhook: Cost-Alerts-Channel"]
      },
      "ALT-5313": {
        name: "Snowpipe Load Failure",
        type: "Snowpipe Error",
        category: "Snowpipe",
        severity: 2,
        status: "Failed",
        created: "5 hours ago",
        completed: "-",
        owner: "ACCOUNTADMIN",
        conditionSql: `SELECT 
  pipe_name,
  file_name,
  last_load_time,
  status,
  error_message
FROM snowflake.account_usage.copy_history 
WHERE status = 'LOAD_FAILED'
  AND last_load_time >= DATEADD('hour', -1, CURRENT_TIMESTAMP())
ORDER BY last_load_time DESC;`,
        actionSql: `-- Log Snowpipe failure and send notification
INSERT INTO alerts.snowpipe_failures (
  pipe_name,
  file_name,
  error_message,
  failure_time,
  alert_sent
) VALUES (
  '{{ pipe_name }}',
  '{{ file_name }}',
  '{{ error_message }}',
  '{{ last_load_time }}',
  CURRENT_TIMESTAMP()
);`,
        description: "Monitors Snowpipe operations and alerts on load failures",
        channels: ["Email: Data Engineering Team", "Slack: #data-pipeline-alerts", "PagerDuty: On-Call Engineer"]
      },
      "ALT-5311": {
        name: "Data Quality Check",
        type: "Data Quality Issue",
        category: "Data Quality",
        severity: 3,
        status: "Resolved",
        created: "1 day ago",
        completed: "1 day ago",
        owner: "ACCOUNTADMIN",
        conditionSql: `SELECT 
  table_name,
  COUNT(*) as row_count,
  COUNT(DISTINCT primary_key) as unique_keys,
  COUNT(*) - COUNT(DISTINCT primary_key) as duplicate_count
FROM information_schema.tables t
JOIN your_database.your_schema.your_table data ON 1=1
WHERE table_schema = 'PRODUCTION'
GROUP BY table_name
HAVING duplicate_count > 0
ORDER BY duplicate_count DESC;`,
        actionSql: `-- Log data quality issue
INSERT INTO alerts.data_quality_issues (
  table_name,
  issue_type,
  duplicate_count,
  detected_at
) VALUES (
  '{{ table_name }}',
  'DUPLICATE_RECORDS',
  {{ duplicate_count }},
  CURRENT_TIMESTAMP()
);`,
        description: "Checks for duplicate records in production tables",
        channels: ["Email: Data Quality Team", "In-App: Data Analysts", "Dashboard: DQ-Metrics"]
      },
      
      // Scheduled alerts
      "ALERT_001": {
        name: "COST_ANOMALY_DETECTION_PROD",
        type: "Cost Anomaly",
        category: "Cost Management",
        severity: 1,
        status: "Active",
        created: "1 day ago",
        completed: "Running",
        owner: "ACCOUNTADMIN",
        schedule: "Every 1 hour",
        conditionSql: `SELECT 
  warehouse_name,
  DATE_TRUNC('hour', start_time) as hour_bucket,
  SUM(credits_used) as hourly_credits,
  AVG(SUM(credits_used)) OVER (
    PARTITION BY warehouse_name 
    ORDER BY DATE_TRUNC('hour', start_time) 
    ROWS BETWEEN 23 PRECEDING AND 1 PRECEDING
  ) as avg_hourly_credits_24h
FROM snowflake.account_usage.warehouse_metering_history 
WHERE start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP())
  AND warehouse_name = 'PRODUCTION_WH'
GROUP BY warehouse_name, DATE_TRUNC('hour', start_time)
HAVING hourly_credits > (avg_hourly_credits_24h * 2.0)
ORDER BY hour_bucket DESC;`,
        actionSql: `-- Send high-priority cost anomaly alert
INSERT INTO alerts.cost_anomalies (
  warehouse_name,
  anomaly_time,
  actual_credits,
  expected_credits,
  severity_multiplier,
  alert_sent_at
) VALUES (
  '{{ warehouse_name }}',
  '{{ hour_bucket }}',
  {{ hourly_credits }},
  {{ avg_hourly_credits_24h }},
  {{ (hourly_credits / avg_hourly_credits_24h)::NUMBER(5,2) }},
  CURRENT_TIMESTAMP()
);

-- Send immediate notification
CALL system$send_email(
  'cost-alerts@company.com',
  'URGENT: Cost Anomaly Detected',
  'Warehouse {{ warehouse_name }} consumed {{ hourly_credits }} credits in the last hour, which is {{ ((hourly_credits / avg_hourly_credits_24h - 1) * 100)::NUMBER(5,1) }}% above the 24-hour average.'
);`,
        description: "Production cost anomaly detection running every hour to catch spending spikes",
        channels: ["Email: ACCOUNTADMIN, COSTADMIN", "In-App: Finance Team", "Slack: #cost-alerts"]
      },
      
      "ALERT_002": {
        name: "SNOWPIPE_FAILURE_MONITOR",
        type: "Snowpipe Error",
        category: "Snowpipe",
        severity: 2,
        status: "Active",
        created: "3 days ago",
        completed: "Running",
        owner: "ACCOUNTADMIN",
        schedule: "Every 15 minutes",
        conditionSql: `SELECT 
  pipe_name,
  file_name,
  last_load_time,
  status,
  error_message,
  error_count
FROM snowflake.account_usage.copy_history 
WHERE status IN ('LOAD_FAILED', 'PARTIALLY_LOADED')
  AND last_load_time >= DATEADD('minute', -15, CURRENT_TIMESTAMP())
  AND pipe_name LIKE 'PROD_%'
ORDER BY last_load_time DESC;`,
        actionSql: `-- Log Snowpipe failure details
INSERT INTO alerts.snowpipe_failures (
  pipe_name,
  file_name,
  failure_time,
  error_message,
  failure_count,
  alert_triggered_at
) VALUES (
  '{{ pipe_name }}',
  '{{ file_name }}',
  '{{ last_load_time }}',
  '{{ error_message }}',
  {{ error_count }},
  CURRENT_TIMESTAMP()
);

-- Send notification to data engineering team
CALL system$send_slack_message(
  '#data-pipeline-alerts',
  'Snowpipe Failure Alert: {{ pipe_name }} failed to load {{ file_name }}. Error: {{ error_message }}'
);`,
        description: "Monitors production Snowpipe operations for failures every 15 minutes",
        channels: ["Email: Data Engineering Team", "Slack: #data-pipeline-alerts", "PagerDuty: On-Call Engineer"]
      },
      
      "ALERT_003": {
        name: "DATA_QUALITY_CHECKER",
        type: "Data Quality Issue",
        category: "Data Quality",
        severity: 3,
        status: "Suspended",
        created: "1 week ago",
        completed: "Suspended",
        owner: "ACCOUNTADMIN",
        schedule: "Every 6 hours",
        conditionSql: `SELECT 
  table_catalog,
  table_schema,
  table_name,
  COUNT(*) as total_rows,
  COUNT(*) - COUNT(primary_key_column) as null_primary_keys,
  (COUNT(*) - COUNT(primary_key_column)) / COUNT(*) * 100 as null_percentage
FROM information_schema.tables t
JOIN production_db.public.critical_tables ct ON ct.table_name = t.table_name
WHERE table_schema = 'PUBLIC'
  AND table_catalog = 'PRODUCTION_DB'
GROUP BY table_catalog, table_schema, table_name
HAVING null_percentage > 5.0
ORDER BY null_percentage DESC;`,
        actionSql: `-- Log data quality issue
INSERT INTO alerts.data_quality_issues (
  table_name,
  issue_type,
  null_percentage,
  total_rows,
  detected_at,
  severity
) VALUES (
  '{{ table_schema }}.{{ table_name }}',
  'HIGH_NULL_PERCENTAGE',
  {{ null_percentage }},
  {{ total_rows }},
  CURRENT_TIMESTAMP(),
  'MEDIUM'
);`,
        description: "Suspended data quality checker that monitors for high NULL percentages in critical tables",
        channels: ["Email: Data Quality Team", "In-App: Data Analysts"]
      },
      
      "ALERT_004": {
        name: "SECURITY_ACCESS_MONITOR",
        type: "Security Alert",
        category: "Security & IAM",
        severity: 1,
        status: "Active",
        created: "1 week ago",
        completed: "Running",
        owner: "ACCOUNTADMIN",
        schedule: "Every 30 minutes",
        conditionSql: `SELECT 
  user_name,
  client_ip,
  reported_client_type,
  login_name,
  event_timestamp,
  COUNT(*) as failed_attempts
FROM snowflake.account_usage.login_history
WHERE success = 'NO'
  AND event_timestamp >= DATEADD('minute', -30, CURRENT_TIMESTAMP())
  AND user_name NOT LIKE 'SERVICE_%'
GROUP BY user_name, client_ip, reported_client_type, login_name, event_timestamp
HAVING failed_attempts >= 3
ORDER BY event_timestamp DESC;`,
        actionSql: `-- Log security incident
INSERT INTO alerts.security_incidents (
  user_name,
  client_ip,
  failed_attempts,
  incident_time,
  risk_level,
  alert_sent_at
) VALUES (
  '{{ user_name }}',
  '{{ client_ip }}',
  {{ failed_attempts }},
  '{{ event_timestamp }}',
  'HIGH',
  CURRENT_TIMESTAMP()
);

-- Send immediate security alert
CALL system$send_email(
  'security@company.com',
  'SECURITY ALERT: Multiple Failed Login Attempts',
  'User {{ user_name }} from IP {{ client_ip }} has {{ failed_attempts }} failed login attempts in the last 30 minutes.'
);`,
        description: "Active security monitoring for suspicious login patterns and failed authentication attempts",
        channels: ["Email: Security Team", "In-App: SECURITYADMIN", "PagerDuty: Security On-Call"]
      },
      
      "ALERT_005": {
        name: "SNOWPARK_JOB_WATCHER",
        type: "Job Timeout",
        category: "Snowpark",
        severity: 2,
        status: "Active",
        created: "2 weeks ago",
        completed: "Running",
        owner: "ACCOUNTADMIN",
        schedule: "Every 2 hours",
        conditionSql: `SELECT 
  job_name,
  job_uuid,
  start_time,
  end_time,
  status,
  DATEDIFF('minute', start_time, COALESCE(end_time, CURRENT_TIMESTAMP())) as duration_minutes
FROM snowflake.account_usage.task_history
WHERE start_time >= DATEADD('hour', -2, CURRENT_TIMESTAMP())
  AND job_name LIKE 'SNOWPARK_%'
  AND (
    status = 'FAILED' 
    OR (status = 'RUNNING' AND duration_minutes > 120)
  )
ORDER BY start_time DESC;`,
        actionSql: `-- Log Snowpark job issue
INSERT INTO alerts.snowpark_job_issues (
  job_name,
  job_uuid,
  issue_type,
  duration_minutes,
  status,
  detected_at
) VALUES (
  '{{ job_name }}',
  '{{ job_uuid }}',
  CASE WHEN '{{ status }}' = 'FAILED' THEN 'FAILURE' ELSE 'TIMEOUT' END,
  {{ duration_minutes }},
  '{{ status }}',
  CURRENT_TIMESTAMP()
);

-- Notify development team
CALL system$send_slack_message(
  '#snowpark-alerts',
  'Snowpark Job Alert: {{ job_name }} - {{ CASE WHEN status = "FAILED" THEN "Failed" ELSE "Running for " || duration_minutes || " minutes" END }}'
);`,
        description: "Monitors Snowpark job execution for failures and timeouts every 2 hours",
        channels: ["Email: Development Team", "Slack: #snowpark-alerts", "In-App: Data Engineers"]
      }
    }
    
    return alertsData[id] || alertsData["ALT-5314"]
  }

  const alertData = getAlertData(resolvedParams.id)

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1: return "bg-red-100 text-red-800"
      case 2: return "bg-orange-100 text-orange-800"
      case 3: return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "triggered":
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "investigating":
        return <AlertTriangle className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/alerts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Alert Execution Details</h1>
              <p className="text-sm text-gray-600">Alert ID: {resolvedParams.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Alert Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{alertData.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">{alertData.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alertData.status)}
                    <Badge className={getSeverityColor(alertData.severity)}>
                      Severity {alertData.severity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-medium">{alertData.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-medium">{alertData.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <Badge className="bg-green-100 text-green-800">{alertData.status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Owner</div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{alertData.owner}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Created</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{alertData.created}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{alertData.completed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condition SQL */}
            <Card>
              <CardHeader>
                <CardTitle>Condition</CardTitle>
                <CardDescription>SQL query that defines when this alert should trigger</CardDescription>
              </CardHeader>
              <CardContent>
                <SQLCodeBlock sql={alertData.conditionSql} />
              </CardContent>
            </Card>

            {/* Action SQL */}
            <Card>
              <CardHeader>
                <CardTitle>Action</CardTitle>
                <CardDescription>SQL commands executed when the alert condition is met</CardDescription>
              </CardHeader>
              <CardContent>
                <SQLCodeBlock sql={alertData.actionSql} />
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configured channels for alert notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertData.channels.map((channel: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{channel}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Link href="/alerts">
                <Button variant="outline">
                  ← Back to Alerts
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link href={`/alert-editor?template=${encodeURIComponent(alertData.conditionSql)}&name=${encodeURIComponent(alertData.name)}`}>
                  <Button variant="outline">
                    Edit Alert
                  </Button>
                </Link>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Test Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
