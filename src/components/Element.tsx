import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useEditor } from '../context/EditorContext';

interface ElementProps {
  element: {
    id: string;
    type: string;
    position: { x: number; y: number };
    size: { width: string | number; height: string | number };
    content: string;
    style: Record<string, string | number>;
  };
  isSelected: boolean;
  isPreview: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Element: React.FC<ElementProps> = ({ element, isSelected, isPreview, canvasRef }) => {
  const { moveElement, setSelectedElement } = useEditor();
  const elementRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MOVE_ELEMENT',
    item: { id: element.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isPreview,
  }));
  
  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    setSelectedElement(element);
  };
  
  const renderElementContent = () => {
    switch (element.type) {
      case 'heading':
        return <h2 style={element.style}>{element.content}</h2>;
      case 'paragraph':
        return <p style={element.style}>{element.content}</p>;
      case 'text':
        return <span style={element.style}>{element.content}</span>;
      case 'button':
        return (
          <button 
            style={element.style} 
            className="cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {element.content}
          </button>
        );
      case 'image':
        return (
          <img 
            src={element.content} 
            alt="Website element" 
            style={element.style}
            className="max-w-full h-auto"
          />
        );
      case 'list':
        return (
          <ul style={element.style} className="list-disc pl-5">
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        );
      case 'columns':
        return (
          <div className="grid grid-cols-2 gap-4" style={element.style}>
            <div className="border border-dashed border-slate-300 p-4 rounded">Column 1</div>
            <div className="border border-dashed border-slate-300 p-4 rounded">Column 2</div>
          </div>
        );
      case 'container':
        return (
          <div className="border border-dashed border-slate-300 p-4 rounded" style={element.style}>
            Container
          </div>
        );
      default:
        return <div style={element.style}>{element.content}</div>;
    }
  };
  
  return (
    <div
      ref={(node) => {
        drag(node);
        if (node) elementRef.current = node;
      }}
      className={`absolute ${isSelected && !isPreview ? 'outline outline-2 outline-blue-500' : ''} ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isPreview ? 'cursor-default' : 'cursor-move'}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: isSelected ? 999 : 1,
      }}
      onClick={handleClick}
    >
      {renderElementContent()}
      
      {isSelected && !isPreview && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            moveElement(element.id, { x: -9999, y: -9999 }); // Move off-screen (effectively delete)
          }}
        >
          ×
        </div>
      )}
    </div>
  );
};

export default Element;