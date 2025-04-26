import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Save, Undo, Redo, Eye, Code } from 'lucide-react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertyPanel from './PropertyPanel';
import { useEditor } from '../context/EditorContext';
import { isTouchDevice } from '../utils/device';
import DevicePreview from './DevicePreview';

const Editor = () => {
  const { undo, redo, saveLayout, selectedElement, canUndo, canRedo } = useEditor();
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'code'>('edit');

  // Choose the appropriate backend based on the device
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;
  
  return (
    <DndProvider backend={backend}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-800">
              <span className="text-blue-600">Websites</span>.co.in Builder
            </h1>
          </div>
          <div className="flex items-center space-x-1">
            <DevicePreview />
            <div className="border-l border-slate-200 mx-2 h-6"></div>
            <button 
              className={`p-2 rounded ${previewMode === 'edit' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPreviewMode('edit')}
              title="Edit Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button 
              className={`p-2 rounded ${previewMode === 'preview' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPreviewMode('preview')}
              title="Preview Mode"
            >
              <Eye size={20} />
            </button>
            <button 
              className={`p-2 rounded ${previewMode === 'code' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPreviewMode('code')}
              title="Code View"
            >
              <Code size={20} />
            </button>
            <div className="border-l border-slate-200 mx-2 h-6"></div>
            <button 
              className={`p-2 rounded ${canUndo ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
            >
              <Undo size={20} />
            </button>
            <button 
              className={`p-2 rounded ${canRedo ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
            >
              <Redo size={20} />
            </button>
            <div className="border-l border-slate-200 mx-2 h-6"></div>
            <button 
              className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1"
              onClick={saveLayout}
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </header>
        
        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Only show sidebar in edit mode */}
          {previewMode === 'edit' && (
            <Sidebar />
          )}
          
          {/* Main canvas area */}
          <div className={`flex-1 overflow-auto ${previewMode === 'edit' ? '' : 'flex items-center justify-center bg-slate-100'}`}>
            <Canvas previewMode={previewMode} />
          </div>
          
          {/* Only show property panel in edit mode and when an element is selected */}
          {previewMode === 'edit' && selectedElement && (
            <PropertyPanel />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Editor;