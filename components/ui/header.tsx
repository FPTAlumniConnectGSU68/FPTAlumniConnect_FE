"use client";

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
import { useGetUser } from "@/hooks/use-user";
import { getRoleBadgeColor } from "@/utils/get-role-badge-color";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notification/notification-bell";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Trang chủ",
  },
  {
    href: "/mentoring",
    label: "Cố vấn",
  },
  {
    href: "/jobs",
    label: "Tuyển dụng",
  },
  {
    href: "/events",
    label: "Sự kiện",
  },

  {
    href: "/forums",
    label: "Bài viết",
  },
];

type UserMenuProps = {
  user: any;
  userUnique: any;
  logout: () => void;
};

const UserMenu = ({ user, userUnique, logout }: UserMenuProps) => {
  const isAdmin = String(user?.roleName || "").toLowerCase() === "admin";
  const firstName = userUnique?.firstName || "";
  const lastName = userUnique?.lastName || "";
  const email = userUnique?.email || "";
  const initial = (firstName || lastName || "U").charAt(0);

  return (
    <div className="flex items-center gap-3">
      <Badge className={getRoleBadgeColor(user?.roleName)}>
        {String(user?.roleName || "").toUpperCase()}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userUnique?.profilePicture || "/placeholder.svg"}
                alt={firstName}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-900">
                {firstName} {lastName}
              </p>
              <p className="text-xs leading-none text-gray-500">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Trang tổng quan</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const userId = user?.userId ?? 0;
  const { data: userData } = useGetUser(userId);
  const userUnique = userData?.status === "success" && userData?.data;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FPT</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">
                Alumni Connection
              </h1>
              <p className="text-xs text-gray-500">FPT University</p>
            </div>
          </Link>
          {/*------------ navigation ------------ */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/*----------------------- */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <UserMenu user={user} userUnique={userUnique} logout={logout} />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => router.push("/register")}
                >
                  Tham gia
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
