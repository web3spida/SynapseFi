import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`
        relative overflow-hidden
        bg-bg-secondary/60 backdrop-blur-xl
        border border-white/5
        rounded-2xl p-6
        shadow-xl shadow-black/20
        ${hover ? 'hover:border-purple-500/30 hover:shadow-purple-500/10 transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};