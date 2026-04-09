import { Badge } from 'react-bootstrap';
import { TaskStatus, TaskPriority } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus | TaskPriority;
  type: 'status' | 'priority';
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'TODO': return 'secondary';
    case 'IN_PROGRESS': return 'info';
    case 'DONE': return 'success';
    default: return 'secondary';
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'LOW': return 'success';
    case 'MEDIUM': return 'warning';
    case 'HIGH': return 'danger';
    case 'URGENT': return 'danger';
    default: return 'secondary';
  }
};

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const color = type === 'status' ? getStatusColor(status as TaskStatus) : getPriorityColor(status as TaskPriority);
  
  return (
    <Badge bg={color}>
      {status}
    </Badge>
  );
};
