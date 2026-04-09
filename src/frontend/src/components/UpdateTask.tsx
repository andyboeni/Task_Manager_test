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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    {...register('title', {
                        required: 'Title is required',
                        maxLength: {
                            value: 100,
                            message: 'Title must be at most 100 characters'
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.title.message || 'Title is required'}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows={3}
                    {...register('description', {
                        maxLength: {
                            value: 500,
                            message: 'Description must be at most 500 characters'
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    {...register('status', {
                        required: 'Status is required'
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                {errors.status && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.status.message || 'Status is required'}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                    {...register('priority', {
                        required: 'Priority is required'
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.priority ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
                {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.priority.message || 'Priority is required'}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Update Task
            </button>
        </form>
    );
};
