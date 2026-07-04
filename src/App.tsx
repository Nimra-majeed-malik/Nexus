import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- removed Router
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { VideoCallPage } from './pages/videocall/VideoCallPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { PaymentPage } from './pages/payments/PaymentPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

// Smart redirect based on role
const SmartDashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'entrepreneur') {
    return <Navigate to="/dashboard/entrepreneur" replace />;
  }
  return <Navigate to="/dashboard/investor" replace />;
};

function App() {
  return (
    <AuthProvider>
      {/* No Router here anymore */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<SmartDashboardRedirect />} />
          <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
          <Route path="investor" element={<InvestorDashboard />} />
        </Route>

        {/* Profile Routes */}
        <Route path="/profile" element={<DashboardLayout />}>
          <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
          <Route path="investor/:id" element={<InvestorProfile />} />
        </Route>

        {/* Feature Routes */}
        <Route path="/investors" element={<DashboardLayout />}>
          <Route index element={<InvestorsPage />} />
        </Route>

        <Route path="/entrepreneurs" element={<DashboardLayout />}>
          <Route index element={<EntrepreneursPage />} />
        </Route>

        <Route path="/messages" element={<DashboardLayout />}>
          <Route index element={<MessagesPage />} />
        </Route>

        <Route path="/videocall" element={<DashboardLayout />}>
          <Route index element={<VideoCallPage />} />
        </Route>

        <Route path="/notifications" element={<DashboardLayout />}>
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route path="/documents" element={<DashboardLayout />}>
          <Route index element={<DocumentsPage />} />
        </Route>

        <Route path="/payments" element={<DashboardLayout />}>
          <Route index element={<PaymentPage />} />
        </Route>

        <Route path="/settings" element={<DashboardLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>

        <Route path="/help" element={<DashboardLayout />}>
          <Route index element={<HelpPage />} />
        </Route>

        <Route path="/deals" element={<DashboardLayout />}>
          <Route index element={<DealsPage />} />
        </Route>

        {/* Chat Routes */}
        <Route path="/chat" element={<DashboardLayout />}>
          <Route index element={<ChatPage />} />
          <Route path=":userId" element={<ChatPage />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;