import React, { useState } from 'react';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleCreate = () => {
    if (name.trim() && description.trim()) {
      onCreate(name, description);
      setName('');
      setDescription('');
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
        className="bg-surface rounded-lg shadow-xl w-full max-w-lg border border-border-default p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-foreground">Create New Workspace</h2>
          <button onClick={onClose} className="text-foreground-secondary hover:text-foreground text-3xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="ws-name" className="block text-sm font-medium text-foreground-secondary mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 'Pixel Art Icons'"
              className="w-full bg-background border border-border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring-focus focus:border-ring-focus outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="ws-desc" className="block text-sm font-medium text-foreground-secondary mb-1">
              Description
            </label>
            <textarea
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'A collection of icons in a classic 8-bit style.'"
              rows={3}
              className="w-full bg-background border border-border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring-focus focus:border-ring-focus outline-none transition"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-surface-hover hover:bg-surface-hover-active rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate} 
            disabled={!name.trim() || !description.trim()}
            className="px-6 py-2 bg-accent text-accent-foreground font-bold hover:bg-accent-hover rounded-md transition-colors disabled:bg-surface-hover-active disabled:text-foreground-secondary disabled:cursor-not-allowed"
          >
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;