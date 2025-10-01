import { useState, useEffect, useCallback } from "react";
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
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { downscaleImage } from "@/lib/image";
import { Loader2 } from "lucide-react";

// Types
type FileType = "logo" | "certificate";
type RecruiterStatus = "Active" | "Suspended" | "Pending";

interface RecruiterFormData {
  userId: number;
  status: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLogoUrl: string;
  companyCertificateUrl: string;
}

interface RecruiterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter?: RecruiterInfo;
  onSave: (data: any) => void | Promise<void>;
  user: User;
  onUpdate?: (data: any) => void | Promise<void>;
}

// Constants
const INITIAL_FORM_STATE = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  companyLogoUrl: "",
  companyCertificateUrl: "",
  status: "Pending",
};

const FILE_UPLOAD_CONFIG = {
  logo: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    folder: "company-logos",
    acceptTypes: "image/*",
    errorMessage: "Vui lòng chọn hình ảnh hợp lệ cho Logo.",
    successMessage: "Logo đã được tải lên thành công!",
  },
  certificate: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.9,
    folder: "company-certificates",
    acceptTypes: "image/*,.pdf",
    errorMessage: "Vui lòng chọn file ảnh hoặc PDF cho Giấy chứng nhận.",
    successMessage: "Giấy chứng nhận đã được tải lên thành công!",
  },
};

const VALIDATION_RULES = [
  { field: "companyName", message: "Tên công ty không được để trống." },
  { field: "companyEmail", message: "Email công ty không được để trống." },
  {
    field: "companyPhone",
    message: "Số điện thoại công ty không được để trống.",
  },
  { field: "companyLogoUrl", message: "Logo công ty không được để trống." },
  {
    field: "companyCertificateUrl",
    message: "Giấy chứng nhận không được để trống.",
  },
];

