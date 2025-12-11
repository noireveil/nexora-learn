'use client';
import { useEffect, useRef } from 'react';

interface WebPreviewProps {
  code: string;
}

export const WebPreview = ({ code }: WebPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <style>
            body { font-family: sans-serif; padding: 1rem; color: #333; margin: 0; }
          </style>
          ${code}
        `);
        doc.close();
      }
    }
  }, [code]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="bg-slate-100 px-3 py-1 text-xs text-slate-500 border-b flex justify-between shrink-0">
        <span>Browser Preview</span>
      </div>
      <iframe 
        ref={iframeRef} 
        className="w-full h-full border-0 bg-white" 
        title="preview"
        sandbox="allow-scripts" 
      />
    </div>
  );
};