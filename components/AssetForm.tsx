import React, { useState } from 'react';

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
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
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