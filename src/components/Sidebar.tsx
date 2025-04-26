import React from 'react';
import { useDrag } from 'react-dnd';
import { Text, Heading, Image, Donut as Button, List, Type, Columns, BoxSelect } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-sm font-medium text-slate-500">ELEMENTS</h2>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-2">
          <DraggableElement type="heading" icon={<Heading size={20} />} label="Heading" />
          <DraggableElement type="paragraph" icon={<Text size={20} />} label="Paragraph" />
          <DraggableElement type="button" icon={<Button size={20} />} label="Button" />
          <DraggableElement type="image" icon={<Image size={20} />} label="Image" />
          <DraggableElement type="list" icon={<List size={20} />} label="List" />
          <DraggableElement type="text" icon={<Type size={20} />} label="Text" />
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">LAYOUTS</h3>
          <div className="grid grid-cols-2 gap-2">
            <DraggableElement type="columns" icon={<Columns size={20} />} label="Columns" />
            <DraggableElement type="container" icon={<BoxSelect size={20} />} label="Container" />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">TEMPLATES</h3>
          <div className="space-y-2">
            <Template name="Hero Section" />
            <Template name="Features Block" />
            <Template name="Contact Form" />
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-slate-200">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm">
          Publish Website
        </button>
      </div>
    </div>
  );
};

interface DraggableElementProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-md cursor-move hover:border-blue-400 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="text-slate-600">{icon}</div>
      <span className="text-xs mt-1 text-slate-600">{label}</span>
    </div>
  );
};

interface TemplateProps {
  name: string;
}

const Template: React.FC<TemplateProps> = ({ name }) => {
  return (
    <div className="p-3 bg-white border border-slate-200 rounded-md cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all">
      <div className="h-16 bg-slate-100 rounded mb-2 flex items-center justify-center">
        <span className="text-xs text-slate-400">Preview</span>
      </div>
      <span className="text-sm text-slate-700">{name}</span>
    </div>
  );
};

export default Sidebar;