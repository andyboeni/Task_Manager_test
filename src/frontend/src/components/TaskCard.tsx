import { Card, Button, Form } from 'react-bootstrap';
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
          <Form.Select 
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
            className="me-2"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Form.Select>
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
