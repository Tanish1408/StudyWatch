import React, { createContext, useState, useContext, useEffect } from 'react';
import { StudyTask, StudySummary, Message } from '../types';
import { calculateStudySummary } from '../utils/studyUtils';

interface StudyContextType {
  tasks: StudyTask[];
  messages: Message[];
  addTask: (task: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<StudyTask>) => void;
  deleteTask: (taskId: string) => void;
  getTasksByDate: (date: string) => StudyTask[];
  getSummary: (startDate: string, endDate: string) => StudySummary;
  addMessage: (content: string, senderId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessageCount: (userId: string) => number;
}

const StudyContext = createContext<StudyContextType>({
  tasks: [],
  messages: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  getTasksByDate: () => [],
  getSummary: () => ({
    totalTasks: 0,
    completedTasks: 0,
    totalPlannedTime: 0,
    totalActualTime: 0,
    completionRate: 0,
  }),
  addMessage: () => {},
  markMessageAsRead: () => {},
  getUnreadMessageCount: () => 0,
});

export const useStudy = () => useContext(StudyContext);

const TASKS_STORAGE_KEY = 'studywatch_tasks';
const MESSAGES_STORAGE_KEY = 'studywatch_messages';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addTask = (taskData: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: StudyTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<StudyTask>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const getTasksByDate = (date: string) => {
    return tasks.filter((task) => task.date === date);
  };

  const getSummary = (startDate: string, endDate: string) => {
    const filteredTasks = tasks.filter(
      (task) => task.date >= startDate && task.date <= endDate
    );
    return calculateStudySummary(filteredTasks);
  };

  const addMessage = (content: string, senderId: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      content,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, read: true } : message
      )
    );
  };

  const getUnreadMessageCount = (userId: string) => {
    return messages.filter(
      (message) => message.senderId !== userId && !message.read
    ).length;
  };

  return (
    <StudyContext.Provider
      value={{
        tasks,
        messages,
        addTask,
        updateTask,
        deleteTask,
        getTasksByDate,
        getSummary,
        addMessage,
        markMessageAsRead,
        getUnreadMessageCount,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};