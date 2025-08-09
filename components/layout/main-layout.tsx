"use client";

import { NotificationBell } from "@/components/notification/notification-bell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useNotificationSetup } from "@/hooks/use-notification-socket";
import { useNotificationStore } from "@/store/notification";
import type { UserInfo } from "@/types/auth";
import Cookies from "js-cookie";
import {
  Calendar,
  Briefcase,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  UserCheck,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser?: UserInfo;
}

const navigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Chat", href: "/chat", icon: MessageSquare },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "User Management", href: "/admin/users-management", icon: Users },
  {
    name: "Post Management",
    href: "/admin/posts-management",
    icon: MessageSquare,
  },
  {
    name: "Event Management",
    href: "/admin/events-management",
    icon: Calendar,
  },
  {
    name: "Job Post Management",
    href: "/admin/jobposts-management",
    icon: Briefcase,
  },
  {
    name: "Mentorship Requests",
    href: "/admin/mentorship-requests",
    icon: UserCheck,
  },
];

const alumniNavigation = [
  { name: "Mentoring", href: "/alumni/mentoring", icon: UserCheck },
  {
    name: "Event Management",
    href: "/alumni/events-management",
    icon: Calendar,
  },
  { name: "CV", href: "/alumni/CV", icon: FileText },
];

<<<<<<< HEAD
const studentNavigation = [{ name: "CV", href: "/student/CV", icon: FileText }];
=======
const studentNavigation = [{ name: "CV", href: "/student/CV", icon: User }];
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df

export default function MainLayout({ children, currentUser }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { addNotification } = useNotificationStore();

  // Initialize SignalR connection using our new hook
  const token = Cookies.get("auth-token");

  // Debug log
  useEffect(() => {
    if (!token) {
      console.log("No auth token found");
      return;
    }
    if (!currentUser) {
      console.log("No current user found");
      return;
    }
    console.log(
      "Attempting to connect with token:",
      token.substring(0, 10) + "..."
    );
  }, [token, currentUser]);

  // Only setup notification if we have both token and user
  useNotificationSetup(token && currentUser ? token : "", addNotification);

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const user = currentUser || null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Alumni":
        return "bg-blue-100 text-blue-800";
      case "Teacher":
        return "bg-green-100 text-green-800";
      case "Student":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FPT</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Alumni Connection</h1>
                <p className="text-xs text-gray-500">FPT University</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <Badge className={getRoleBadgeColor(user.roleName)}>
                  {user.roleName.toUpperCase()}
                </Badge>
                <NotificationBell />
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        // user?.avatar ||
                        "https://cdn.dribbble.com/users/13929796/avatars/normal/6d7cf73c0502578c420474f6adc6cc0d.png?1707433135"
                      }
                      alt={user?.firstName || ""}
                    />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user?.roleName === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                    isActive(item.href) && "bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              {user?.roleName === "Admin" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administration
                    </h3>
                  </div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                        isActive(item.href) && "bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              {user?.roleName === "Alumni" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Alumni
                    </h3>
                  </div>
                  {alumniNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                        isActive(item.href) && "bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              {user?.roleName === "Student" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student
                    </h3>
                  </div>
                  {studentNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                        isActive(item.href) && "bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-0">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
