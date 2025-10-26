
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-secondary"></div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Analisando... um momento.</p>
    </div>
  );
};

export default LoadingSpinner;
