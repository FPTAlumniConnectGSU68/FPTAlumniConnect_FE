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
import { useAvatarImageStore, useGetUser } from "@/hooks/use-user";
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
  Inbox,
  GraduationCap,
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
  { name: "Hồ sơ", href: "/profile", icon: User },
  // { name: "Trò chuyện", href: "/chat", icon: MessageSquare },
];

const adminNavigation = [
  { name: "Trang chủ", href: "/admin/dashboard", icon: Home },
  { name: "Quản lý người dùng", href: "/admin/users-management", icon: Users },
  {
    name: "Quản lý bài viết",
    href: "/admin/posts-management",
    icon: MessageSquare,
  },
  {
    name: "Quản lý sự kiện",
    href: "/admin/events-management",
    icon: Calendar,
  },
  {
    name: "Yêu cầu mentor",
    href: "/admin/mentorship-requests",
    icon: UserCheck,
  },
  {
    name: "Quản lý tin tuyển dụng",
    href: "/admin/jobposts-management",
    icon: Briefcase,
  },
  {
    name: "Quản lý nhà tuyển dụng",
    href: "/admin/recruiters-management",
    icon: Inbox,
  },
  {
    name: "Mã ngành",
    href: "/admin/majorcodes",
    icon: GraduationCap,
  },
  {
    name: "Kỹ năng",
    href: "/admin/skills",
    icon: GraduationCap,
  },
  {
    name: "Cài đặt hệ thống",
    href: "/admin/settings",
    icon: Settings,
  },
];

const alumniNavigation = [
  // { name: "Cố vấn", href: "/alumni/mentoring", icon: UserCheck },
  {
    name: "Quản lý sự kiện",
    href: "/alumni/events-management",
    icon: Calendar,
  },
  { name: "Sơ yếu lý lịch", href: "/alumni/CV", icon: FileText },
  {
    name: "Quản lý tin tuyển dụng",
    href: "/alumni/jobpost-management",
    icon: Briefcase,
  },
];

const studentNavigation = [
  { name: "Sơ yếu lý lịch", href: "/student/CV", icon: FileText },
];

const recruiterNavigation = [
  {
    name: "Quản lý tin tuyển dụng",
    href: "/recruiter/jobpost-management",
    icon: Briefcase,
  },
];

export default function MainLayout({ children, currentUser }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { addNotification } = useNotificationStore();

  // Initialize SignalR connection using our new hook
  const token = Cookies.get("auth-token");
  const userId = currentUser?.userId ?? 0;

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

  // Fetch full user profile if we have an ID; always call hook with a number
  const { data: userData } = useGetUser(userId as number);
  const fetchedUser =
    userData?.status === "success" ? (userData?.data as any) : null;
  const displayUser = fetchedUser ?? currentUser ?? null;
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
    <div className=" bg-red-50 overflow-y-auto">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
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
            {displayUser && (
              <>
                <Badge className={getRoleBadgeColor(displayUser.roleName)}>
                  {displayUser.roleName.toUpperCase()}
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
                        useAvatarImageStore.getState().avatarImage ||
                        fetchedUser?.profilePicture ||
                        "https://cdn.dribbble.com/users/13929796/avatars/normal/6d7cf73c0502578c420474f6adc6cc0d.png?1707433135"
                      }
                      alt={
                        (displayUser?.firstName || "") +
                        (displayUser?.lastName || "")
                      }
                    />
                    <AvatarFallback>
                      {displayUser?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayUser?.firstName} {displayUser?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {displayUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                {displayUser?.roleName === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Trang chủ</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)] overflow-y-auto">
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${isActive(item.href) && "bg-gray-100"
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              {displayUser?.roleName === "Admin" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quản trị viên
                    </h3>
                  </div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${isActive(item.href) && "bg-gray-100"
                        }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              {displayUser?.roleName === "Alumni" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cựu sinh viên
                    </h3>
                  </div>
                  {alumniNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${isActive(item.href) && "bg-gray-100"
                        }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              {displayUser?.roleName === "Student" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Sinh viên
                    </h3>
                  </div>
                  {studentNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${isActive(item.href) && "bg-gray-100"
                        }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              {displayUser?.roleName === "Recruiter" && (
                <>
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nhà tuyển dụng
                    </h3>
                  </div>
                  {recruiterNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${isActive(item.href) && "bg-gray-100"
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

        <main className="flex-1 lg:ml-0 overflow-y-auto">
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
