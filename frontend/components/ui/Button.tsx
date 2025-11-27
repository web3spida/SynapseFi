import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  fullWidth = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 border border-transparent",
    secondary: "bg-bg-tertiary text-text-primary border border-purple-500/20 hover:border-purple-500/50 hover:bg-bg-secondary",
    ghost: "text-text-secondary hover:text-white hover:bg-bg-tertiary",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};