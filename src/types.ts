export enum GcpServiceType {
  COMPUTE_ENGINE = 'Compute Engine',
  CLOUD_RUN = 'Cloud Run',
  GKE = 'GKE',
  CLOUD_FUNCTIONS = 'Cloud Functions',
  APP_ENGINE = 'App Engine',
  CLOUD_STORAGE = 'Cloud Storage',
  CLOUD_SQL = 'Cloud SQL',
  SPANNER = 'Cloud Spanner',
  FIRESTORE = 'Firestore',
  BIGTABLE = 'Bigtable',
  BIGQUERY = 'BigQuery',
  PUBSUB = 'Pub/Sub',
  LOAD_BALANCER = 'Cloud Load Balancing',
  VPC = 'VPC Network',
  CLOUD_CDN = 'Cloud CDN',
  CLOUD_DNS = 'Cloud DNS',
  IAM = 'IAM',
  SECRET_MANAGER = 'Secret Manager',
  CLOUD_LOGGING = 'Cloud Logging',
  CLOUD_MONITORING = 'Cloud Monitoring',
  API_GATEWAY = 'API Gateway',
  EXTERNAL_USER = 'External User',
  INTERNET = 'Internet'
}

export interface Node {
  id: string;
  type: GcpServiceType;
  label: string;
  x: number;
  y: number;
  group?: string;
  ipAddress?: string;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface Group {
  id: string;
  label: string;
  type: 'region' | 'vpc' | 'zone' | 'project' | 'on-prem-dc';
  environment: 'cloud' | 'on-prem';
  cidr?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AlternativeSolution {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  estimatedCost: string;
  nodes: Node[];
  edges: Edge[];
  groups?: Group[];
}

export interface Architecture {
  nodes: Node[];
  edges: Edge[];
  groups?: Group[];
  explanation: string;
  alternatives: AlternativeSolution[];
}
