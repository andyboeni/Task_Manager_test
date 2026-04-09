import { Card, Button, Form } from 'react-bootstrap';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { StatusBadge } from './StatusBadge';

export const TaskCard = ({ task, onEdit, onDelete }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: number) => void }) => {
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(id);
    }
  };

  const handleStatusChange = (id: number, newStatus: TaskStatus) => {
    // In a real implementation, this would update the task status
    // For now, we'll just log it
    console.log(`Changing task ${id} status to ${newStatus}`);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        {task.description && <Card.Text>{task.description}</Card.Text>}
        <div className="d-flex flex-wrap gap-2 mt-2">
          <StatusBadge status={task.status} type="status" />
          <StatusBadge status={task.priority} type="priority" />
          {task.dueDate && (
            <span className="badge bg-secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
        <div className="mt-3 d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(task)}>
            <PencilIcon className="h-5 w-5 text-blue-500 me-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(task.id)}>
            <TrashIcon className="h-5 w-5 text-white me-2" />
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
