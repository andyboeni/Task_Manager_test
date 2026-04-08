import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types/task';

interface UpdateTaskProps {
    task: Task;
    onSubmit: (data: TaskFormData) => Promise<void>;
}

export const UpdateTask = ({ task, onSubmit }: UpdateTaskProps) => {
    const { 
        register,
        formState: { errors },
        handleSubmit
    } = useForm<TaskFormData>({
        defaultValues: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
        }
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    {...register('title', {
                        required: 'Title is required',
                        maxLength: {
                            value: 100,
                            message: 'Title must be at most 100 characters'
                        }
                    })}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message || 'Title is required'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('description', {
                        maxLength: {
                            value: 500,
                            message: 'Description must be at most 500 characters'
                        }
                    })}
                    isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                    {...register('status', {
                        required: 'Status is required'
                    })}
                    isInvalid={!!errors.status}
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.status?.message || 'Status is required'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                    {...register('priority', {
                        required: 'Priority is required'
                    })}
                    isInvalid={!!errors.priority}
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.priority?.message || 'Priority is required'}
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
                Update Task
            </Button>
        </Form>
    );
};
