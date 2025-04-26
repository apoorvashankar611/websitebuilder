import React from 'react';
import Editor from './components/Editor';
import { EditorProvider } from './context/EditorContext';
import { ToastProvider } from './context/ToastContext';
import { DeviceProvider } from './context/DeviceContext';

function App() {
  return (
    <ToastProvider>
      <EditorProvider>
        <DeviceProvider>
          <div className="min-h-screen bg-slate-50">
            <Editor />
          </div>
        </DeviceProvider>
      </EditorProvider>
    </ToastProvider>
  );
}

export default App;