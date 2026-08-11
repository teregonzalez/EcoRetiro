import axios from 'axios';

export interface AdminMetrics {
  totalUsers: number;
  pendingRequests: number;
  totalWasteTon: number;
}

export interface AdminUserRow {
  id: number;
  empresa: string;
  rol: string;
  estado: string;
  registro: string;
}

export interface AdminWasteTrend {
  type: string;
  total: number;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  users: AdminUserRow[];
  wasteTrend: AdminWasteTrend[];
}

export interface PymeProfile {
  empresa: string;
  contacto: string;
  telefono: string;
  ubicacion: string;
}

export interface PymeMetrics {
  totalWeight: number;
  totalEntries: number;
  co2Saved: number;
}

export interface PymeHistoryRow {
  id: number;
  fecha: string | null;
  tipo: string;
  cantidad: number;
  unidad: string;
  estado: string;
}

export interface PymeDashboardData {
  profile: PymeProfile | null;
  metrics: PymeMetrics;
  history: PymeHistoryRow[];
}

export interface RecyclerMetrics {
  processedToday: number;
  activeCollections: number;
  capacityTotal: number;
  openAlerts: number;
}

export interface RecyclerNearbyWaste {
  material: string;
  total: number;
  unit: string;
}

export interface RecyclerCollectionRow {
  id: number;
  fecha: string;
  origen: string;
  material: string;
  cantidad: number;
  unidad: string;
  estado: string;
}

export interface RecyclerCapacityRow {
  material: string;
  percent: number;
}

export interface RecyclerDashboardData {
  metrics: RecyclerMetrics;
  nearbyWaste: RecyclerNearbyWaste[];
  collectionHistory: RecyclerCollectionRow[];
  capacity: RecyclerCapacityRow[];
}

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await axios.get('/api/dashboard/admin');
  return response.data;
};

export const fetchPymeDashboard = async (userId: number): Promise<PymeDashboardData> => {
  const response = await axios.get(`/api/dashboard/pyme/${userId}`);
  return response.data;
};

export const fetchRecyclerDashboard = async (userId: number): Promise<RecyclerDashboardData> => {
  const response = await axios.get(`/api/dashboard/reciclador/${userId}`);
  return response.data;
};
