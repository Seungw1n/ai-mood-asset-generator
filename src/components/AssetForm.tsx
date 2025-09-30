import React, { useState } from 'react';
import { LoadingSpinner } from './icons';

interface AssetFormProps {
  onGenerate: (name: string, description: string) => void;
  isLoading: boolean;
}

const AssetForm: React.FC<AssetFormProps> = ({ onGenerate, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onGenerate(name, description);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-sm border border-border-default">
      <h2 className="text-xl font-medium text-foreground mb-4">Create New Icon Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="assetName" className="block text-sm font-medium text-foreground-secondary mb-1">
            Asset Name
          </label>
          <input
            type="text"
            id="assetName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., 'Magic Potion'"
            className="w-full bg-background border border-border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring-focus focus:border-ring-focus outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="assetDescription" className="block text-sm font-medium text-foreground-secondary mb-1">
            Asset Description
          </label>
          <textarea
            id="assetDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 'A shimmering bottle containing a swirling galaxy.'"
            rows={3}
            className="w-full bg-background border border-border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring-focus focus:border-ring-focus outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !name.trim() || !description.trim()}
          className="w-full flex justify-center items-center bg-accent text-accent-foreground font-bold py-2 px-4 rounded-md hover:bg-accent-hover disabled:bg-surface-hover-active disabled:text-foreground-secondary disabled:cursor-not-allowed transition-colors duration-300 shadow-sm"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="-ml-1 mr-3" size={20} />
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>
    </div>
  );
};

export default AssetForm;
