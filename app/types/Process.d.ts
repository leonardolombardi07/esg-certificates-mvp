export interface DatabaseProcess {
  id: string;
  status: ProcessStatus;
}

export interface ClientProcess {
  name: string;
  description: string;
  category: string;
  materials: Material[];
}

export interface Process extends DatabaseProcess, ClientProcess {}

export interface Material {
  name: string;
  amount: number;
  unit: MaterialUnit;
}

export type MaterialUnit = "kg" | "ton";
export type ProcessStatus = "pending" | "progress" | "certified" | "canceled";
