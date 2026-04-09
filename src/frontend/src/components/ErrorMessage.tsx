import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Alert variant="danger" className="mt-3">
      {message}
    </Alert>
  );
};
