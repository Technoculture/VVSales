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

export interface Task {
  id: string;
  name: string;
  contactNumber: string;
  trials: number;
  city: string;
  state: string;
}

export interface CallLogItem {
  phoneNumber: string;
  callDuration: string;
}
