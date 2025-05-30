import React, { useState } from 'react';
import { StudyTask } from '../../types';
import Button from '../ui/Button';
import { Clock, BookOpen, AlignLeft, Plus, X } from 'lucide-react';
import { getToday } from '../../utils/studyUtils';

interface TaskFormProps {
  onSubmit: (task: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialValues?: Partial<StudyTask>;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [plannedDuration, setPlannedDuration] = useState(
    initialValues?.plannedDuration || 60
  );
  const [date, setDate] = useState(initialValues?.date || getToday());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      plannedDuration,
      actualDuration: initialValues?.actualDuration || 0,
      completed: initialValues?.completed || false,
      date,
      evidence: initialValues?.evidence,
    });
    
    // Reset form if it's a new task
    if (!initialValues?.id) {
      setTitle('');
      setDescription('');
      setPlannedDuration(60);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} />
            <span>Study Task</span>
          </div>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What will you study?"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <AlignLeft size={16} />
            <span>Description (Optional)</span>
          </div>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about what you'll cover"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="plannedDuration" className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} />
              <span>Planned Duration (minutes)</span>
            </div>
          </label>
          <input
            type="number"
            id="plannedDuration"
            value={plannedDuration}
            onChange={(e) => setPlannedDuration(Number(e.target.value))}
            min={1}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span>Study Date</span>
            </div>
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} icon={<X size={16} />}>
            Cancel
          </Button>
        )}
        
        <Button type="submit" variant="primary" icon={<Plus size={16} />}>
          {initialValues?.id ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;