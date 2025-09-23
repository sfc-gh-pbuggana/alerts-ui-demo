// Global SQL template store for alert templates

export interface SQLTemplate {
  id: string
  name: string
  sql: string
  category: string
}

export const SQL_TEMPLATES: Record<string, SQLTemplate> = {
  // Snowpipe Templates (based on Snowflake documentation)
  "snowpipe-error": {
    id: "snowpipe-error",
    name: "Snowpipe Error Detection",
    category: "snowpipe",
    sql: `-- Monitor Snowpipe errors and queue reading issues
-- Based on recommended_alert_pipes_error template
SELECT 
  pipe_name,
  error_message,
  last_error_time,
  files_queued,
  COUNT(*) AS error_count
FROM (
  SELECT * FROM TABLE(SYSTEM$PIPE_STATUS())
  WHERE error_message IS NOT NULL
    AND last_error_time >= current_timestamp() - INTERVAL '10 MINUTES'
)
GROUP BY pipe_name, error_message, last_error_time, files_queued
HAVING error_count > 0
ORDER BY last_error_time DESC`
  },
  
  "snowpipe-latency": {
    id: "snowpipe-latency",
    name: "Snowpipe Latency Alert",
    category: "snowpipe", 
    sql: `-- Alert on pipes with high latency (30+ minutes)
-- Based on recommended_alert_pipes_latency template
SELECT
  pipe_name,
  earliest_file_timestamp,
  DATEDIFF('minute', earliest_file_timestamp, current_timestamp()) AS latency_minutes,
  files_queued,
  last_load_time
FROM (
  SELECT * FROM TABLE(SYSTEM$PIPE_STATUS())
  WHERE earliest_file_timestamp IS NOT NULL
    AND DATEDIFF('minute', earliest_file_timestamp, current_timestamp()) >= 30
)
ORDER BY latency_minutes DESC`
  },

  // Snowpark Templates (based on Snowflake documentation)
  "snowpark-error-logs": {
    id: "snowpark-error-logs",
    name: "Snowpark Error Logs",
    category: "snowpark",
    sql: `-- Monitor ERROR and FATAL level messages from UDFs and stored procedures
-- Based on recommended_alert_functions_error_logs template
SELECT
  resource_attributes['snow.executable.name'] AS function_name,
  resource_attributes['snow.executable.type'] AS executable_type,
  severity_text,
  body AS error_message,
  timestamp,
  COUNT(*) AS error_count
FROM snowflake.account_usage.event_table
WHERE severity_text IN ('ERROR', 'FATAL')
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
  AND resource_attributes['snow.executable.type'] IN ('FUNCTION', 'PROCEDURE')
GROUP BY function_name, executable_type, severity_text, body, timestamp
HAVING error_count > 0
ORDER BY timestamp DESC`
  },

  "snowpark-high-cpu": {
    id: "snowpark-high-cpu",
    name: "High CPU Utilization",
    category: "snowpark",
    sql: `-- Alert on UDFs and stored procedures with high CPU utilization
-- Based on recommended_alert_functions_high_cpu_utilization template
SELECT
  resource_attributes['snow.executable.name'] AS function_name,
  resource_attributes['snow.executable.type'] AS executable_type,
  attributes['cpu.utilization.percent'] AS cpu_utilization_percent,
  timestamp,
  COUNT(*) AS high_cpu_events
FROM snowflake.account_usage.event_table
WHERE attributes['cpu.utilization.percent']::NUMBER > 80
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
  AND resource_attributes['snow.executable.type'] IN ('FUNCTION', 'PROCEDURE')
GROUP BY function_name, executable_type, cpu_utilization_percent, timestamp
ORDER BY cpu_utilization_percent DESC`
  },

  "snowpark-high-memory": {
    id: "snowpark-high-memory",
    name: "High Memory Utilization",
    category: "snowpark",
    sql: `-- Alert on UDFs and stored procedures with high memory utilization
-- Based on recommended_alert_functions_high_memory_utilization template
SELECT
  resource_attributes['snow.executable.name'] AS function_name,
  resource_attributes['snow.executable.type'] AS executable_type,
  attributes['memory.utilization.percent'] AS memory_utilization_percent,
  timestamp,
  COUNT(*) AS high_memory_events
FROM snowflake.account_usage.event_table
WHERE attributes['memory.utilization.percent']::NUMBER > 85
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
  AND resource_attributes['snow.executable.type'] IN ('FUNCTION', 'PROCEDURE')
GROUP BY function_name, executable_type, memory_utilization_percent, timestamp
ORDER BY memory_utilization_percent DESC`
  },

  "snowpark-long-running": {
    id: "snowpark-long-running",
    name: "Long-Running Functions",
    category: "snowpark",
    sql: `-- Alert on UDFs and stored procedures taking longer than 2 minutes
-- Based on recommended_alert_functions_long_running_functions template
SELECT
  resource_attributes['snow.executable.name'] AS function_name,
  resource_attributes['snow.executable.type'] AS executable_type,
  attributes['duration.ms']::NUMBER / 1000 / 60 AS duration_minutes,
  timestamp,
  COUNT(*) AS long_running_count
FROM snowflake.account_usage.event_table
WHERE attributes['duration.ms']::NUMBER > 120000  -- 2 minutes in milliseconds
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
  AND resource_attributes['snow.executable.type'] IN ('FUNCTION', 'PROCEDURE')
GROUP BY function_name, executable_type, duration_minutes, timestamp
ORDER BY duration_minutes DESC`
  },

  // OpenFlow Templates (P0 and P1 alerts)
  "connector-backpressure": {
    id: "connector-backpressure",
    name: "Connector Backpressure",
    category: "openflow",
    sql: `-- P0: Monitor connector backpressure for sustained periods
SELECT
  connector_name,
  component_name,
  backpressure_duration_minutes,
  current_queue_size,
  max_queue_size,
  timestamp
FROM openflow.connector_metrics
WHERE backpressure_duration_minutes >= 60  -- 1 hour sustained backpressure
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
ORDER BY backpressure_duration_minutes DESC`
  },

  "no-data-ingested": {
    id: "no-data-ingested",
    name: "No Data Ingested",
    category: "openflow",
    sql: `-- P0: Alert when connector hasn't written data for 4+ hours
SELECT
  connector_name,
  last_write_timestamp,
  DATEDIFF('hour', last_write_timestamp, current_timestamp()) AS hours_since_last_write,
  total_records_processed
FROM openflow.connector_status
WHERE DATEDIFF('hour', last_write_timestamp, current_timestamp()) >= 4
  AND connector_status = 'RUNNING'
ORDER BY hours_since_last_write DESC`
  },

  "large-data-queued": {
    id: "large-data-queued",
    name: "Large Amount of Data Queued",
    category: "openflow",
    sql: `-- P0: Alert when connection has excessive queued data
SELECT
  connector_name,
  connection_name,
  queued_data_mb,
  queue_threshold_mb,
  (queued_data_mb / queue_threshold_mb * 100) AS queue_utilization_percent,
  timestamp
FROM openflow.connection_metrics
WHERE queued_data_mb > queue_threshold_mb
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
ORDER BY queue_utilization_percent DESC`
  },

  "high-error-rate": {
    id: "high-error-rate",
    name: "High Error Rate",
    category: "openflow",
    sql: `-- P0: Alert when connector components have high error rates
SELECT
  connector_name,
  component_name,
  component_type,
  error_rate_percent,
  error_threshold_percent,
  total_errors,
  timestamp
FROM openflow.component_health
WHERE error_rate_percent > error_threshold_percent
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
  AND component_type IN ('PROCESSOR', 'CONTROLLER_SERVICE')
ORDER BY error_rate_percent DESC`
  },

  "high-cpu-runtime": {
    id: "high-cpu-runtime",
    name: "High CPU Utilization (Runtime)",
    category: "openflow",
    sql: `-- P1: Alert when runtime CPU exceeds 90% for sustained period
SELECT
  runtime_name,
  cpu_utilization_percent,
  sustained_duration_minutes,
  timestamp,
  available_cores,
  used_cores
FROM openflow.runtime_metrics
WHERE cpu_utilization_percent > 90
  AND sustained_duration_minutes >= 15  -- 15 minutes sustained
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
ORDER BY cpu_utilization_percent DESC`
  },

  "runtime-autoscaling": {
    id: "runtime-autoscaling",
    name: "Runtime Autoscaling Event",
    category: "openflow",
    sql: `-- P0: Informational alert for autoscaling events
SELECT
  runtime_name,
  autoscaling_event_type,
  previous_capacity,
  new_capacity,
  trigger_reason,
  timestamp,
  cost_impact_estimate
FROM openflow.autoscaling_events
WHERE timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
ORDER BY timestamp DESC`
  },

  "low-disk-space": {
    id: "low-disk-space",
    name: "Low Disk Space",
    category: "openflow",
    sql: `-- P1: Alert when NiFi volumes reach 80% capacity
SELECT
  runtime_name,
  volume_name,
  volume_type,
  used_space_gb,
  total_space_gb,
  (used_space_gb / total_space_gb * 100) AS disk_utilization_percent,
  timestamp
FROM openflow.volume_metrics
WHERE (used_space_gb / total_space_gb * 100) >= 80
  AND volume_type IN ('MAIN_NIFI', 'CONTENT_REPO', 'FLOWFILE_REPO')
  AND timestamp >= current_timestamp() - INTERVAL '10 MINUTES'
ORDER BY disk_utilization_percent DESC`
  },

  // Data Quality Templates
  "data-freshness": {
    id: "data-freshness",
    name: "Data Freshness",
    category: "data-quality",
    sql: `-- Monitor data freshness across critical tables
SELECT
  table_schema,
  table_name,
  last_altered,
  DATEDIFF('hour', last_altered, current_timestamp()) AS hours_since_update,
  row_count
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND DATEDIFF('hour', last_altered, current_timestamp()) > 24
  AND table_schema IN ('PRODUCTION', 'ANALYTICS', 'CORE')
ORDER BY hours_since_update DESC`
  },

  "schema-drift": {
    id: "schema-drift",
    name: "Schema Drift Detection",
    category: "data-quality", 
    sql: `-- Detect unexpected schema changes
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  last_altered
FROM information_schema.columns
WHERE last_altered >= current_timestamp() - INTERVAL '24 HOURS'
  AND table_schema = 'PRODUCTION'
ORDER BY last_altered DESC`
  },

  "null-coverage-threshold": {
    id: "null-coverage-threshold",
    name: "NULL Coverage Threshold",
    category: "data-quality",
    sql: `-- Monitor NULL coverage exceeding threshold
SELECT
  table_schema,
  table_name,
  column_name,
  (null_count::FLOAT / total_count::FLOAT * 100) AS null_percentage,
  null_count,
  total_count,
  current_timestamp() AS check_time
FROM (
  SELECT
    table_schema,
    table_name,
    column_name,
    SUM(CASE WHEN column_value IS NULL THEN 1 ELSE 0 END) AS null_count,
    COUNT(*) AS total_count
  FROM information_schema.table_storage_metrics
  WHERE table_schema IN ('PRODUCTION', 'ANALYTICS')
  GROUP BY table_schema, table_name, column_name
)
WHERE (null_count::FLOAT / total_count::FLOAT * 100) > {{NULL_THRESHOLD}}
ORDER BY null_percentage DESC`
  },

  "data-anomaly-detection": {
    id: "data-anomaly-detection",
    name: "Data Anomaly Detection",
    category: "data-quality",
    sql: `-- Detect data anomalies using statistical analysis
SELECT
  table_schema,
  table_name,
  metric_name,
  current_value,
  avg_value_7_days,
  stddev_value_7_days,
  (current_value - avg_value_7_days) / NULLIF(stddev_value_7_days, 0) AS z_score,
  CASE 
    WHEN ABS((current_value - avg_value_7_days) / NULLIF(stddev_value_7_days, 0)) > 2 THEN 'ANOMALY'
    ELSE 'NORMAL'
  END AS anomaly_status,
  current_timestamp() AS detection_time
FROM (
  SELECT
    table_schema,
    table_name,
    'row_count' AS metric_name,
    row_count AS current_value,
    AVG(row_count) OVER (
      PARTITION BY table_schema, table_name 
      ORDER BY last_altered 
      ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
    ) AS avg_value_7_days,
    STDDEV(row_count) OVER (
      PARTITION BY table_schema, table_name 
      ORDER BY last_altered 
      ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
    ) AS stddev_value_7_days
  FROM information_schema.tables
  WHERE table_type = 'BASE TABLE'
    AND table_schema IN ('PRODUCTION', 'ANALYTICS')
    AND last_altered >= current_date() - 1
)
WHERE ABS((current_value - avg_value_7_days) / NULLIF(stddev_value_7_days, 0)) > 2
ORDER BY ABS(z_score) DESC`
  },

  // Cost Management Templates
  "resource-monitor-notification": {
    id: "resource-monitor-notification",
    name: "Resource Monitor Notifications",
    category: "cost-management",
    sql: `-- Monitor resource usage and credit consumption
SELECT
  warehouse_name,
  resource_monitor_name,
  credits_used,
  credits_quota,
  (credits_used / credits_quota * 100) AS quota_utilization_percent,
  notification_level,
  start_time,
  end_time
FROM account_usage.resource_monitor_usage
WHERE start_time >= current_timestamp() - INTERVAL '1 HOUR'
  AND (credits_used / credits_quota * 100) >= 80  -- Alert at 80% quota usage
ORDER BY quota_utilization_percent DESC`
  },

  "cost-spike": {
    id: "cost-spike",
    name: "Cost Spike Detection",
    category: "cost-management",
    sql: `-- Monitor unexpected cost increases
SELECT
  warehouse_name,
  DATE(start_time) AS usage_date,
  SUM(credits_used) AS daily_credits,
  AVG(SUM(credits_used)) OVER (
    PARTITION BY warehouse_name 
    ORDER BY DATE(start_time) 
    ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
  ) AS avg_credits_last_7_days,
  (SUM(credits_used) / NULLIF(AVG(SUM(credits_used)) OVER (
    PARTITION BY warehouse_name 
    ORDER BY DATE(start_time) 
    ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
  ), 0)) AS cost_spike_ratio
FROM account_usage.warehouse_metering_history
WHERE start_time >= current_date() - 1
GROUP BY warehouse_name, DATE(start_time)
HAVING cost_spike_ratio > 2.0
ORDER BY cost_spike_ratio DESC`
  },

  "budget-threshold-alerts": {
    id: "budget-threshold-alerts",
    name: "Budget Threshold Alerts",
    category: "cost-management",
    sql: `-- Monitor spending against custom budget thresholds
SELECT
  budget_category,
  current_spend,
  budget_threshold,
  (current_spend / budget_threshold * 100) AS budget_utilization_percent,
  CASE
    WHEN current_spend >= budget_threshold THEN 'EXCEEDED'
    WHEN current_spend >= budget_threshold * 0.9 THEN 'WARNING'
    WHEN current_spend >= budget_threshold * 0.8 THEN 'CAUTION'
    ELSE 'NORMAL'
  END AS threshold_status,
  period_start,
  period_end
FROM (
  SELECT
    CASE
      WHEN warehouse_name LIKE '%PROD%' THEN 'Production'
      WHEN warehouse_name LIKE '%DEV%' THEN 'Development'
      WHEN warehouse_name LIKE '%TEST%' THEN 'Testing'
      ELSE 'Other'
    END AS budget_category,
    SUM(credits_used * 3.00) AS current_spend,  -- Assuming $3 per credit
    {{BUDGET_THRESHOLDS}} AS budget_threshold,
    DATE_TRUNC('month', start_time) AS period_start,
    LAST_DAY(DATE_TRUNC('month', start_time)) AS period_end
  FROM account_usage.warehouse_metering_history
  WHERE start_time >= DATE_TRUNC('month', current_date())
  GROUP BY budget_category, period_start, period_end
)
WHERE current_spend >= budget_threshold * 0.8  -- Alert at 80% of budget
ORDER BY budget_utilization_percent DESC`
  },

  // Trust Center Templates
  "mfa-notification": {
    id: "mfa-notification",
    name: "MFA Notification",
    category: "trust-center",
    sql: `-- Monitor MFA health and status updates
SELECT
  user_name,
  mfa_status,
  mfa_method,
  last_mfa_event,
  account_name,
  client_ip,
  event_timestamp
FROM account_usage.login_history
WHERE event_timestamp >= current_timestamp() - INTERVAL '1 HOUR'
  AND (mfa_status = 'FAILED' OR mfa_status = 'DISABLED')
ORDER BY event_timestamp DESC`
  },

  "weekly-digest": {
    id: "weekly-digest",
    name: "Weekly Digest",
    category: "trust-center",
    sql: `-- Weekly summary of security updates and events
SELECT
  DATE_TRUNC('week', event_timestamp) AS week_start,
  COUNT(DISTINCT user_name) AS unique_users,
  COUNT(*) AS total_security_events,
  SUM(CASE WHEN event_type LIKE '%LOGIN%' THEN 1 ELSE 0 END) AS login_events,
  SUM(CASE WHEN event_type LIKE '%GRANT%' THEN 1 ELSE 0 END) AS permission_changes,
  SUM(CASE WHEN success_flag = 'N' THEN 1 ELSE 0 END) AS failed_events
FROM account_usage.access_history
WHERE event_timestamp >= current_timestamp() - INTERVAL '7 DAYS'
  AND event_type IN ('LOGIN', 'LOGOUT', 'GRANT_ROLE', 'REVOKE_ROLE', 'CREATE_USER', 'DROP_USER')
GROUP BY DATE_TRUNC('week', event_timestamp)
ORDER BY week_start DESC`
  },

  // Security & IAM Templates
  "unauthorized-access": {
    id: "unauthorized-access",
    name: "Unauthorized Access Attempts",
    category: "security-iam",
    sql: `-- Detect suspicious login attempts and access patterns
SELECT
  user_name,
  client_ip,
  reported_client_type,
  COUNT(*) AS failed_attempts,
  MIN(event_timestamp) AS first_attempt,
  MAX(event_timestamp) AS last_attempt
FROM account_usage.login_history
WHERE event_timestamp >= current_timestamp() - INTERVAL '1 HOUR'
  AND is_success = 'NO'
GROUP BY user_name, client_ip, reported_client_type
HAVING failed_attempts >= 3
ORDER BY failed_attempts DESC, last_attempt DESC`
  },

  "privilege-escalation": {
    id: "privilege-escalation", 
    name: "Privilege Escalation",
    category: "security-iam",
    sql: `-- Monitor changes to user permissions and roles
SELECT
  grantee_name,
  role_name,
  privilege,
  granted_on,
  granted_by,
  created_on,
  deleted_on
FROM account_usage.grants_to_users
WHERE created_on >= current_timestamp() - INTERVAL '24 HOURS'
  AND role_name IN ('ACCOUNTADMIN', 'SECURITYADMIN', 'SYSADMIN')
  AND deleted_on IS NULL
ORDER BY created_on DESC`
  }
}

// Helper function to get SQL template by ID
export function getSQLTemplate(templateId: string): SQLTemplate | null {
  return SQL_TEMPLATES[templateId] || null
}

// Helper function to get all templates for a category
export function getTemplatesByCategory(category: string): SQLTemplate[] {
  return Object.values(SQL_TEMPLATES).filter(template => template.category === category)
}
