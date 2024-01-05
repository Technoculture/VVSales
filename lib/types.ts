export interface tasks {
  id: number;
  name: string;
  contactNumber: string;
  city: string;
  state: string;
  targetCallCount: number;
  createdAt: number;
  modifiedAt: number;
}

export interface callLogs {
  id: number;
  taskId: number;
  callTime: number;
  callStatus: string;
  createdAt: number;
  duration: number;
}
