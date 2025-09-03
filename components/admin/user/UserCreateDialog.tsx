import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { Major } from "@/hooks/use-major-codes";
import { UserCreateParams } from "@/hooks/use-user";
import { useState } from "react";

const UserCreateDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  majors,
  isLoading,
  code,
  setCode,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  roleId,
  setRoleId,
  majorId,
  setMajorId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: UserCreateParams) => void;
  majors: ApiResponse<PaginatedData<Major>> | undefined;
  isLoading: boolean;
  code: string;
  setCode: (code: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  roleId: string;
  setRoleId: (roleId: string) => void;
  majorId: string;
  setMajorId: (majorId: string) => void;
}) => {
  const majorItems =
    majors?.status === "success" ? majors.data?.items ?? [] : [];
  const majorOptions = majorItems.map((major) => ({
    value: major.majorId.toString(),
    label: major.majorName,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo người dùng</DialogTitle>
          <DialogDescription>
            Tạo người dùng với các thông tin sau.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Mã</Label>
            <Input
              id="code"
              placeholder="Nhập mã"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="firstName">Tên</Label>
            <Input
              id="firstName"
              placeholder="Nhập tên"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Họ</Label>
            <Input
              id="lastName"
              placeholder="Nhập họ"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roleId">Vai trò</Label>
            <Select value={roleId} onValueChange={(value) => setRoleId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Recruiter</SelectItem>
                <SelectItem value="5">Lecturer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="majorId">Chuyên ngành</Label>
            <Select
              value={majorId}
              onValueChange={(value) => setMajorId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                {majorOptions.map((major) => (
                  <SelectItem key={major.value} value={major.value}>
                    {major.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() =>
              onSubmit({
                code: code,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                roleId: Number(roleId),
                majorId: Number(majorId),
              })
            }
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateDialog;
