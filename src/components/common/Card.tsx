import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  footer,
  isLoading = false
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="p-6 space-y-4 animate-pulse">
          {title && <div className="h-6 bg-gray-200 rounded w-1/3"></div>}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        <>
          {title && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">{title}</h3>
            </div>
          )}
          <div className="p-6">{children}</div>
          {footer && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card;