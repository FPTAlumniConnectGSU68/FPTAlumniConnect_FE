"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface GuestLoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function GuestLoginPrompt({
  isOpen,
  onClose,
  title = "Yêu cầu đăng nhập",
  description = "Bạn cần đăng nhập để truy cập tính năng này",
  actionText = "tính năng này",
}: GuestLoginPromptProps) {
  const router = useRouter();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Lock className="h-5 w-5 text-blue-600" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {description}
            </DialogDescription>
          </DialogHeader>

          <Card className="border-blue-100 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900">
                Tham gia kết nối FPT Alumni
              </CardTitle>
              <CardDescription className="text-blue-700">
                Kết nối với hàng ngàn sinh viên FPT University trên thế giới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Đăng nhập để tiếp tục
              </Button>
              <Button
                onClick={() => router.push("/register")}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tạo tài khoản mới
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Đăng nhập để truy cập {actionText} và kết nối với cộng đồng FPT
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
