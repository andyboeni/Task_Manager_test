import { TaskStatus, TaskPriority } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus | TaskPriority;
  type: 'status' | 'priority';
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  let className = '';
  if (type === 'status') {
    switch (status) {
      case 'TODO': className = 'badge-status-TODO'; break;
      case 'IN_PROGRESS': className = 'badge-status-IN_PROGRESS'; break;
      case 'DONE': className = 'badge-status-DONE'; break;
    }
  } else {
    switch (status) {
      case 'LOW': className = 'badge-priority-LOW'; break;
      case 'MEDIUM': className = 'badge-priority-MEDIUM'; break;
      case 'HIGH': className = 'badge-priority-HIGH'; break;
      case 'URGENT': className = 'badge-priority-URGENT'; break;
    }
  }
  return <span className={`badge-modern ${className}`}>{status}</span>;
};
