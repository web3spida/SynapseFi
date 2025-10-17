import type { FC } from 'react';
import { motion } from 'framer-motion';
import { formatAddress, getScoreTier } from '../utils/constants';

interface CreditPassportCardProps {
  address: string;
  score: number;
  lastUpdated: number;
  isLoading?: boolean;
}

export const CreditPassportCard: FC<CreditPassportCardProps> = ({
  address,
  score,
  lastUpdated,
  isLoading = false,
}) => {
  const { tier, color, risk } = getScoreTier(score);
  const progress = Math.max(0, Math.min(100, (score / 850) * 100));

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Credit Passport</h3>
            <p className="text-gray-400 text-sm">{formatAddress(address)}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6" aria-label="Credit score gauge">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120" role="img" aria-label={`Score progress ${Math.round(progress)}%`}>
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: 0, strokeDashoffset: 0 }}
                animate={{ 
                  strokeDasharray: `${progress * 3.39} 339`,
                  strokeDashoffset: 0
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isLoading ? (
                  <span className="inline-block w-12 h-7 rounded bg-gray-700 animate-pulse" />
                ) : (
                  score
                )}
              </motion.span>
              <span className="text-gray-400 text-sm">Score</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Risk Tier</span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${color}20`,
                color: color
              }}
              aria-label={`Risk tier: ${risk}`}
            >
              {risk} Risk
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Credit Rating</span>
            <span className="text-white font-medium">{tier}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Last Updated</span>
            <span className="text-white text-sm">{formatDate(lastUpdated)}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Score Range</span>
            <span className="text-gray-300">300 - 850</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};