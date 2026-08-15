import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PanelDerecho } from './PanelDerecho';

export function AppShell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
      <PanelDerecho />
    </div>
  );
}
