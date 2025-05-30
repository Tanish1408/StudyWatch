import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { Calendar, Clock, MessageSquare, CheckCircle, BookOpen } from 'lucide-react';
import { StudyTask } from '../types';
import { 
  getToday, 
  formatDateForDisplay, 
  formatDuration, 
  getPastDays 
} from '../utils/studyUtils';

interface ParentDashboardProps {
  onNavigate: (path: string) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { 
    tasks, 
    messages, 
    getSummary, 
    getTasksByDate,
    addMessage,
    getUnreadMessageCount
  } = useStudy();
  
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [messageText, setMessageText] = useState<string>('');
  
  const dailyTasks = getTasksByDate(selectedDate);
  const dailySummary = getSummary(selectedDate, selectedDate);
  
  // Get last 7 days
  const last7Days = getPastDays(7);
  const weekSummary = getSummary(last7Days[last7Days.length - 1], last7Days[0]);
  
  const formatDateToYYYYMMDD = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Calculate completion streak
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateString = formatDateToYYYYMMDD(currentDate);
      const dayTasks = getTasksByDate(dateString);
      
      if (dayTasks.length === 0) break;
      
      const allCompleted = dayTasks.every(task => task.completed);
      if (!allCompleted) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim() && currentUser) {
      addMessage(messageText, currentUser.id);
      setMessageText('');
    }
  };
  
  const unreadMessages = getUnreadMessageCount(currentUser?.id || '');
  
  // Progress data for last 7 days
  const dailyProgress = last7Days.map(date => {
    const daySummary = getSummary(date, date);
    return {
      date,
      completion: daySummary.totalTasks > 0 
        ? Math.round((daySummary.completedTasks / daySummary.totalTasks) * 100) 
        : 0,
      plannedTime: daySummary.totalPlannedTime,
      actualTime: daySummary.totalActualTime
    };
  }).reverse();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Parent Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your child's study progress
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 mb-1">Tasks Completed</p>
                    <h3 className="text-2xl font-bold text-blue-900">
                      {weekSummary.completedTasks}/{weekSummary.totalTasks}
                    </h3>
                    <p className="text-sm text-blue-700">This week</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CheckCircle size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Study Time</p>
                    <h3 className="text-2xl font-bold text-green-900">
                      {formatDuration(weekSummary.totalActualTime)}
                    </h3>
                    <p className="text-sm text-green-700">This week</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock size={24} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Completion Streak</p>
                    <h3 className="text-2xl font-bold text-purple-900">
                      {streak} days
                    </h3>
                    <p className="text-sm text-purple-700">Current streak</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Progress Chart */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dailyProgress.map((day) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {formatDateForDisplay(day.date)}
                      </span>
                      <Badge 
                        variant={day.completion >= 100 ? 'success' : day.completion > 0 ? 'warning' : 'secondary'}
                      >
                        {day.completion}% Complete
                      </Badge>
                    </div>
                    <ProgressBar 
                      value={day.completion} 
                      max={100}
                      color={day.completion >= 100 ? 'success' : 'primary'}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Time: {formatDuration(day.actualTime)} / {formatDuration(day.plannedTime)}</span>
                      <span>
                        {day.plannedTime > 0 
                          ? Math.round((day.actualTime / day.plannedTime) * 100) 
                          : 0}% of planned time
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Today's Tasks */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Tasks for {formatDateForDisplay(selectedDate)}
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </CardHeader>
            <CardContent>
              {dailyTasks.length > 0 ? (
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-lg ${
                        task.completed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                        <Badge 
                          variant={task.completed ? 'success' : 'warning'}
                        >
                          {task.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span>
                            {formatDuration(task.actualDuration)} / {formatDuration(task.plannedDuration)}
                          </span>
                        </div>
                        <ProgressBar 
                          value={task.actualDuration} 
                          max={task.plannedDuration}
                          color={task.completed ? 'success' : 'primary'}
                        />
                      </div>
                      
                      {task.evidence && (
                        <div className="mt-3">
                          <a 
                            href={task.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Evidence
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No tasks scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Send Message */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Send a Message</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write a message to your child..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3"
                  rows={4}
                  required
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  icon={<MessageSquare size={16} />}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Messages</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('/messages')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.slice(-3).reverse().map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.senderId === currentUser?.id
                          ? 'bg-blue-50 ml-4'
                          : 'bg-gray-50 mr-4'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {message.senderId === currentUser?.id ? 'You' : 'Student'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;