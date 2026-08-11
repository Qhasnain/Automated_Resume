import React, { useState, useEffect, useRef } from 'react';

interface InlineEditableProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  formatDisplay?: (val: string) => string;
}

export default function InlineEditable({ value, onChange, className = '', placeholder = 'Click to edit', multiline = false, formatDisplay }: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value || '');
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-blue-50 border border-blue-200 outline-none w-full resize-none rounded px-1 text-inherit font-inherit ${className}`}
          rows={Math.max(2, currentValue.split('\n').length)}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-blue-50 border border-blue-200 outline-none w-full rounded px-1 text-inherit font-inherit ${className}`}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 rounded px-1 transition-colors min-h-[1.5em] inline-block whitespace-pre-wrap ${!value ? 'text-gray-400 italic' : ''} ${className}`}
    >
      {value ? (formatDisplay ? formatDisplay(value) : value) : placeholder}
    </span>
  );
}
