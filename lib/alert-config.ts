export interface AlertTemplate {
  id: string
  name: string
  description: string
  sqlTemplate: string
  enabled: boolean
  customConfig?: any
}

export interface AlertCategory {
  id: string
  name: string
  description: string
  icon: string
  templates: AlertTemplate[]
  preview?: boolean
}

// Centralized alert configuration
export const alertCategories: AlertCategory[] = [
  {
    id: "cost-management",
    name: "Cost Management",
    description: "Monitor spending and resource usage to optimize costs",
    icon: "cost-management",
    templates: [
      {
        id: "resource-monitor-notification",
        name: "Resource Monitor Notifications",
        description: "Receive email notifications from resource monitors",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "cost-spike",
        name: "Anomalies",
        description: "Get alerted when costs exceed predefined thresholds",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "budget-threshold-alerts",
        name: "Budget Threshold Alerts",
        description: "Monitor spending against custom budget thresholds",
        sqlTemplate: "",
        enabled: false,
        customConfig: {
          budgetThresholds: {
            "Production": "10000",
            "Development": "5000",
            "Testing": "2000"
          }
        }
      }
    ]
  },
  {
    id: "data-quality",
    name: "Data Quality",
    description: "Ensure data integrity with automated quality checks and alerts",
    icon: "data-quality",
    templates: [
      {
        id: "null-value-check",
        name: "NULL Value Detection",
        description: "Alert when NULL values exceed threshold in critical tables",
        sqlTemplate: "",
        enabled: false,
        customConfig: {
          nullThreshold: "5"
        }
      },
      {
        id: "duplicate-records",
        name: "Duplicate Record Detection",
        description: "Identify and alert on duplicate records in production tables",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "schema-drift",
        name: "Schema Drift Monitoring",
        description: "Monitor for unexpected schema changes in critical tables",
        sqlTemplate: "",
        enabled: false
      }
    ]
  },
  {
    id: "snowpipe",
    name: "Snowpipe",
    description: "Monitor your Snowpipe ingestion pipelines for errors and performance issues",
    icon: "snowpipe",
    preview: true,
    templates: [
      {
        id: "pipe-failure",
        name: "Pipe Failure Detection",
        description: "Alert when Snowpipe operations fail or encounter errors",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "ingestion-lag",
        name: "Ingestion Lag Monitoring",
        description: "Monitor for delays in data ingestion pipelines",
        sqlTemplate: "",
        enabled: false
      }
    ]
  },
  {
    id: "snowpark",
    name: "Snowpark",
    description: "Monitor Snowpark applications and jobs for performance and reliability",
    icon: "snowpark",
    templates: [
      {
        id: "job-failure",
        name: "Job Failure Detection",
        description: "Alert when Snowpark jobs fail or timeout",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "performance-degradation",
        name: "Performance Monitoring",
        description: "Monitor job performance and alert on degradation",
        sqlTemplate: "",
        enabled: false
      }
    ]
  },
  {
    id: "security-iam",
    name: "Security & IAM",
    description: "Monitor access patterns and security events to protect your data",
    icon: "security-iam",
    templates: [
      {
        id: "failed-login",
        name: "Failed Login Attempts",
        description: "Alert on suspicious login patterns and failed authentication",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "privilege-escalation",
        name: "Privilege Escalation Detection",
        description: "Monitor for unauthorized privilege changes",
        sqlTemplate: "",
        enabled: false
      }
    ]
  },
  {
    id: "openflow",
    name: "OpenFlow",
    description: "Monitor OpenFlow network operations and performance metrics",
    icon: "openflow",
    templates: [
      {
        id: "network-anomaly",
        name: "Network Anomaly Detection",
        description: "Alert on unusual network traffic patterns",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "connection-failure",
        name: "Connection Failure Monitoring",
        description: "Monitor for network connection failures",
        sqlTemplate: "",
        enabled: false
      }
    ]
  },
  {
    id: "trust-center",
    name: "Trust Center",
    description: "Monitor compliance and governance metrics for your organization",
    icon: "trust-center",
    templates: [
      {
        id: "compliance-violation",
        name: "Compliance Violation Detection",
        description: "Alert on potential compliance policy violations",
        sqlTemplate: "",
        enabled: false
      },
      {
        id: "audit-trail",
        name: "Audit Trail Monitoring",
        description: "Monitor critical audit events and access patterns",
        sqlTemplate: "",
        enabled: false
      }
    ]
  }
]

// Default notification settings
export const defaultRoles = [
  "ACCOUNTADMIN",
  "SECURITYADMIN", 
  "COSTADMIN",
  "ANALYST",
  "PBUGGANA_ALERTS_PRODUCT_ADMIN",
  "AAD_PROVISIONER",
  "AAD_PROVISIONER_SURAJ"
]

export const defaultUserOptions = [
  "ASILVER","BDAVIS","CBROWN","DWHITE","EJONES","FGREEN","GHARRIS","HCLARK","IJACKSON","JWILLIAMS",
  "KADAMS","LLUCAS","MMILLER","NBAKER","OJOHNSON","PLEE","QROBERTS","RTHOMAS","SWILSON","TTAYLOR",
]

export const defaultExternalDestinations = [
  "Webhook Destination 1", 
  "Webhook Destination 2",
  "Google Pubsub Service 1",
  "PagerDuty 1",
  "Slack Webhook",
  "Microsoft Teams"
]
