import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useToast } from './ToastContext';

interface ElementPosition {
  x: number;
  y: number;
}

interface ElementSize {
  width: string | number;
  height: string | number;
}

interface ElementStyle {
  [key: string]: string | number;
}

export interface Element {
  id: string;
  type: string;
  position: ElementPosition;
  size: ElementSize;
  content: string;
  style: ElementStyle;
}

interface ElementUpdate {
  position?: ElementPosition;
  size?: ElementSize;
  content?: string;
  style?: ElementStyle;
}

interface EditorContextType {
  elements: Element[];
  selectedElement: Element | null;
  history: Element[][];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  addElement: (element: Element) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, update: ElementUpdate) => void;
  moveElement: (id: string, position: ElementPosition) => void;
  setSelectedElement: (element: Element | null) => void;
  undo: () => void;
  redo: () => void;
  saveLayout: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { showToast } = useToast();
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  const addToHistory = useCallback((newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  const addElement = useCallback((element: Element) => {
    setElements(prevElements => {
      const newElements = [...prevElements, element];
      addToHistory(newElements);
      return newElements;
    });
  }, [addToHistory]);
  
  const removeElement = useCallback((id: string) => {
    setElements(prevElements => {
      const newElements = prevElements.filter(element => element.id !== id);
      addToHistory(newElements);
      return newElements;
    });
    
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  }, [selectedElement, addToHistory]);
  
  const updateElement = useCallback((id: string, update: ElementUpdate) => {
    setElements(prevElements => {
      const newElements = prevElements.map(element => {
        if (element.id === id) {
          const updatedElement = {
            ...element,
            ...update,
            style: update.style ? { ...element.style, ...update.style } : element.style,
          };
          
          // Update selected element if it's being modified
          if (selectedElement?.id === id) {
            setSelectedElement(updatedElement);
          }
          
          return updatedElement;
        }
        return element;
      });
      
      addToHistory(newElements);
      return newElements;
    });
  }, [selectedElement, addToHistory]);
  
  const moveElement = useCallback((id: string, position: ElementPosition) => {
    updateElement(id, { position });
  }, [updateElement]);
  
  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      
      if (selectedElement) {
        const elementInPreviousState = history[newIndex].find(
          element => element.id === selectedElement.id
        );
        setSelectedElement(elementInPreviousState || null);
      }
    }
  }, [canUndo, history, historyIndex, selectedElement]);
  
  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      
      if (selectedElement) {
        const elementInNextState = history[newIndex].find(
          element => element.id === selectedElement.id
        );
        setSelectedElement(elementInNextState || null);
      }
    }
  }, [canRedo, history, historyIndex, selectedElement]);
  
  const saveLayout = useCallback(() => {
    localStorage.setItem('website-builder-layout', JSON.stringify(elements));
    showToast('Layout saved successfully!', 'success');
  }, [elements, showToast]);
  
  return (
    <EditorContext.Provider
      value={{
        elements,
        selectedElement,
        history,
        historyIndex,
        canUndo,
        canRedo,
        addElement,
        removeElement,
        updateElement,
        moveElement,
        setSelectedElement,
        undo,
        redo,
        saveLayout,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};