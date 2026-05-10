import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, LogOut, Activity, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { useStore } from '@/src/store/useStore';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/patients', icon: Users },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Prontuários', href: '/records', icon: FileText },
  { name: 'Financeiro', href: '/finance', icon: DollarSign },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const { user } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Activity className="w-6 h-6 text-primary mr-2" />
        <span className="text-xl font-bold text-foreground">PsiFlow</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 uppercase shrink-0">
            {user?.name?.substring(0, 2) || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-destructive rounded-md hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden mr-2" />}>
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-foreground truncate">
              {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'PsiFlow'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Header actions could go here */}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
