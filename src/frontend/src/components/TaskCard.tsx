import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus, TaskPriority } from '../types/task';
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
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
      <h3 className="text-lg font-bold">{task.title}</h3>
      {task.description && <p className="text-gray-700">{task.description}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        <StatusBadge status={task.status} type="status" />
        <StatusBadge status={task.priority} type="priority" />
        {task.dueDate && (
          <span className="bg-gray-500 text-white px-2 py-1 rounded">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <select 
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
          className="border rounded px-3 py-2 mr-2"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button 
          onClick={() => onEdit(task)}
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
        >
          <PencilIcon className="h-5 w-5 text-blue-500" />
          Edit
        </button>
        <button 
          onClick={() => handleDelete(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <TrashIcon className="h-5 w-5" />
          Delete
        </button>
      </div>
    </div>
  );
};
