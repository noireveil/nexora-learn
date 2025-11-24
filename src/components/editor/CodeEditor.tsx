'use client';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export const CodeEditor = ({ code, onChange, language = 'javascript' }: CodeEditorProps) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          roundedSelection: true,
        }}
      />
    </div>
  );
};
