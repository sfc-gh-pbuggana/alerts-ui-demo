export const SEARCH_OPTIONS = [
  "Email",
  "Webhook Destination 1",
  "Webhook Destination 2",
  "Google Pubsub Service 1",
  "PagerDuty 1",
];

export const ROLES = [
  "PRODUCT_MANAGER",
  "ACCOUNT_USAGE_ROL",
  "ALERT_ADMIN",
  "BUSINESS_APPS_IMPORT_ROL",
  "CLASSIFICATION_TAGGING_ADMIN",
  "COUNT_DWASHARE_RL",
];

export const WAREHOUSES = [
  { name: "SNOWMDOC", size: "2X-Large" },
  { name: "ARCTIC_WH", size: "Large" },
  { name: "ATHENA_WH", size: "Medium" },
  { name: "DBX_WH", size: "Small" },
  { name: "ENG_CLOUD_METRICS_WH", size: "X-Large" },
];

export const DATABASES: Record<string, string[]> = {
  SNOWSCIENCE: [
    "ADMIN",
    "ALERT_VIEW_DEFINITIONS",
    "APP_ANALYTICS",
    "BUSINESS_VERTICAL",
    "CATALOG_POC",
    "COMMON",
    "CONNECTED_APPS",
  ],
  SAMPLE_DB: ["PUBLIC", "ANALYTICS", "INGEST"],
  SALES_DB: ["PUBLIC", "REPORTING"],
};
