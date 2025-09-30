
import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_WORKSPACES } from './constants';
import type { Workspace, Style } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import CreateWorkspaceModal from './components/CreateWorkspaceModal';

const SESSION_KEY = 'nano-banana-session';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

interface Session {
  isLoggedIn: boolean;
  loginTime: number;
}

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [route, setRoute] = useState(window.location.hash);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    window.location.hash = '#/login';
  }, []);

  const checkSession = useCallback(() => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const session: Session = JSON.parse(sessionData);
        const now = new Date().getTime();
        if (session.isLoggedIn && (now - session.loginTime < SESSION_DURATION)) {
          setIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error('Failed to parse session data:', error);
      }
    }
    logout();
    return false;
  }, [logout]);

  useEffect(() => {
    checkSession();
    
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [checkSession]);

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


  const login = () => {
    const session: Session = {
      isLoggedIn: true,
      loginTime: new Date().getTime(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
    window.location.hash = '#/dashboard';
  };

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
