
import React from 'react';
import { Sentiment, SentimentResult } from '../types';
import { ThumbsUpIcon, ThumbsDownIcon, MinusCircleIcon } from './IconComponents';

interface SentimentCardProps {
  result: SentimentResult;
}

const sentimentConfig = {
  [Sentiment.Positive]: {
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    borderColor: 'border-sentiment-positive',
    textColor: 'text-sentiment-positive',
    icon: <ThumbsUpIcon className="w-8 h-8" />,
  },
  [Sentiment.Negative]: {
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    borderColor: 'border-sentiment-negative',
    textColor: 'text-sentiment-negative',
    icon: <ThumbsDownIcon className="w-8 h-8" />,
  },
  [Sentiment.Neutral]: {
    bgColor: 'bg-gray-100 dark:bg-gray-700/50',
    borderColor: 'border-sentiment-neutral',
    textColor: 'text-sentiment-neutral',
    icon: <MinusCircleIcon className="w-8 h-8" />,
  },
};

const SentimentCard: React.FC<SentimentCardProps> = ({ result }) => {
  const config = sentimentConfig[result.sentimento] || sentimentConfig[Sentiment.Neutral];

  return (
    <div className={`
      p-6 rounded-2xl shadow-lg border-l-8 
      ${config.borderColor} ${config.bgColor} 
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
    `}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${config.textColor}`}>
          {config.icon}
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{result.marca}</h3>
          <p className={`mt-1 text-lg font-semibold ${config.textColor}`}>
            {result.sentimento}
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {result.resumo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
