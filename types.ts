
export type TargetStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type ActivityStatus = 'ONGOING' | 'PENDING_SUMMARY' | 'COMPLETED';
export type ActivityType = 'MEETING' | 'INTERVIEW';

export interface Target {
  id: string;
  month: string;
  type: '培训会议' | '1v1面谈';
  goal: number;
  actual: number;
  status: TargetStatus;
  rejectionReason?: string;
  meName: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subType: string;
  title: string;
  time: string;
  participants?: string[];
  location?: string;
  speaker?: string;
  personName?: string; // for interview
  idCard?: string;
  themes: string[];
  status: ActivityStatus;
  summary?: string;
  createdAt: number;
}

export interface GlobalState {
  targets: Target[];
  activities: Activity[];
  selectedMonth: string;
}
