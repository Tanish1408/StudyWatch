import { StudyTask, StudySummary } from '../types';

export const calculateStudySummary = (tasks: StudyTask[]): StudySummary => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalPlannedTime = tasks.reduce((sum, task) => sum + task.plannedDuration, 0);
  const totalActualTime = tasks.reduce((sum, task) => sum + task.actualDuration, 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    totalPlannedTime,
    totalActualTime,
    completionRate,
  };
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const getWeekDates = (date: Date = new Date()): string[] => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const monday = new Date(date.setDate(diff));
  
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    weekDates.push(formatDateToYYYYMMDD(currentDate));
  }
  
  return weekDates;
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getToday = (): string => {
  return formatDateToYYYYMMDD(new Date());
};

export const getPastDays = (days: number): string[] => {
  const result: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push(formatDateToYYYYMMDD(date));
  }
  
  return result;
};