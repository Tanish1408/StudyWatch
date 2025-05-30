import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import MessagesPage from './pages/MessagesPage';
import CalendarPage from './pages/CalendarPage';
import Header from './components/layout/Header';

type AppRoute = '/' | '/messages' | '/calendar';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/');

  useEffect(() => {
    // Reset to dashboard when authentication state changes
    if (isAuthenticated) {
      setCurrentRoute('/');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigate = (path: AppRoute) => {
    setCurrentRoute(path);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case '/':
        return currentUser?.role === 'student' ? (
          <StudentDashboard onNavigate={handleNavigate} />
        ) : (
          <ParentDashboard onNavigate={handleNavigate} />
        );
      case '/messages':
        return <MessagesPage onNavigate={handleNavigate} />;
      case '/calendar':
        return <CalendarPage onNavigate={handleNavigate} />;
      default:
        return currentUser?.role === 'student' ? (
          <StudentDashboard onNavigate={handleNavigate} />
        ) : (
          <ParentDashboard onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={handleNavigate} />
      <main className="flex-grow">{renderContent()}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <AppContent />
      </StudyProvider>
    </AuthProvider>
  );
}

export default App;