import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useEditor } from '../context/EditorContext';
import Element from './Element';
import CodeView from './CodeView';
import { useDeviceContext } from '../context/DeviceContext';

interface CanvasProps {
  previewMode: 'edit' | 'preview' | 'code';
}

const Canvas: React.FC<CanvasProps> = ({ previewMode }) => {
  const { elements, addElement, setSelectedElement, selectedElement, updateElement } = useEditor();
  const { activeDevice } = useDeviceContext();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['ELEMENT', 'MOVE_ELEMENT'],
    drop: (item: { type: string; id?: string }, monitor) => {
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;

        if (item.id) {
          // Moving existing element
          updateElement(item.id, {
            position: { x, y }
          });
        } else {
          // Adding new element
          const newElement = {
            id: String(Date.now()),
            type: item.type,
            position: { x, y },
            size: { width: 'auto', height: 'auto' },
            content: getDefaultContent(item.type),
            style: getDefaultStyle(item.type),
          };
          
          addElement(newElement);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [addElement, updateElement]);

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text Block';
      case 'heading':
        return 'Heading';
      case 'paragraph':
        return 'This is a paragraph of text that demonstrates what your content might look like.';
      case 'button':
        return 'Button';
      case 'image':
        return 'https://via.placeholder.com/300x200';
      default:
        return '';
    }
  };

  const getDefaultStyle = (type: string) => {
    const baseStyle = {
      color: '#333333',
      backgroundColor: 'transparent',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'normal',
      textAlign: 'left' as const,
      border: 'none',
      position: 'relative' as const,
      userSelect: 'none' as const,
    };

    switch (type) {
      case 'heading':
        return {
          ...baseStyle,
          fontSize: '24px',
          fontWeight: 'bold',
        };
      case 'button':
        return {
          ...baseStyle,
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 'medium',
          textAlign: 'center' as const,
          cursor: 'pointer',
        };
      default:
        return baseStyle;
    }
  };

  const getDeviceStyles = () => {
    switch (activeDevice) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px',
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
        };
      default:
        return {
          width: '100%',
          maxWidth: '1200px',
          minHeight: '100vh',
        };
    }
  };

  if (previewMode === 'code') {
    return <CodeView />;
  }

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-slate-100 p-4 overflow-x-auto">
      <div 
        ref={(node) => {
          drop(node);
          if (node) canvasRef.current = node;
        }}
        className={`relative bg-white shadow-lg transition-all duration-300 ${
          previewMode === 'preview' ? 'border border-slate-200' : ''
        }`}
        style={{ 
          ...getDeviceStyles(),
          height: previewMode === 'preview' ? getDeviceStyles().minHeight : '100%',
        }}
        onClick={() => previewMode === 'edit' && setSelectedElement(null)}
      >
        {isOver && previewMode === 'edit' && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-10 pointer-events-none z-0"></div>
        )}
        
        {elements.map((element) => (
          <Element 
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            isPreview={previewMode === 'preview'}
            canvasRef={canvasRef}
          />
        ))}

        {elements.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400">
            {previewMode === 'edit' ? (
              <>
                <div className="w-12 h-12 mb-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 12h16M12 4v16" />
                  </svg>
                </div>
                <p className="mt-4 text-lg">Drag elements from the sidebar to start building</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mb-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="mt-4 text-lg">No content yet. Switch to edit mode to build your page.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;