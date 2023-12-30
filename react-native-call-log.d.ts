declare module "react-native-call-log" {
  interface CallLog {
    phoneNumber: string;
    callType: string;
    callDate: string;
    callDuration: string;
    timestamp: number;
  }

  interface CallLogsModule {
    getCallLogs(options: object, callback: (logs: CallLog[]) => void): void;
    load(limit: number): Promise<CallLog[]>;
    load(limit: number, filter: object): Promise<CallLog[]>;
    loadAll(): Promise<CallLog[]>;
  }

  const CallLogs: CallLogsModule;
  export default CallLogs;
}
