"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Major } from "@/hooks/use-major-codes";
import { CV, Skill } from "@/types/interfaces";
import SkillMultiSelect from "@/components/ui/skill-multi-select";
import { CitySelect } from "@/components/ui/city-select";
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CVFormProps {
  initialData?: CV | null;
  onSubmit: (data: CV) => void;
  majorItems: Major[];
}

interface FormErrors {
  [key: string]: string;
}

type EmploymentHistory = {
  companyName: string;
  primaryDuties: string;
  jobLevel: string;
  startDate: string;
  endDate: string | null;
  isCurrentJob: boolean;
};

const CVForm = memo(({ initialData, onSubmit, majorItems }: CVFormProps) => {
  // skills arae fetched inside SkillMultiSelect; we manage only selected skills here
  console.log("initialData", initialData);
  const normalizeCV = (data?: CV | null): CV => {
    if (data) {
      return {
        ...data,
        majorId:
          typeof data.majorId === "string"
            ? parseInt(data.majorId) || 0
            : data.majorId,
        gender: data.gender ? data.gender.toLowerCase() : "",
      };
    }

    // Default CV structure
    return {
      id: 0,
      userId: 0,
      fullName: "",
      address: "",
      birthday: "",
      gender: "",
      email: "",
      phone: "",
      city: "",
      employmentHistories: [
        {
          cvId: 0,
          companyName: "",
          primaryDuties: "",
          jobLevel: "",
          startDate: "",
          endDate: null,
          isCurrentJob: false,
        },
      ],
      language: "",
      languageLevel: "",
      minSalary: 0,
      maxSalary: 0,
      isDeal: true,
      desiredJob: "",
      position: "",
      majorId: 0,
      majorName: "",
      additionalContent: "",
      status: "Public" as CV["status"],
      skillIds: [],
      skillNames: [],
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: 0,
      educationDescription: "",
      startAt: "",
      endAt: "",
    } as unknown as CV;
  };

  const [formData, setFormData] = useState<CV>(normalizeCV(initialData));

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(() => {
    if (!initialData) return [];
    const ids = (initialData as any).skillIds as number[] | undefined;
    const names = (initialData as any).skillNames as string[] | undefined;
    if (!ids || ids.length === 0) return [];
    return ids.map((id, idx) => ({
      skillId: id,
      name: names && names[idx] ? names[idx] : String(id),
      createdAt: "",
      updatedAt: "",
    })) as Skill[];
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const initialHistories = useMemo<EmploymentHistory[]>(() => {
    if (
      initialData?.employmentHistories &&
      Array.isArray(initialData.employmentHistories) &&
      initialData.employmentHistories.length > 0
    ) {
      return initialData.employmentHistories.map((h) => ({
        companyName: h.companyName || "",
        primaryDuties: h.primaryDuties || "",
        jobLevel: h.jobLevel || "",
        startDate: h.startDate || "",
        endDate: h.endDate || "",
        isCurrentJob: !!h.isCurrentJob,
      }));
    }

    return [
      {
        companyName: "",
        primaryDuties: "",
        jobLevel: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
      },
    ];
  }, [initialData]);

  const [employmentHistories, setEmploymentHistories] =
    useState<EmploymentHistory[]>(initialHistories);

  const [education, setEducation] = useState({
    schoolName: (initialData as any)?.schoolName || "",
    degree: (initialData as any)?.degree || "",
    fieldOfStudy: (initialData as any)?.fieldOfStudy || "",
    graduationYear:
      (initialData as any)?.graduationYear !== undefined
        ? String((initialData as any)?.graduationYear)
        : "",
    educationDescription: (initialData as any)?.educationDescription || "",
  });

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    // Validate basic form fields (exclude non-required fields)
    const requiredFields = [
      "fullName",
      "address",
      "birthday",
      "gender",
      "email",
      "phone",
      "city",
      "language",
      "languageLevel",
      "desiredJob",
      "position",
      "majorId",
      "additionalContent",
    ];

    requiredFields.forEach((key) => {
      const value = formData[key as keyof CV];
      if (!value && value !== 0) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    // Validate employment histories
    if (!employmentHistories || employmentHistories.length === 0) {
      newErrors["employmentHistories"] =
        "At least one employment history is required";
    } else {
      employmentHistories.forEach((h, idx) => {
        if (!h.companyName?.trim())
          newErrors[`employmentHistories.${idx}.companyName`] =
            "Company name is required";
        if (!h.jobLevel?.trim())
          newErrors[`employmentHistories.${idx}.jobLevel`] =
            "Job level is required";
        if (!h.startDate)
          newErrors[`employmentHistories.${idx}.startDate`] =
            "Start date is required";
        if (!h.isCurrentJob && !h.endDate)
          newErrors[`employmentHistories.${idx}.endDate`] =
            "End date is required unless current job";
      });
    }

    // Validate education
    if (!education.schoolName?.trim())
      newErrors["schoolName"] = "School name is required";
    if (!education.degree?.trim()) newErrors["degree"] = "Degree is required";
    if (!education.fieldOfStudy?.trim())
      newErrors["fieldOfStudy"] = "Field of study is required";
    if (!education.graduationYear?.toString().trim())
      newErrors["graduationYear"] = "Graduation year is required";

    if (selectedSkills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }, [formData, selectedSkills, employmentHistories, education]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else if (type === "number") {
        setFormData((prev) => ({
          ...prev,
          [name]: value ? parseInt(value, 10) : 0,
        }));
      } else if (type === "date") {
        setFormData((prev) => ({
          ...prev,
          [name]: value
            ? new Date(value).toISOString()
            : new Date().toISOString(),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      if (value) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "majorId" ? parseInt(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSkillsChange = useCallback((skills: Skill[]) => {
    setSelectedSkills(skills);
    setErrors((prev) => ({ ...prev, skills: "" }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        const submissionData = {
          ...formData,
          skillIds: selectedSkills.map((s) => s.skillId),
          employmentHistories: employmentHistories.map((h) => ({
            cvId: formData.id || 0,
            companyName: h.companyName,
            primaryDuties: h.primaryDuties,
            jobLevel: h.jobLevel,
            startDate: h.startDate,
            endDate: h.isCurrentJob ? null : h.endDate,
            isCurrentJob: h.isCurrentJob,
          })),
          schoolName: education.schoolName,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          graduationYear: education.graduationYear
            ? Number(education.graduationYear)
            : undefined,
          educationDescription: education.educationDescription,
        };
        onSubmit(submissionData as unknown as CV);
      }
    },
    [
      formData,
      selectedSkills,
      employmentHistories,
      education,
      validateForm,
      onSubmit,
    ]
  );

  // Keep form prefill in sync if initialData changes (e.g., when clicking Edit)
  useEffect(() => {
    if (!initialData) return;
    const normalized = normalizeCV(initialData);
    setFormData(normalized);

    const ids = initialData.skillIds as number[] | undefined;
    const names = initialData.skillNames as string[] | undefined;
    const preselected = ids
      ? (ids.map((id, idx) => ({
          skillId: id,
          name: names && names[idx] ? names[idx] : String(id),
          createdAt: "",
          updatedAt: "",
        })) as Skill[])
      : [];
    setSelectedSkills(preselected);
  }, [initialData]);

  const addHistory = () => {
    setEmploymentHistories((prev) => [
      ...prev,
      {
        companyName: "",
        jobLevel: "",
        primaryDuties: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
      },
    ]);
  };

  const removeHistory = (index: number) => {
    setEmploymentHistories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateHistory = (
    index: number,
    field: keyof EmploymentHistory,
    value: string | boolean | null
  ) => {
    setEmploymentHistories((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              ...(field === "isCurrentJob" && value === true
                ? { endDate: null }
                : {}),
            }
          : item
      )
    );
    setErrors((prev) => ({
      ...prev,
      [`employmentHistories.${index}.${String(field)}`]: "",
    }));
  };

  return (
    <form id="cv-form" onSubmit={handleSubmit} className=" max-w-4xl space-y-6">
      <div className="text-base md:text-lg font-semibold text-primary">
        1. Thông tin cá nhân
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="VD: Nguyễn Văn A"
            aria-invalid={!!errors.fullName}
            className={
              errors.fullName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.fullName && (
            <span className="text-sm text-destructive">{errors.fullName}</span>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-sm text-destructive">{errors.gender}</span>
          )}
        </div>

        <div>
          <Label htmlFor="birthday">Ngày sinh</Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={
              formData.birthday
                ? new Date(formData.birthday).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            aria-invalid={!!errors.birthday}
            className={
              errors.birthday
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.birthday && (
            <span className="text-sm text-destructive">{errors.birthday}</span>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <span className="text-sm text-destructive">{errors.email}</span>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="VD: 0912 345 678"
            aria-invalid={!!errors.phone}
            className={
              errors.phone
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.phone && (
            <span className="text-sm text-destructive">{errors.phone}</span>
          )}
        </div>

        <div>
          <Label htmlFor="city">Thành phố</Label>
          <CitySelect
            value={formData.city}
            onValueChange={(value) => handleSelectChange("city", value)}
          />
          {errors.city && (
            <span className="text-sm text-destructive">{errors.city}</span>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Số nhà, đường, phường/xã, quận/huyện"
          aria-invalid={!!errors.address}
          className={
            errors.address
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.address && (
          <span className="text-sm text-destructive">{errors.address}</span>
        )}
      </div>
      <div className="text-base md:text-lg font-semibold text-primary">
        2. Vị trí ứng tuyển
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Chức vụ</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="VD: Frontend Developer"
            aria-invalid={!!errors.position}
            className={
              errors.position
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.position && (
            <span className="text-sm text-destructive">{errors.position}</span>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="desiredJob">Vị trí mong muốn</Label>
        <Input
          id="desiredJob"
          name="desiredJob"
          value={formData.desiredJob}
          onChange={handleInputChange}
          placeholder="VD: React Native, Backend .NET, QA..."
          aria-invalid={!!errors.desiredJob}
          className={
            errors.desiredJob
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.desiredJob && (
          <span className="text-sm text-destructive">{errors.desiredJob}</span>
        )}
      </div>
      <div className="text-base md:text-lg font-semibold text-primary">
        3. Học vấn và Kỹ năng
      </div>
      <div>
        <Label htmlFor="majorId">Chuyên ngành</Label>
        <Select
          value={formData.majorId.toString()}
          onValueChange={(value) => handleSelectChange("majorId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn chuyên ngành" />
          </SelectTrigger>
          <SelectContent>
            {majorItems.map((major) => (
              <SelectItem key={major.majorId} value={major.majorId.toString()}>
                {major.majorName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.majorId && (
          <span className="text-sm text-destructive">{errors.majorId}</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="language">Ngôn ngữ</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="VD: English / Japanese / ..."
            aria-invalid={!!errors.language}
            className={
              errors.language
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.language && (
            <span className="text-sm text-destructive">{errors.language}</span>
          )}
        </div>

        <div>
          <Label htmlFor="languageLevel">Cấp bậc ngôn ngữ</Label>
          <Input
            id="languageLevel"
            name="languageLevel"
            value={formData.languageLevel}
            onChange={handleInputChange}
            placeholder="VD: IELTS 7.0, JLPT N2..."
            aria-invalid={!!errors.languageLevel}
            className={
              errors.languageLevel
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.languageLevel && (
            <span className="text-sm text-destructive">
              {errors.languageLevel}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Kỹ năng</Label>
        <SkillMultiSelect
          value={selectedSkills}
          onChange={handleSkillsChange}
        />
        {errors.skills && (
          <span className="text-sm text-destructive">{errors.skills}</span>
        )}
      </div>

      <div className="text-base md:text-lg font-semibold text-primary">
        4. Kinh nghiệm làm việc
      </div>

      <div className="space-y-4">
        {employmentHistories.map((h, idx) => (
          <div key={idx} className="rounded-md border p-4 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="font-medium">Kinh nghiệm #{idx + 1}</div>
              {employmentHistories.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeHistory(idx)}
                >
                  Xóa
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Công ty</Label>
                <Input
                  value={h.companyName}
                  onChange={(e) =>
                    updateHistory(idx, "companyName", e.target.value)
                  }
                  placeholder="VD: FPT Software"
                  aria-invalid={
                    !!errors[`employmentHistories.${idx}.companyName`]
                  }
                  className={
                    errors[`employmentHistories.${idx}.companyName`]
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[`employmentHistories.${idx}.companyName`] && (
                  <span className="text-sm text-destructive">
                    {errors[`employmentHistories.${idx}.companyName`]}
                  </span>
                )}
              </div>
              <div>
                <Label>Cấp bậc</Label>
                <Input
                  value={h.jobLevel}
                  onChange={(e) =>
                    updateHistory(idx, "jobLevel", e.target.value)
                  }
                  placeholder="VD: Junior / Mid / Senior"
                  aria-invalid={!!errors[`employmentHistories.${idx}.jobLevel`]}
                  className={
                    errors[`employmentHistories.${idx}.jobLevel`]
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[`employmentHistories.${idx}.jobLevel`] && (
                  <span className="text-sm text-destructive">
                    {errors[`employmentHistories.${idx}.jobLevel`]}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={
                    h.startDate
                      ? new Date(h.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateHistory(
                      idx,
                      "startDate",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : ""
                    )
                  }
                  aria-invalid={
                    !!errors[`employmentHistories.${idx}.startDate`]
                  }
                  className={
                    errors[`employmentHistories.${idx}.startDate`]
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[`employmentHistories.${idx}.startDate`] && (
                  <span className="text-sm text-destructive">
                    {errors[`employmentHistories.${idx}.startDate`]}
                  </span>
                )}
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input
                  type="date"
                  disabled={h.isCurrentJob}
                  value={
                    h.endDate
                      ? new Date(h.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateHistory(
                      idx,
                      "endDate",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null
                    )
                  }
                  aria-invalid={!!errors[`employmentHistories.${idx}.endDate`]}
                  className={
                    errors[`employmentHistories.${idx}.endDate`]
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[`employmentHistories.${idx}.endDate`] && (
                  <span className="text-sm text-destructive">
                    {errors[`employmentHistories.${idx}.endDate`]}
                  </span>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id={`isCurrentJob-${idx}`}
                    type="checkbox"
                    checked={h.isCurrentJob}
                    onChange={(e) =>
                      updateHistory(idx, "isCurrentJob", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`isCurrentJob-${idx}`}>Đang làm việc</Label>
                </div>
              </div>
            </div>
            <div>
              <Label>Nhiệm vụ chính</Label>
              <Textarea
                value={h.primaryDuties}
                onChange={(e) =>
                  updateHistory(idx, "primaryDuties", e.target.value)
                }
                placeholder="Mô tả ngắn gọn trách nhiệm và thành tựu"
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addHistory}>
          Thêm kinh nghiệm
        </Button>
      </div>

      <div className="text-base md:text-lg font-semibold text-primary">
        5. Mức lương mong muốn
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minSalary">Mức lương tối thiểu</Label>
          <Input
            id="minSalary"
            name="minSalary"
            type="number"
            value={formData.minSalary}
            onChange={handleInputChange}
            placeholder="VD: 15000000"
            aria-invalid={!!errors.minSalary}
            className={
              errors.minSalary
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.minSalary && (
            <span className="text-sm text-destructive">{errors.minSalary}</span>
          )}
        </div>
        <div>
          <Label htmlFor="maxSalary">Mức lương tối đa</Label>
          <Input
            id="maxSalary"
            name="maxSalary"
            type="number"
            value={formData.maxSalary}
            onChange={handleInputChange}
            placeholder="VD: 30000000"
            aria-invalid={!!errors.maxSalary}
            className={
              errors.maxSalary
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.maxSalary && (
            <span className="text-sm text-destructive">{errors.maxSalary}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isDeal"
          name="isDeal"
          type="checkbox"
          checked={formData.isDeal}
          onChange={handleInputChange}
          className="h-4 w-4"
        />
        <Label htmlFor="isDeal">Thỏa thuận lương</Label>
      </div>

      <div className="text-base md:text-lg font-semibold text-primary">
        6. Thông tin bổ sung
      </div>

      <div>
        <Label htmlFor="status">Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <span className="text-sm text-destructive">{errors.status}</span>
        )}
      </div>

      <div>
        <Label htmlFor="additionalContent">Thông tin bổ sung</Label>
        <Textarea
          id="additionalContent"
          name="additionalContent"
          value={formData.additionalContent}
          onChange={handleInputChange}
          placeholder="Bằng cấp, chứng chỉ, link portfolio..."
          aria-invalid={!!errors.additionalContent}
          className={`h-24 ${
            errors.additionalContent
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
        />
        {errors.additionalContent && (
          <span className="text-sm text-destructive">
            {errors.additionalContent}
          </span>
        )}
      </div>

      <div className="text-base md:text-lg font-semibold text-primary">
        7. Thông tin học vấn
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Trường</Label>
          <Input
            value={education.schoolName}
            onChange={(e) => {
              setEducation((prev) => ({ ...prev, schoolName: e.target.value }));
              setErrors((prev) => ({ ...prev, schoolName: "" }));
            }}
            placeholder="VD: Đại học FPT"
            aria-invalid={!!errors.schoolName}
            className={
              errors.schoolName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.schoolName && (
            <span className="text-sm text-destructive">
              {errors.schoolName}
            </span>
          )}
        </div>
        <div>
          <Label>Bằng cấp</Label>
          <Input
            value={education.degree}
            onChange={(e) => {
              setEducation((prev) => ({ ...prev, degree: e.target.value }));
              setErrors((prev) => ({ ...prev, degree: "" }));
            }}
            placeholder="VD: Cử nhân"
            aria-invalid={!!errors.degree}
            className={
              errors.degree
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.degree && (
            <span className="text-sm text-destructive">{errors.degree}</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Chuyên ngành</Label>
          <Input
            value={education.fieldOfStudy}
            onChange={(e) => {
              setEducation((prev) => ({
                ...prev,
                fieldOfStudy: e.target.value,
              }));
              setErrors((prev) => ({ ...prev, fieldOfStudy: "" }));
            }}
            placeholder="VD: Khoa học máy tính"
            aria-invalid={!!errors.fieldOfStudy}
            className={
              errors.fieldOfStudy
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.fieldOfStudy && (
            <span className="text-sm text-destructive">
              {errors.fieldOfStudy}
            </span>
          )}
        </div>
        <div>
          <Label>Năm tốt nghiệp</Label>
          <Input
            type="number"
            value={education.graduationYear}
            onChange={(e) => {
              setEducation((prev) => ({
                ...prev,
                graduationYear: e.target.value,
              }));
              setErrors((prev) => ({ ...prev, graduationYear: "" }));
            }}
            placeholder="VD: 2025"
            aria-invalid={!!errors.graduationYear}
            className={
              errors.graduationYear
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.graduationYear && (
            <span className="text-sm text-destructive">
              {errors.graduationYear}
            </span>
          )}
        </div>
      </div>
      <div>
        <Label>Mô tả học vấn</Label>
        <Textarea
          value={education.educationDescription}
          onChange={(e) =>
            setEducation((prev) => ({
              ...prev,
              educationDescription: e.target.value,
            }))
          }
          placeholder="Thành tích, dự án, hoạt động..."
        />
      </div>
    </form>
  );
});

export default CVForm;
