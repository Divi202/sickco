// /**
//  * Sidebar Component - Handles both desktop and mobile sidebar functionality
//  * Props: selectedFeature, onFeatureSelect, isMobileMenuOpen, onCloseMobile
//  */
// import { MessageCircle, LogOut } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';

// // Define the props type
// interface SidebarProps {
//   selectedFeature: string;
//   onFeatureSelect: (featureId: string) => void;
//   isMobileMenuOpen: boolean;
//   onCloseMobile: () => void;
//   user: any; // User object from Supabase
//   onLogout: () => void; // Logout function
// }

// const Sidebar: React.FC<SidebarProps> = ({ selectedFeature, onFeatureSelect, isMobileMenuOpen, onCloseMobile, user, onLogout }) => {
//   const sidebarFeatures = [
//     {
//       id: 'chat',
//       name: 'Chat with Sickco',
//       icon: MessageCircle,
//       active: true,
//     },
//   ];

//   const SidebarContent = ({ isMobile = false, user, onLogout }: { isMobile?: boolean; user: any; onLogout: () => void }) => (
//     <div className={`flex flex-col h-full p-4 ${!isMobile ? 'md:p-6' : ''}`}>
//       {/* Logo/Brand */}
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className={`mb-6 ${!isMobile ? 'md:mb-8' : ''}`}
//       >
//         <h1 className={`font-bold text-white mb-1 ${isMobile ? 'text-xl' : 'text-xl md:text-2xl'}`}>
//           SickCo
//         </h1>
//         <p className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-xs md:text-sm'}`}>
//           AI Dashboard
//         </p>
//       </motion.div>

//       {/* Feature List */}
//       <nav className="flex-grow space-y-2">
//         {sidebarFeatures.map((feature, index) => {
//           const Icon = feature.icon;
//           return (
//             <motion.button
//               key={feature.id}
//               initial={!isMobile ? { x: -50, opacity: 0 } : {}}
//               animate={!isMobile ? { x: 0, opacity: 1 } : {}}
//               transition={!isMobile ? { delay: 0.3 + index * 0.1 } : {}}
//               onClick={() => {
//                 onFeatureSelect(feature.id);
//                 if (isMobile) onCloseMobile();
//               }}
//               className={`w-full flex items-center gap-2 ${!isMobile ? 'md:gap-3' : ''} px-3 ${!isMobile ? 'md:px-4' : ''} py-2 ${!isMobile ? 'md:py-3' : ''} rounded-lg text-left transition-all duration-200 ${
//                 selectedFeature === feature.id
//                   ? 'bg-green-500/20 text-green-400 border border-green-500/30'
//                   : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
//               }`}
//             >
//               <Icon size={18} className={!isMobile ? 'md:w-5 md:h-5' : ''} />
//               <span className={`font-medium ${isMobile ? 'text-sm' : 'text-sm md:text-base'}`}>
//                 {feature.name}
//               </span>
//             </motion.button>
//           );
//         })}
//       </nav>

//       {/* User Profile and Logout */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="mt-8 pt-4 border-t border-slate-700/50"
//       >
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
//             {user?.email ? user.email[0].toUpperCase() : 'U'}
//           </div>
//           <p className="text-slate-200 text-sm font-medium truncate">{user?.email}</p>
//         </div>
//         <Button
//           onClick={onLogout}
//           className="w-full bg-red-600/90 hover:bg-red-700 text-white font-medium py-2 transition-all duration-200"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </Button>
//       </motion.div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <motion.div
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-64 lg:w-72 bg-slate-800/50 border-r border-slate-700/50 backdrop-blur-sm flex-col hidden lg:flex"
//       >
//         <SidebarContent user={user} onLogout={onLogout} />
//       </motion.div>

//       {/* Mobile Sidebar Overlay */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={onCloseMobile}
//               className="fixed inset-0 bg-black/50 z-40 md:hidden"
//             />

//             {/* Mobile Sidebar */}
//             <motion.div
//               initial={{ x: -288 }}
//               animate={{ x: 0 }}
//               exit={{ x: -288 }}
//               transition={{ duration: 0.3 }}
//               className="fixed left-0 top-0 z-50 w-72 h-full bg-slate-800/95 border-r border-slate-700/50 backdrop-blur-sm flex flex-col md:hidden"
//             >
//               {/* Close Button */}
//               <div className="flex justify-end p-4">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={onCloseMobile}
//                   className="text-slate-400 hover:text-white"
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path d="M18 6L6 18M6 6l12 12" />
//                   </svg>
//                 </motion.button>
//               </div>

//               <SidebarContent isMobile={true} user={user} onLogout={onLogout} />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };
// export default Sidebar;

'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, Salad, MessageSquare, EllipsisVertical, HeartPulse } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Sidebar({ active }: { active: 'sickco-ai' | 'diet-plans' }) {
  const items = [
    {
      key: 'sickco-ai',
      label: 'Sickco AI',
      desc: 'Your personal health companion',
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
        <span
          className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/20 text-primary"
          aria-label="SickCo"
        >
          <HeartPulse className="h-5 w-5" aria-hidden />
        </span>
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
                {isActive && (
                  <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden />
                )}
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
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">john@example.com</div>
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
            <DropdownMenuContent align="end" className="w-40">
              {/* Hook this up to your auth logout when ready */}
              <DropdownMenuItem onClick={() => {}}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
