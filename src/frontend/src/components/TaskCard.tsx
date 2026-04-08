import { Task, TaskStatus, TaskPriority } from '../types/task';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-2">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
