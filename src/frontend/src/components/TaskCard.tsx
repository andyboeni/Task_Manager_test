import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus } from '../types/task';
import { StatusBadge } from './StatusBadge';

export const TaskCard = ({ task, onEdit, onDelete, onUpdate }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: number) => void; onUpdate: (id: number, data: Partial<Task>) => Promise<void> }) => {
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(id);
    }
  };

  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    try {
      await onUpdate(id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div className="card-modern p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 truncate mr-2">{task.title}</h3>
        <div className="flex gap-1.5 shrink-0">
          <StatusBadge status={task.status} type="status" />
          <StatusBadge status={task.priority} type="priority" />
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-grow">{task.description}</p>
      )}
      
      {task.dueDate && (
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           Due: {new Date(task.dueDate).toLocaleDateString()}
         </div>
      )}
      
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
        <select 
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
          className="select-modern py-1 text-xs"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        
        <div className="flex gap-1 ml-auto">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex items-center gap-1.5"
            title="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Edit</span>
          </button>
          <button 
            onClick={() => handleDelete(task.id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors flex items-center gap-1.5"
            title="Delete task"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
