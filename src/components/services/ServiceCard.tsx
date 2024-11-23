import { ChevronRight } from 'lucide-react';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  categoryLabel: string;
  onClick: () => void;
}

export default function ServiceCard({ service, categoryLabel, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-6 transition-colors duration-150 hover:bg-primary-50 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-primary">
              {service.title}
            </h3>
            <ChevronRight className="h-5 w-5 text-teal" />
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
              {categoryLabel}
            </span>
            <span className="text-sm text-gray-500">
              {service.timeBlocks * 8} minutes
            </span>
            <span className="text-sm text-gray-500">
              • Par {service.provider.username}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{service.description}</p>
        </div>
      </div>
    </div>
  );
}