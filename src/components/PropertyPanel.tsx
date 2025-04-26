import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { ArrowLeft, ArrowRight, Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown, Plus, Minus } from 'lucide-react';

const PropertyPanel = () => {
  const { selectedElement, updateElement } = useEditor();
  const [activeTab, setActiveTab] = useState('style');
  
  if (!selectedElement) return null;
  
  const handleInputChange = (key: string, value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { content: value });
    }
  };
  
  const handleStyleChange = (property: string, value: string | number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        style: {
          ...selectedElement.style,
          [property]: value,
        },
      });
    }
  };
  
  return (
    <div className="w-64 bg-white border-l border-slate-200 h-full overflow-y-auto">
      <div className="flex border-b border-slate-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600'
          }`}
          onClick={() => setActiveTab('style')}
        >
          Design
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-sm font-medium text-slate-500 mb-2">ELEMENT TYPE</div>
        <div className="mb-4 bg-slate-100 py-2 px-3 rounded text-slate-700 capitalize">
          {selectedElement.type}
        </div>
        
        {activeTab === 'settings' && (
          <>
            <div className="text-sm font-medium text-slate-500 mt-4 mb-2">CONTENT</div>
            {selectedElement.type === 'image' ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={selectedElement.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Image URL"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="mb-4">
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                ></textarea>
              </div>
            )}
            
            <div className="text-sm font-medium text-slate-500 mt-4 mb-2">POSITION</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">X Position</label>
                <div className="flex items-center">
                  <button className="p-1 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                    <ArrowLeft size={16} />
                  </button>
                  <input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => {
                      updateElement(selectedElement.id, {
                        position: { ...selectedElement.position, x: Number(e.target.value) },
                      });
                    }}
                    className="w-full p-1 border-t border-b border-slate-300 text-center focus:outline-none"
                  />
                  <button className="p-1 border border-slate-300 rounded-r bg-slate-50 text-slate-700">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Y Position</label>
                <div className="flex items-center">
                  <button className="p-1 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => {
                      updateElement(selectedElement.id, {
                        position: { ...selectedElement.position, y: Number(e.target.value) },
                      });
                    }}
                    className="w-full p-1 border-t border-b border-slate-300 text-center focus:outline-none"
                  />
                  <button className="p-1 border border-slate-300 rounded-r bg-slate-50 text-slate-700">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'style' && (
          <>
            {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'paragraph' || selectedElement.type === 'button') && (
              <>
                <div className="text-sm font-medium text-slate-500 mt-4 mb-2">TEXT STYLING</div>
                
                <div className="flex mb-4 border border-slate-200 rounded overflow-hidden">
                  <button
                    className={`flex-1 py-2 ${
                      selectedElement.style.fontWeight === 'bold' ? 'bg-slate-100 text-slate-800' : 'text-slate-600'
                    }`}
                    onClick={() => handleStyleChange('fontWeight', selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                  >
                    <Bold size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      selectedElement.style.fontStyle === 'italic' ? 'bg-slate-100 text-slate-800' : 'text-slate-600'
                    }`}
                    onClick={() => handleStyleChange('fontStyle', selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic')}
                  >
                    <Italic size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      selectedElement.style.textAlign === 'left' ? 'bg-slate-100 text-slate-800' : 'text-slate-600'
                    }`}
                    onClick={() => handleStyleChange('textAlign', 'left')}
                  >
                    <AlignLeft size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      selectedElement.style.textAlign === 'center' ? 'bg-slate-100 text-slate-800' : 'text-slate-600'
                    }`}
                    onClick={() => handleStyleChange('textAlign', 'center')}
                  >
                    <AlignCenter size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      selectedElement.style.textAlign === 'right' ? 'bg-slate-100 text-slate-800' : 'text-slate-600'
                    }`}
                    onClick={() => handleStyleChange('textAlign', 'right')}
                  >
                    <AlignRight size={16} className="mx-auto" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="8"
                      max="72"
                      value={parseInt(String(selectedElement.style.fontSize))}
                      onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm text-slate-700 min-w-10 text-right">
                      {parseInt(String(selectedElement.style.fontSize))}px
                    </span>
                  </div>
                </div>
              </>
            )}
            
            <div className="text-sm font-medium text-slate-500 mt-4 mb-2">COLOR</div>
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1">Text Color</label>
              <div className="flex">
                <input
                  type="color"
                  value={String(selectedElement.style.color)}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-10 h-10 p-1 border border-slate-300 rounded-l"
                />
                <input
                  type="text"
                  value={String(selectedElement.style.color)}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1">Background Color</label>
              <div className="flex">
                <input
                  type="color"
                  value={String(selectedElement.style.backgroundColor) || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 p-1 border border-slate-300 rounded-l"
                />
                <input
                  type="text"
                  value={String(selectedElement.style.backgroundColor) || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="text-sm font-medium text-slate-500 mt-4 mb-2">SPACING</div>
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1">Padding</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={parseInt(String(selectedElement.style.padding))}
                  onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
                  className="flex-1 mr-2"
                />
                <span className="text-sm text-slate-700 min-w-10 text-right">
                  {parseInt(String(selectedElement.style.padding))}px
                </span>
              </div>
            </div>
            
            {selectedElement.type === 'button' && (
              <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Border Radius</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={parseInt(String(selectedElement.style.borderRadius))}
                    onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                    className="flex-1 mr-2"
                  />
                  <span className="text-sm text-slate-700 min-w-10 text-right">
                    {parseInt(String(selectedElement.style.borderRadius))}px
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="text-sm font-medium text-slate-500 mt-6 mb-2 flex items-center">
          <span>ADVANCED OPTIONS</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;