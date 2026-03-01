'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import { LayoutDashboard, Users, Wallet, Receipt, Percent, GraduationCap, BookOpen, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Fees', href: '/fees', icon: Wallet },
  { name: 'Payments', href: '/payments', icon: Receipt },
  { name: 'Discounts', href: '/discounts', icon: Percent },
  { name: 'Grades', href: '/grades', icon: GraduationCap },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar isBordered className="bg-white">
        <NavbarBrand>
          <BookOpen className="h-6 w-6 text-primary mr-2" />
          <p className="font-bold text-inherit">ITC School</p>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                color="primary"
                name="Admin User"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile actions">
              <DropdownItem key="profile" startContent={<Settings size={16} />}>
                Settings
              </DropdownItem>
              <DropdownItem key="logout" startContent={<LogOut size={16} />} className="text-danger" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
