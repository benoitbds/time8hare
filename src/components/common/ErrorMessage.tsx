import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 flex items-center space-x-2">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}