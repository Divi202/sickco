'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, Salad, EllipsisVertical, LogOut, LoaderCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// Define the props type
interface SidebarProps {
  active: string;
  user: any; // User object from Supabase
  onLogout: () => void; // Logout function
  isLoading: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ active, user, onLogout, isLoading }) => {
  // console.log(active);
  const items = [
    {
      key: 'sickco-ai',
      label: 'Sickco AI',
      desc: 'Your personal sickness companion',
      icon: Bot,
      href: '/dashboard?section=sickco-ai',
      comingSoon: false,
    },
    {
      key: 'diet-plans',
      label: 'Diet Plan',
      desc: 'Personalized meal guidance',
      icon: Salad,
      href: '/dashboard?section=diet-plans',
      comingSoon: true,
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-center px-4 py-6 gap-2">
        {/* <span
          className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/20 text-primary"
          aria-label="SickCo"
        >
          <HeartPulse className="h-5 w-5" aria-hidden />
        </span> */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">
            <span>Sick</span>
            <span className="text-primary">Co</span>
          </span>
        </div>
        <span className="sr-only">SickCo</span>
      </div>

      <nav className="flex-1 flex flex-col gap-3 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'group rounded-xl px-3 py-3 transition-colors',
                isActive ? 'bg-primary/15 text-foreground' : 'hover:bg-muted/30 text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-xl',
                      isActive ? 'bg-primary/20' : 'bg-muted/20',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium leading-none">{item.label}</span>
                      {item.comingSoon && (
                        <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
                          Coming soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                {/* {isActive && (
                  <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden />
                )} */}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {/* Replace with real user photo when available */}
              <AvatarImage src="/user-avatar-placeholder.jpg" alt="User photo" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-medium">
                {' '}
                {user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open profile menu"
              >
                <EllipsisVertical className="h-5 w-5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-40">
              {/* Hook this up to your auth logout when ready */}
              <DropdownMenuItem
                onClick={onLogout}
                variant="destructive"
                disabled={isLoading}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* <Button className="flex flex-1" onClick={onLogout} variant="destructive">
                  {isLoading ? (
                    <LoaderCircle className="h-4 w-4"></LoaderCircle>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 text-background"></LogOut>
                      <span className="text-background">Logout</span>
                      <span className="sr-only">Logout</span>
                    </>
                  )}
                </Button> */}
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4"></LoaderCircle>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-destructive"></LogOut>
                    <span className="text-destructive">Logout</span>
                    <span className="sr-only">Logout</span>
                  </div>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