export function RecruiterDialog({
  isOpen,
  onOpenChange,
  recruiter,
  onSave,
  onUpdate,
  user,
}: RecruiterDialogProps) {
  // State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [uploadingStates, setUploadingStates] = useState({
    logo: false,
    certificate: false,
  });

  const isEdit = !!recruiter;
  const isAdmin = user.roleName.toLowerCase() === "admin";
  const canEditFields = !isEdit || !isAdmin;

  // Effects
  useEffect(() => {
    if (recruiter && isOpen) {
      setFormData({
        companyName: recruiter.companyName || "",
        companyEmail: recruiter.companyEmail || "",
        companyPhone: recruiter.companyPhone || "",
        companyLogoUrl: recruiter.companyLogoUrl || "",
        companyCertificateUrl: recruiter.companyCertificateUrl || "",
        status: recruiter.status?.toString() ?? "Pending",
      });
    } else if (!recruiter && isOpen) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [recruiter, isOpen]);

  // Handlers
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  const handleStatusChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  }, []);

  const validateForm = useCallback((): string[] => {
    const errors: string[] = [];

    // Admin editing only validates status (which is always valid)
    if (isAdmin && isEdit) return errors;

    // Validate required fields for non-admin users
    VALIDATION_RULES.forEach(({ field, message }) => {
      if (!formData[field as keyof typeof formData].trim()) {
        errors.push(message);
      }
    });

    // Email format validation
    if (
      formData.companyEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)
    ) {
      errors.push("Vui lòng nhập email hợp lệ.");
    }

    return errors;
  }, [formData, isAdmin, isEdit]);

  const buildSubmissionData = useCallback(() => {
    if (isEdit && recruiter?.recruiterInfoId) {
      if (isAdmin) {
        // Admin updating status only
        return {
          recruiterInfoId: recruiter.recruiterInfoId,
          status: formData.status,
        };
      } else {
        // Recruiter updating their company information
        return {
          userId: user.userId,
          ...formData,
        };
      }
    } else {
      // Create new recruiter
      return {
        userId: user.userId,
        ...formData,
      };
    }
  }, [isEdit, recruiter, isAdmin, formData, user.userId]);

  const handleSubmit = useCallback(() => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error("Thông tin không hợp lệ, vui lòng kiểm tra lại.");
      return;
    }

    const submissionData = buildSubmissionData();
    const handler = isEdit && onUpdate ? onUpdate : onSave;
    handler(submissionData);
    handleClose();
  }, [
    validateForm,
    buildSubmissionData,
    isEdit,
    onUpdate,
    onSave,
    handleClose,
  ]);

  const isValidFile = useCallback((file: File, type: FileType): boolean => {
    const config = FILE_UPLOAD_CONFIG[type];
    return type === "logo"
      ? file.type.startsWith("image/")
      : file.type.startsWith("image/") || file.type === "application/pdf";
  }, []);

  const setUploadingState = useCallback((type: FileType, state: boolean) => {
    setUploadingStates((prev) => ({ ...prev, [type]: state }));
  }, []);

  const updateFileUrl = useCallback((type: FileType, url: string) => {
    const field = type === "logo" ? "companyLogoUrl" : "companyCertificateUrl";
    setFormData((prev) => ({ ...prev, [field]: url }));
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
      const file = e.target.files?.[0];
      if (!file) {
        updateFileUrl(type, "");
        return;
      }

      const config = FILE_UPLOAD_CONFIG[type];

      if (!isValidFile(file, type)) {
        toast.error(config.errorMessage);
        return;
      }

      try {
        setUploadingState(type, true);

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(file);
          updateFileUrl(type, previewUrl);
        }

        let cloudinaryUrl: string;

        if (file.type.startsWith("image/")) {
          const compressedBlob = await downscaleImage(file, {
            maxWidth: config.maxWidth,
            maxHeight: config.maxHeight,
            quality: config.quality,
          });
          cloudinaryUrl = await uploadImageToCloudinary(compressedBlob, {
            folder: config.folder,
          });
        } else {
          cloudinaryUrl = await uploadImageToCloudinary(file, {
            folder: config.folder,
          });
        }

        updateFileUrl(type, cloudinaryUrl);
        toast.success(config.successMessage);
      } catch (error: any) {
        toast.error(
          error?.message || "Tải file lên thất bại. Vui lòng thử lại."
        );
      } finally {
        setUploadingState(type, false);
      }
    },
    [isValidFile, setUploadingState, updateFileUrl]
  );

  const isUploading = uploadingStates.logo || uploadingStates.certificate;

  // Render helpers
  const renderFileUploadSection = (
    type: FileType,
    label: string,
    placeholder: string
  ) => {
    const config = FILE_UPLOAD_CONFIG[type];
    const isLogoType = type === "logo";
    const urlValue = isLogoType
      ? formData.companyLogoUrl
      : formData.companyCertificateUrl;
    const isUploadingFile = uploadingStates[type];

    return (
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        {canEditFields && (
          <div className="flex flex-col gap-2">
            <Input
              value={urlValue}
              onChange={handleInputChange(
                isLogoType ? "companyLogoUrl" : "companyCertificateUrl"
              )}
              placeholder={placeholder}
              disabled={isUploadingFile}
            />
            <div className="relative">
              <Input
                type="file"
                accept={config.acceptTypes}
                onChange={(e) => handleFileChange(e, type)}
                disabled={isUploadingFile}
              />
              {isUploadingFile && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-gray-600">
                    Đang tải lên...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {urlValue &&
          (isLogoType ? (
            <img
              src={urlValue}
              alt="Logo"
              className="mt-2 h-16 w-16 object-contain rounded-md border"
            />
          ) : (
            <a
              href={urlValue}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-blue-600 hover:underline text-sm font-medium"
            >
              Xem giấy chứng nhận
            </a>
          ))}
      </div>
    );
  };

  const renderFormField = (
    field: keyof typeof formData,
    label: string,
    placeholder: string,
    type: string = "text"
  ) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Input
        type={type}
        value={formData[field]}
        onChange={handleInputChange(field)}
        placeholder={placeholder}
        disabled={!canEditFields}
      />
    </div>
  );

  const renderStatusSection = () => {
    if (isAdmin) {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <Select
            value={formData.status}
            disabled={!isEdit}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (!isAdmin && isEdit) {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <Input value={formData.status} disabled className="bg-gray-100" />
          <p className="text-xs text-gray-500 mt-1">
            Chỉ quản trị viên mới có thể thay đổi trạng thái
          </p>
        </div>
      );
    }

    return null;
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
          {renderFileUploadSection(
            "logo",
            "Logo công ty (URL)",
            "https://example.com/logo.png"
          )}
          {renderFormField("companyName", "Tên công ty", "Nhập tên công ty")}
          {renderFormField(
            "companyEmail",
            "Email công ty",
            "company@example.com",
            "email"
          )}
          {renderFormField(
            "companyPhone",
            "Số điện thoại công ty",
            "0123456789"
          )}
          {renderFileUploadSection(
            "certificate",
            "Giấy chứng nhận (URL)",
            "https://example.com/certificate.pdf"
          )}
          {renderStatusSection()}
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang tải lên...
                </>
              ) : isEdit ? (
                "Lưu"
              ) : (
                "Tạo"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
