export type UserRole = 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  plannedDuration: number; // in minutes
  actualDuration: number; // in minutes
  completed: boolean;
  date: string; // YYYY-MM-DD
  evidence?: string; // URL or base64 string
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface StudySummary {
  totalTasks: number;
  completedTasks: number;
  totalPlannedTime: number;
  totalActualTime: number;
  completionRate: number;
}