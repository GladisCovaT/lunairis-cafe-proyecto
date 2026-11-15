import { useEffect, useState } from 'react';
import LoginView from './components/admin/LoginView.jsx';
import Sidebar from './components/admin/Sidebar.jsx';
import Topbar from './components/admin/Topbar.jsx';
import Toast from './components/admin/Toast.jsx';
import OverviewTab from './components/admin/OverviewTab.jsx';
import ProductsTab from './components/admin/ProductsTab.jsx';
import OrdersTab from './components/admin/OrdersTab.jsx';
import MessagesTab from './components/admin/MessagesTab.jsx';
import SeoTab from './components/admin/SeoTab.jsx';
import { adminTabs } from './data/adminTabs';
import { api } from './services/api';
import { useToast } from './hooks/useToast';
import { useAdminData } from './hooks/useAdminData';
import { useSeoAudit } from './hooks/useSeoAudit';

export default function AdminApp() {
  const [view, setView] = useState('login'); // 'login' | 'dashboard'
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { toast, notify } = useToast();
  const data = useAdminData(notify);
  const { audit, runSeoAudit } = useSeoAudit();
  const { loadAll } = data;

  const showDashboard = (email) => {
    setAdminEmail(email || 'Equipo Lunairis');
    setView('dashboard');
    loadAll();
    runSeoAudit();
  };

  // Al abrir el panel, si ya hay una sesión activa se salta el login
  useEffect(() => {
    let cancelled = false;
    api('/api/admin/session')
      .then((session) => {
        if (!cancelled && session.authenticated) showDashboard(session.email);
      })
      .catch(() => { /* La pantalla de acceso permanece disponible si el servidor responde con error. */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await api('/api/admin/logout', { method: 'POST', body: '{}' });
    } catch (error) {
      notify(error.message);
    }
    setView('login');
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    if (tabId === 'seo') runSeoAudit();
  };

  const currentTab = adminTabs.find((tab) => tab.id === activeTab);
  const stats = data.dashboard?.stats;
  const badges = { pendingOrders: stats?.pendingOrders ?? 0, newMessages: stats?.newMessages ?? 0 };

  return (
    <>
      {view === 'login' ? (
        <LoginView onLogin={showDashboard} />
      ) : (
        <div className="dashboard" id="dashboardView">
          <Sidebar
            open={sidebarOpen}
            activeTab={activeTab}
            badges={badges}
            onSelectTab={selectTab}
            onLogout={handleLogout}
          />

          <main className="admin-main">
            <Topbar
              title={currentTab?.title || 'Administración'}
              email={adminEmail}
              onToggleSidebar={() => setSidebarOpen((open) => !open)}
            />

            <div className="admin-content">
              <OverviewTab
                active={activeTab === 'overview'}
                dashboard={data.dashboard}
                seoScore={audit ? audit.score : null}
                onGoto={selectTab}
              />
              <ProductsTab
                active={activeTab === 'products'}
                products={data.products}
                onSave={data.saveProduct}
                onDelete={data.deleteProduct}
              />
              <OrdersTab
                active={activeTab === 'orders'}
                orders={data.orders}
                onStatusChange={data.changeOrderStatus}
              />
              <MessagesTab
                active={activeTab === 'messages'}
                messages={data.messages}
                onStatusChange={data.changeMessageStatus}
              />
              <SeoTab active={activeTab === 'seo'} audit={audit} onRefresh={runSeoAudit} />
            </div>
          </main>
        </div>
      )}

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
