import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { Clock, CheckCircle, XCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { StudyTask } from '../../types';
import { formatDuration, formatDateForDisplay } from '../../utils/studyUtils';

interface TaskCardProps {
  task: StudyTask;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string, completed: boolean) => void;
  onTimeUpdate: (taskId: string, minutes: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  onTimeUpdate,
}) => {
  const [timeSpent, setTimeSpent] = React.useState<number>(task.actualDuration);
  const [isTracking, setIsTracking] = React.useState<boolean>(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const timerRef = React.useRef<number | null>(null);

  const handleStartTimer = () => {
    if (isTracking) return;
    
    setIsTracking(true);
    setStartTime(Date.now());
    
    timerRef.current = window.setInterval(() => {
      if (startTime) {
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        setTimeSpent(task.actualDuration + elapsedMinutes);
      }
    }, 60000); // Update every minute
  };

  const handleStopTimer = () => {
    if (!isTracking) return;
    
    setIsTracking(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (startTime) {
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
      const newTotal = task.actualDuration + elapsedMinutes;
      setTimeSpent(newTotal);
      onTimeUpdate(task.id, newTotal);
      setStartTime(null);
    }
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const timeProgress = Math.min(100, (timeSpent / task.plannedDuration) * 100);
  
  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-lg">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-500">{formatDateForDisplay(task.date)}</p>
          </div>
          <Badge 
            variant={task.completed ? 'success' : 'warning'}
            className="flex items-center gap-1"
          >
            {task.completed ? (
              <>
                <CheckCircle size={12} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Clock size={12} />
                <span>In Progress</span>
              </>
            )}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        )}
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock size={14} />
              Time progress
            </span>
            <span className="font-medium">
              {formatDuration(timeSpent)} / {formatDuration(task.plannedDuration)}
            </span>
          </div>
          <ProgressBar 
            value={timeSpent} 
            max={task.plannedDuration} 
            color={timeProgress >= 100 ? 'success' : 'primary'} 
          />
        </div>
        
        {task.evidence && (
          <div className="mb-3">
            <a 
              href={task.evidence} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <ExternalLink size={14} />
              View Evidence
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 bg-gray-50">
        {!task.completed ? (
          <>
            <Button 
              variant={isTracking ? 'danger' : 'primary'} 
              size="sm"
              onClick={isTracking ? handleStopTimer : handleStartTimer}
            >
              {isTracking ? 'Stop Timer' : 'Start Timer'}
            </Button>
            
            <Button 
              variant="success" 
              size="sm"
              onClick={() => onComplete(task.id, true)}
              icon={<CheckCircle size={16} />}
            >
              Mark Complete
            </Button>
          </>
        ) : (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onComplete(task.id, false)}
            icon={<XCircle size={16} />}
          >
            Mark Incomplete
          </Button>
        )}
        
        <div className="flex-grow"></div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit(task.id)}
          icon={<Edit size={16} />}
        >
          Edit
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(task.id)}
          icon={<Trash2 size={16} />}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;