import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "px-6 py-2 rounded-full font-outfit text-base transition-colors duration-200";

  const variantClasses = {
    primary: "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90",
    outline: "bg-transparent border-2 border-vanta-neon-blue text-vanta-text-light hover:bg-vanta-neon-blue hover:text-vanta-blue-dark",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;