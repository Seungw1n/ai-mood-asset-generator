import React, { useState, useEffect } from 'react';
import type { Style } from '../types';

interface StyleEditorModalProps {
  isOpen: boolean;
  style: Style;
  onClose: () => void;
  onSave: (newStyle: Style) => void;
}

const StyleEditorModal: React.FC<StyleEditorModalProps> = ({ isOpen, style, onClose, onSave }) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setJsonString(JSON.stringify(style, null, 2));
      setError(null);
    }
  }, [isOpen, style]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    try {
      const newStyle = JSON.parse(jsonString);
      if (
        typeof newStyle.style === 'string' &&
        typeof newStyle.material === 'string' &&
        typeof newStyle.finish === 'string' &&
        typeof newStyle.texture === 'string'
      ) {
        onSave(newStyle);
      } else {
        setError('Invalid style format. Please ensure "style", "material", "finish", and "texture" fields are present and are strings.');
      }
    } catch (e) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-lg shadow-xl w-full max-w-2xl border border-border-default p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-foreground">Edit Workspace Style</h2>
          <button onClick={onClose} className="text-foreground-secondary hover:text-foreground text-3xl leading-none">&times;</button>
        </div>
        
        <p className="text-sm text-foreground-secondary mb-4">
          Modify the JSON below to change the style for this workspace. Changes will be applied to all future icon generations.
        </p>

        <textarea
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          className="w-full h-80 bg-background border border-border-input rounded-md p-3 text-foreground font-mono text-sm focus:ring-2 focus:ring-ring-focus focus:border-ring-focus outline-none transition"
          aria-label="Style JSON Editor"
        />

        {error && (
          <div className="mt-2 text-destructive text-sm" role="alert">{error}</div>
        )}

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-surface-hover hover:bg-surface-hover-active rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-accent text-accent-foreground font-bold hover:bg-accent-hover rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleEditorModal;
