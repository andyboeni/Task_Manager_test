import { TaskStatus, TaskPriority } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus | TaskPriority;
  type: 'status' | 'priority';
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  let className = '';
  if (type === 'status') {
    switch (status) {
      case 'TODO': className = 'bg-gray-500 text-white'; break;
      case 'IN_PROGRESS': className = 'bg-blue-500 text-white'; break;
      case 'DONE': className = 'bg-green-500 text-white'; break;
    }
  } else {
    switch (status) {
      case 'LOW': className = 'bg-green-500 text-white'; break;
      case 'MEDIUM': className = 'bg-yellow-500 text-black'; break;
      case 'HIGH': className = 'bg-red-500 text-white'; break;
      case 'URGENT': className = 'bg-red-700 text-white'; break;
    }
  }
  return <span className={`px-2 py-1 rounded ${className}`}>{status}</span>;
};
