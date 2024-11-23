import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
}

export default function CategoryCard({ title, description, icon, to }: CategoryCardProps) {
  return (
    <Link to={to} className="group relative block">
      <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}