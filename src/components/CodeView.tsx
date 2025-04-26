import React from 'react';
import { useEditor } from '../context/EditorContext';

const CodeView = () => {
  const { elements } = useEditor();
  
  // Generate HTML for preview
  const generateHTML = () => {
    const htmlElements = elements.map((element) => {
      const style = Object.entries(element.style)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');
        
      switch (element.type) {
        case 'heading':
          return `<h2 style="${style}">${element.content}</h2>`;
        case 'paragraph':
          return `<p style="${style}">${element.content}</p>`;
        case 'text':
          return `<span style="${style}">${element.content}</span>`;
        case 'button':
          return `<button style="${style}">${element.content}</button>`;
        case 'image':
          return `<img src="${element.content}" alt="Image" style="${style}" />`;
        case 'list':
          return `
            <ul style="${style}">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
          `;
        case 'columns':
          return `
            <div style="${style}" class="grid grid-cols-2 gap-4">
              <div style="border: 1px dashed #ccc; padding: 16px; border-radius: 4px;">Column 1</div>
              <div style="border: 1px dashed #ccc; padding: 16px; border-radius: 4px;">Column 2</div>
            </div>
          `;
        case 'container':
          return `<div style="${style}; border: 1px dashed #ccc; padding: 16px; border-radius: 4px;">Container</div>`;
        default:
          return `<div style="${style}">${element.content}</div>`;
      }
    }).join('\n');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <div class="relative min-h-screen bg-white">
${htmlElements}
  </div>
</body>
</html>
    `;
  };
  
  const htmlCode = generateHTML();
  
  return (
    <div className="w-full h-full bg-slate-900 text-white p-4 overflow-auto">
      <pre className="text-sm font-mono">
        <code>{htmlCode}</code>
      </pre>
    </div>
  );
};

export default CodeView;