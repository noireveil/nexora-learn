'use client';

interface WebPreviewProps {
  code: string;
}

export const WebPreview = ({ code }: WebPreviewProps) => {
  
  const finalSrcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: white; /* Default putih */
            color: #1e293b;
          }
          
          body {
            padding: 16px;
            box-sizing: border-box;
          }

          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        </style>
      </head>
      <body>
        ${code}
      </body>
    </html>
  `;

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 border-b border-slate-200 flex justify-between items-center shrink-0">
        <span className="flex items-center gap-2">
            🌐 Browser Preview
        </span>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-[10px] text-slate-400">Live Reload</span>
        </div>
      </div>

      <iframe 
        className="w-full h-full border-0 bg-white block" 
        title="preview"
        srcDoc={finalSrcDoc}
        sandbox="allow-scripts" 
      />
    </div>
  );
};