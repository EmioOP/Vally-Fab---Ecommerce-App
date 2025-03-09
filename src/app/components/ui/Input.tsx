"use client";

import { ReactNode } from "react";

interface InputProps {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon: ReactNode;
  className?: string;
}

export default function Input({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  className = "",
}: InputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300"
          placeholder={placeholder}
        />
        <div className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-300">
          {icon}
        </div>
      </div>
    </div>
  );
}