import { Task, TaskPriority } from '../types/task';

interface TaskListProps {
    tasks: Task[];
    onTaskSelected: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
};

export const TaskList = ({ tasks, onTaskSelected }: TaskListProps) => {
    return (
        <div className="flex flex-col gap-4">
            {tasks.map((task) => (
                <div 
                    key={task.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onTaskSelected(task)}
                >
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                        {task.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                priorityColors[task.priority]
                            }`}
                        >
                            {task.priority}
                        </span>
                        <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'TODO' ? 'bg-red-100 text-red-800' :
                                task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}
                        >
                            {task.status}
                        </span>
                        {task.dueDate && (
                            <span className="text-sm text-gray-500">
                                Due: {task.dueDate}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
