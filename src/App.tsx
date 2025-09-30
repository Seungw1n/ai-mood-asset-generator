
import React, { useState, useEffect } from 'react';
import { DEFAULT_WORKSPACES } from './constants';
import type { Workspace, Style } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import CreateWorkspaceModal from './components/CreateWorkspaceModal';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [route, setRoute] = useState(window.location.hash);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated, login, logout, checkSession } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!checkSession()) {
       if (route !== '#/login') {
         window.location.hash = '#/login';
       }
    } else {
        if (route === '#/login' || route === '') {
            window.location.hash = '#/dashboard';
        }
    }
  }, [route, checkSession]);

  const handleCreateWorkspace = (name: string, description: string) => {
    const newWorkspace: Workspace = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name,
      description,
      style: DEFAULT_WORKSPACES[0].style, // Start with a default style
      creator: 'admin',
      createdAt: new Date().toISOString(),
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    setIsCreateModalOpen(false);
  };

  const handleStyleUpdate = (workspaceId: string, newStyle: Style) => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === workspaceId ? { ...ws, style: newStyle } : ws
      )
    );
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginPage onLogin={login} />;
    }

    if (route.startsWith('#/workspace/')) {
      const workspaceId = route.substring('#/workspace/'.length);
      const selectedWorkspace = workspaces.find(ws => ws.id === workspaceId);
      if (selectedWorkspace) {
        return (
          <WorkspacePage
            workspace={selectedWorkspace}
            onStyleUpdate={handleStyleUpdate}
            onBack={() => window.location.hash = '#/dashboard'}
          />
        );
      }
    }
    
    // Default to dashboard if authenticated
    return (
      <DashboardPage
        workspaces={workspaces}
        onSelectWorkspace={(id) => window.location.hash = `#/workspace/${id}`}
        onCreateWorkspace={() => setIsCreateModalOpen(true)}
        onLogout={logout}
      />
    );
  };

  return (
    <>
      {renderContent()}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </>
  );
};

export default App;