import { motion } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-6 rounded-r-lg"
      role="alert"
    >
      <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-white" />
          </div>
        <div className="flex-grow">
          <p className="text-sm text-rose-800 font-medium">{message}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-rose-600 hover:text-rose-800 text-xs font-bold uppercase tracking-wider"
        >
          Retry
        </button>
      </div>
    </motion.div>
  );
};
