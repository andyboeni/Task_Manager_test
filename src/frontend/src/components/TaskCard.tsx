import { Pencil, Trash2, Calendar, User } from 'lucide-react';
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
    <div className="card-modern p-5 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate mr-2">{task.title}</h3>
        <div className="flex gap-1.5 shrink-0">
          <StatusBadge status={task.priority} type="priority" />
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow leading-relaxed">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {task.dueDate && (
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}

        {task.assignee && (
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {task.assignee}
          </div>
        )}
        
        <StatusBadge status={task.status} type="status" />
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
        <select 
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
          className="select-modern !py-1 !px-2 !w-auto text-[11px] font-semibold"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/btn"
            title="Edit task"
          >
            <Pencil className="h-4 w-4 shrink-0" />
          </button>
          <button
            onClick={() => handleDelete(task.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all group/btn"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
