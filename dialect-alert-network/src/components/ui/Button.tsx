import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors
        ${variant === 'default' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
        ${variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
        ${variant === 'ghost' ? 'bg-transparent hover:bg-gray-100' : ''}
        ${size === 'sm' ? 'text-sm px-3 py-1' : ''}
        ${size === 'lg' ? 'text-lg px-6 py-3' : ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;