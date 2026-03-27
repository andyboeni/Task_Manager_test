import { useForm } from 'react-hook-form';
import { TaskFormData, TaskStatus } from '../types/task';

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
            status: task.status as TaskStatus,
        }
    });

    return (
        <form 
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    {...register('title', {
                        required: 'Title is required',
                        maxLength: {
                            value: 100,
                            message: 'Title must be at most 100 characters'
                        }
                    })}
                    className="w-full p-2 border rounded-md"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    {...register('description', {
                        maxLength: {
                            value: 500,
                            message: 'Description must be at most 500 characters'
                        }
                    })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                />
                {errors.description?.message && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                    {...register('status', {
                        required: 'Status is required'
                    })}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
                Update Task
            </button>
        </form>
    );
};
