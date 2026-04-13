'use client';

import { ReactNode } from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className = '' }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isError = percentage >= 100;

  return (
    <div className={`text-xs mt-1 ${className}`}>
      <span className={isError ? 'text-red-600 font-semibold' : isWarning ? 'text-yellow-600' : 'text-gray-500'}>
        {current} / {max}
      </span>
      {isError && <span className="text-red-600 ml-2">Character limit exceeded</span>}
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 flex items-center gap-1 ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

interface ValidationFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  characterCount?: { current: number; max: number };
  className?: string;
}

export function ValidationFieldWrapper({
  label,
  required = false,
  error,
  children,
  characterCount,
  className = '',
}: ValidationFieldWrapperProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={error ? 'border-red-500 rounded-lg' : ''}>
        {children}
      </div>
      {characterCount && <CharacterCounter current={characterCount.current} max={characterCount.max} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

interface ArrayLimitIndicatorProps {
  current: number;
  max: number;
  itemName?: string;
  className?: string;
}

export function ArrayLimitIndicator({ current, max, itemName = 'items', className = '' }: ArrayLimitIndicatorProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isError = percentage >= 100;

  if (current === 0) return null;

  return (
    <div className={`text-xs ${className}`}>
      <span className={isError ? 'text-red-600 font-semibold' : isWarning ? 'text-yellow-600' : 'text-gray-500'}>
        {current} / {max} {itemName}
      </span>
      {isError && <span className="text-red-600 ml-2">Limit reached</span>}
      {isWarning && !isError && <span className="text-yellow-600 ml-2">Approaching limit</span>}
    </div>
  );
}

