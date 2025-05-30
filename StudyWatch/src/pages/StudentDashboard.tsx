import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/student/TaskCard';
import TaskForm from '../components/student/TaskForm';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { StudyTask } from '../types';
import { BookOpen, Plus, Calendar, MessageSquare, Clock } from 'lucide-react';
import { getToday, formatDateToYYYYMMDD, formatDateForDisplay } from '../utils/studyUtils';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    getTasksByDate,
    getSummary, 
    getUnreadMessageCount 
  } = useStudy();
  
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const dailyTasks = getTasksByDate(selectedDate);
  const editingTask = editingTaskId ? tasks.find(task => task.id === editingTaskId) : undefined;
  
  // Calculate daily statistics
  const dailySummary = getSummary(selectedDate, selectedDate);
  const weekSummary = getSummary(
    formatDateToYYYYMMDD(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    getToday()
  );
  
  const unreadMessages = getUnreadMessageCount(currentUser?.id || '');
  
  const handleAddTask = (taskData: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setShowAddTask(false);
  };
  
  const handleUpdateTask = (taskData: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTaskId) {
      updateTask(editingTaskId, taskData);
      setEditingTaskId(null);
    }
  };
  
  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setShowAddTask(false);
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };
  
  const handleCompleteTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };
  
  const handleTimeUpdate = (taskId: string, minutes: number) => {
    updateTask(taskId, { actualDuration: minutes });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Track and manage your study tasks
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Calendar size={20} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">
                {formatDateForDisplay(selectedDate)}
              </h2>
            </div>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              
              <Button 
                variant="primary" 
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => {
                  setShowAddTask(true);
                  setEditingTaskId(null);
                }}
              >
                Add Task
              </Button>
            </div>
          </div>
          
          {/* Task Form */}
          {(showAddTask || editingTaskId) && (
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {editingTaskId ? 'Edit Task' : 'Add New Task'}
                </h3>
              </CardHeader>
              <CardContent>
                <TaskForm 
                  onSubmit={editingTaskId ? handleUpdateTask : handleAddTask}
                  initialValues={editingTask || { date: selectedDate }}
                  onCancel={() => {
                    setShowAddTask(false);
                    setEditingTaskId(null);
                  }}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Task List */}
          <div>
            {dailyTasks.length > 0 ? (
              dailyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={handleCompleteTask}
                  onTimeUpdate={handleTimeUpdate}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No tasks for this day</h3>
                <p className="text-gray-600 mb-4">Add a new study task to get started</p>
                <Button 
                  variant="primary"
                  onClick={() => setShowAddTask(true)}
                  icon={<Plus size={16} />}
                >
                  Add Your First Task
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Today's Progress */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Today's Progress</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-medium">
                      {dailySummary.completedTasks}/{dailySummary.totalTasks}
                    </span>
                  </div>
                  <ProgressBar 
                    value={dailySummary.completedTasks} 
                    max={dailySummary.totalTasks || 1}
                    color="primary"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Study Time</span>
                    <span className="font-medium">
                      {Math.round(dailySummary.totalActualTime)} / {dailySummary.totalPlannedTime} mins
                    </span>
                  </div>
                  <ProgressBar 
                    value={dailySummary.totalActualTime} 
                    max={dailySummary.totalPlannedTime || 60}
                    color="success"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Stats */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Weekly Overview</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-600" />
                    <span className="text-gray-700">Tasks Completed</span>
                  </div>
                  <span className="font-semibold">
                    {weekSummary.completedTasks}/{weekSummary.totalTasks}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-600" />
                    <span className="text-gray-700">Total Study Time</span>
                  </div>
                  <span className="font-semibold">
                    {Math.round(weekSummary.totalActualTime)} mins
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-purple-600" />
                    <span className="text-gray-700">Unread Messages</span>
                  </div>
                  <span className="font-semibold">
                    {unreadMessages}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Links</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="secondary" 
                  fullWidth
                  icon={<MessageSquare size={16} />}
                  onClick={() => onNavigate('/messages')}
                >
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadMessages}
                    </span>
                  )}
                </Button>
                
                <Button 
                  variant="secondary" 
                  fullWidth
                  icon={<Calendar size={16} />}
                  onClick={() => onNavigate('/calendar')}
                >
                  Weekly Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;