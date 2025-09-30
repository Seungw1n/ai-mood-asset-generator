import React from 'react';
import type { Workspace } from '../types';
import ThemeToggle from '../components/ThemeToggle';

interface DashboardPageProps {
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-surface/80 backdrop-blur-sm border-b border-border-default shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-medium text-foreground tracking-wide">
              Workspaces
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-surface-hover hover:bg-surface-hover-active rounded-md transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-foreground-secondary">Select a workspace or create a new one.</p>
          <button
            onClick={onCreateWorkspace}
            className="bg-accent text-accent-foreground font-bold py-2 px-4 rounded-md hover:bg-accent-hover transition-colors duration-300 shadow-sm"
          >
            + Create New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => onSelectWorkspace(workspace.id)}
              className="bg-surface rounded-lg p-6 shadow-sm border border-border-default transition-all duration-300 hover:border-accent hover:shadow-md cursor-pointer flex flex-col justify-between"
              style={{ minHeight: '180px' }}
            >
              <div>
                <h2 className="text-xl font-medium text-foreground truncate">{workspace.name}</h2>
                <p className="text-sm text-foreground-secondary mt-2 h-10 overflow-hidden">{workspace.description}</p>
              </div>
              <div className="text-xs text-foreground-secondary mt-4 pt-4 border-t border-border-default flex justify-between">
                <span>By: {workspace.creator}</span>
                <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;