import { Card, Badge, Button } from 'react-bootstrap';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus, TaskPriority } from '../types/task';

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

export const TaskCard = ({ task, onEdit, onDelete }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: number) => void }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        {task.description && <Card.Text>{task.description}</Card.Text>}
        <div className="d-flex flex-wrap gap-2 mt-2">
          <Badge bg={getStatusColor(task.status)}>{task.status}</Badge>
          <Badge bg={getPriorityColor(task.priority)}>{task.priority}</Badge>
          {task.dueDate && (
            <Badge bg="secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</Badge>
          )}
        </div>
        <div className="mt-3 d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(task)}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="danger" onClick={() => onDelete(task.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
