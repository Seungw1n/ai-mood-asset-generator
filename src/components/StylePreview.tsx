import React from 'react';
import type { Style } from '../types';

interface StylePreviewProps {
  style: Style;
  onEdit: () => void;
}

const StylePreview: React.FC<StylePreviewProps> = ({ style, onEdit }) => {
  const styleString = JSON.stringify(style, null, 2);
  const lines = styleString.split('\n');
  const previewString = lines.slice(0, 5).join('\n');

  return (
    <div>
      <h2 className="text-lg font-medium text-foreground mb-3 mt-6">Workspace Style</h2>
      <div className="bg-background p-4 rounded-lg border border-border-input space-y-4">
        <pre className="text-sm text-foreground-secondary whitespace-pre-wrap">
          <code>
            {previewString}
            {lines.length > 5 && '...'}
          </code>
        </pre>
        <button
          onClick={onEdit}
          className="w-full bg-surface-hover hover:bg-surface-hover-active text-accent font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          View & Edit Style
        </button>
      </div>
    </div>
  );
};

export default StylePreview;
