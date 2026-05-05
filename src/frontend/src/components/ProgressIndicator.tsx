import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { TaskStatus } from '../types/task';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStatus: TaskStatus;
  setCurrentStatus: (status: TaskStatus) => Promise<void>;
  taskId: number;
  isSubmitting: boolean;
}

export const ProgressIndicator = ({ currentStatus, setCurrentStatus, taskId, isSubmitting }: ProgressIndicatorProps) => {
  const [progress, setProgress] = useState({
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0
  });

  useEffect(() => {
    setProgress(prev => ({
      TODO: currentStatus === 'TODO' ? 1 : prev.TODO,
      IN_PROGRESS: currentStatus === 'IN_PROGRESS' ? 1 : prev.IN_PROGRESS,
      DONE: currentStatus === 'DONE' ? 1 : prev.DONE
    }));
  }, [currentStatus]);

  const statuses: Array<{ value: TaskStatus; label: string; icon: any; color: string }> = [
    { value: 'TODO', label: 'To Do', icon: AlertCircle, color: 'slate' },
    { value: 'IN_PROGRESS', label: 'In Progress', icon: CheckCircle2, color: 'blue' },
    { value: 'DONE', label: 'Done', icon: CheckCircle2, color: 'emerald' }
  ];

  return (
    <div className="space-y-2">
      {statuses.map((status) => {
        const Icon = status.icon;
        const isActive = currentStatus === status.value;
        
        return (
          <framerMotion.button
            key={status.value}
            onClick={() => !isSubmitting && setCurrentStatus(status.value)}
            disabled={isSubmitting}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              isActive 
                ? `bg-${status.color}-500/10 border-2 border-${status.color}-500 hover:bg-${status.color}-500/20` 
                : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
            }`}
          >
            <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isActive ? `border-${status.color}-500` : 'border-slate-300'
            }`}>
              {isActive && <div className="w-2.5 h-2.5 rounded-full bg-${status.color}-500" />}
            </div>
            
            <div className="flex-1 text-left">
              <div className={`font-semibold ${
                isActive ? `text-${status.color}-600` : 'text-gray-600'
              }`}>
                {status.label}
              </div>
              {isSubmitting && isActive && (
                <div className="modern-spinner w-4 h-4 ml-auto"></div>
              )}
            </div>

            <div className="text-sm opacity-50">
              {progress[status.value] > 0 && currentStatus === status.value ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : progress[status.value] > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : null}
            </div>
          </framerMotion.button>
        );
      })}
    </div>
  );
};




