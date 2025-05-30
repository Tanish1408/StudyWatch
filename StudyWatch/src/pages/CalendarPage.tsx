import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { getWeekDates, formatDateForDisplay, formatDuration } from '../utils/studyUtils';

interface CalendarPageProps {
  onNavigate: (path: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const { getTasksByDate, getSummary } = useStudy();
  
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const weekDates = getWeekDates(currentWeekStart);
  
  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeek);
  };
  
  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };
  
  const handleToday = () => {
    setCurrentWeekStart(new Date());
  };
  
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          icon={<ArrowLeft size={20} />}
          onClick={() => onNavigate('/')}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Weekly Calendar</h1>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="secondary" 
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={handlePrevWeek}
        >
          Previous Week
        </Button>
        
        <Button 
          variant="primary"
          size="sm"
          icon={<CalendarIcon size={16} />}
          onClick={handleToday}
        >
          Today
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleNextWeek}
        >
          Next Week
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const tasks = getTasksByDate(date);
          const summary = getSummary(date, date);
          const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = new Date(date).getDate();
          
          return (
            <Card 
              key={date} 
              className={`${isToday(date) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-600">{dayName}</span>
                  <span className={`text-xl font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                    {dayNumber}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDateForDisplay(date).split(', ')[1]}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-2">
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>{summary.completedTasks}/{summary.totalTasks}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-blue-500" />
                        <span>{formatDuration(summary.totalActualTime)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          className="border-l-2 pl-2 py-1 text-sm hover:bg-gray-50"
                          style={{ 
                            borderLeftColor: task.completed ? '#10B981' : '#3B82F6'
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium truncate" style={{ maxWidth: '80%' }}>
                              {task.title}
                            </span>
                            <Badge 
                              variant={task.completed ? 'success' : 'primary'} 
                              className="text-xs"
                            >
                              {formatDuration(task.actualDuration)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500 text-sm">
                    No tasks
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;