import { useState, useEffect } from "react";
import { RecruiterInfo, User } from "@/types/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RecruiterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter?: RecruiterInfo;
  onSave: (param: any) => void | Promise<void>;
  user: User;
}

export function RecruiterDialog({
  isOpen,
  onOpenChange,
  recruiter,
  onSave,
  user,
}: RecruiterDialogProps) {
  const isEdit = !!recruiter;
  console.log("user: ", user);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [companyCertificateUrl, setCompanyCertificateUrl] = useState("");
  const [status, setStatus] = useState<string>("Pending");

  useEffect(() => {
    if (recruiter) {
      setCompanyName(recruiter.companyName || "");
      setCompanyEmail(recruiter.companyEmail || "");
      setCompanyPhone(recruiter.companyPhone || "");
      setCompanyLogoUrl(recruiter.companyLogoUrl || "");
      setCompanyCertificateUrl(recruiter.companyCertificateUrl || "");
      setStatus(recruiter.status?.toString() ?? "Pending");
    } else {
      setCompanyName("");
      setCompanyEmail("");
      setCompanyPhone("");
      setCompanyLogoUrl("");
      setCompanyCertificateUrl("");
      setStatus("Pending");
    }
  }, [recruiter, isOpen]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = () => {
    //edit
    if (isEdit && recruiter?.recruiterInfoId) {
      onSave({
        recruiterInfoId: recruiter.recruiterInfoId,
        status,
      });
      handleClose();
      return;
    }

    // create
    const errors = validateRecruiterForm();
    if (errors.length > 0) {
      toast("Thông tin không hợp lệ, vui lòng kiểm tra lại.");
      return;
    }
    const body = {
      status,
      companyName,
      companyEmail,
      companyPhone,
      companyLogoUrl,
      companyCertificateUrl,
    };

    onSave(body);
    handleClose();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "certificate"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      if (type === "logo") setCompanyLogoUrl("");
      if (type === "certificate") setCompanyCertificateUrl("");
      return;
    }

    if (type === "logo") {
      // only image
      if (file.type.startsWith("image/")) {
        setCompanyLogoUrl(URL.createObjectURL(file));
      } else {
        alert("Vui lòng chọn hình ảnh hợp lệ cho Logo.");
      }
    }

    if (type === "certificate") {
      // image or pdf
      if (file.type.startsWith("image/")) {
        setCompanyCertificateUrl(URL.createObjectURL(file));
      } else if (file.type === "application/pdf") {
        setCompanyCertificateUrl(URL.createObjectURL(file));
      } else {
        alert("Vui lòng chọn file ảnh hoặc PDF cho Giấy chứng nhận.");
      }
    }
  };
  // Validation function
  const validateRecruiterForm = () => {
    const errors: string[] = [];

    if (!companyName.trim()) {
      errors.push("Tên công ty không được để trống.");
    }
    if (!companyEmail.trim()) {
      errors.push("Email công ty không được để trống.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyEmail)) {
        errors.push("Vui lòng nhập email hợp lệ.");
      }
    }

    if (!companyPhone.trim()) {
      errors.push("Số điện thoại công ty không được để trống.");
    } else {
      const phoneRegex = /^[0-9]{1,11}$/;
      if (!phoneRegex.test(companyPhone)) {
        errors.push("Số điện thoại chỉ được chứa số và tối đa 11 ký tự.");
      }
    }

    if (!companyLogoUrl.trim()) {
      errors.push("Logo công ty không được để trống.");
    }

    if (!companyCertificateUrl.trim()) {
      errors.push("Giấy chứng nhận không được để trống.");
    }

    return errors;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Thông tin nhà tuyển dụng" : "Đăng ký nhà tuyển dụng"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Xem và cập nhật thông tin nhà tuyển dụng."
              : "Điền thông tin để đăng ký nhà tuyển dụng mới."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Company logo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Logo công ty (URL)
            </label>
            {!isEdit && (
              <div className="flex flex-col gap-2">
                <Input
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
              </div>
            )}

            {companyLogoUrl && (
              <img
                src={companyLogoUrl}
                alt="Logo"
                className="mt-2 h-16 w-16 object-contain rounded-md border"
              />
            )}
          </div>

          {/* Company name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tên công ty
            </label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nhập tên công ty"
              disabled={isEdit}
            />
          </div>

          {/* Company email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email công ty
            </label>

            <Input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="company@example.com"
              disabled={isEdit}
            />
          </div>

          {/* Company phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại công ty
            </label>
            <Input
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="0123456789"
              disabled={isEdit}
            />
          </div>

          {/* Certificate link */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Giấy chứng nhận (URL)
            </label>
            {!isEdit && (
              <div className="flex flex-col gap-2">
                <Input
                  value={companyCertificateUrl}
                  onChange={(e) => setCompanyCertificateUrl(e.target.value)}
                  placeholder="https://example.com/certificate.pdf"
                />
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, "certificate")}
                />
              </div>
            )}

            {companyCertificateUrl && (
              <a
                href={companyCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-blue-600 hover:underline text-sm font-medium"
              >
                Xem giấy chứng nhận
              </a>
            )}
          </div>

          {/* Status */}
          {user.roleName.toLowerCase() === "admin" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Trạng thái
              </label>
              <Select
                value={status}
                disabled={!isEdit}
                onValueChange={(value: any) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>{isEdit ? "Lưu" : "Tạo"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
