import React from 'react';
import type { Workspace } from '../types';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
}) => {
  return (
    <nav aria-label="Workspaces">
      <div className="flex items-center space-x-2 bg-surface p-1 rounded-lg">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => onSelectWorkspace(workspace.id)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
              selectedWorkspaceId === workspace.id
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-foreground-secondary hover:bg-surface-hover'
            }`}
            aria-current={selectedWorkspaceId === workspace.id ? 'page' : undefined}
          >
            {workspace.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default WorkspaceSelector;