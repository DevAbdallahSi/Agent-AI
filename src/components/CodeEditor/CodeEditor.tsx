import React, { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  height?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  height = 400
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div 
      ref={editorRef} 
      className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
        <span className="font-mono">{language}</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 pt-12 resize-none outline-none border-none"
        style={{ 
          minHeight: `${height}px`,
          lineHeight: '1.5'
        }}
        placeholder="// Write your code here..."
        spellCheck={false}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-12 bottom-0 bg-gray-800 text-gray-500 text-sm font-mono px-2 py-4 select-none pointer-events-none">
        {value.split('\n').map((_, index) => (
          <div key={index} className="h-6 flex items-center justify-end pr-2" style={{ lineHeight: '1.5' }}>
            {index + 1}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        textarea {
          padding-left: 3.5rem;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;