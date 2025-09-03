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

const CVForm = memo(({ initialData, onSubmit, majorItems }: CVFormProps) => {
  // skills arae fetched inside SkillMultiSelect; we manage only selected skills here
  console.log("initialData", initialData);
  const normalizeCV = (data?: CV | null): CV => {
    const base: CV = data
      ? (data as CV)
      : {
          id: 0,
          userId: 0,
          fullName: "",
          address: "",
          birthday: "",
          gender: "",
          email: "",
          phone: "",
          city: "",
          company: "",
          primaryDuties: "",
          jobLevel: "",
          startAt: "",
          endAt: "",
          language: "",
          languageLevel: "",
          minSalary: 0,
          maxSalary: 0,
          isDeal: true,
          desiredJob: "",
          position: "",
          majorId: "",
          majorName: "",
          additionalContent: "",
          status: "Public" as CV["status"],
          skillIds: [],
          skillNames: [],
        };
    return {
      ...base,
      majorId:
        (base as any).majorId !== undefined
          ? String((base as any).majorId)
          : "",
      gender: base.gender ? base.gender.toLowerCase() : "",
    };
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

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    Object.entries(formData)
      .filter(([key]) => key !== "isDeal" && key !== "majorName")
      .forEach(([key, value]) => {
        if (!value && value !== 0) {
          newErrors[key] = `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } is required`;
        }
      });

    if (selectedSkills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }, [formData, selectedSkills]);

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
      [name]: value,
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
        };
        onSubmit(submissionData);
      }
    },
    [formData, selectedSkills, validateForm, onSubmit]
  );

  // Keep form prefill in sync if initialData changes (e.g., when clicking Edit)
  useEffect(() => {
    if (!initialData) return;
    const normalized = {
      ...(initialData as unknown as CV),
      majorId:
        (initialData as any).majorId !== undefined
          ? String((initialData as any).majorId)
          : "",
      gender: initialData.gender ? initialData.gender.toLowerCase() : "",
    } as CV;
    setFormData(normalized);

    const ids = (initialData as any).skillIds as number[] | undefined;
    const names = (initialData as any).skillNames as string[] | undefined;
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

        <div>
          <Label htmlFor="jobLevel">Cấp bậc</Label>
          <Input
            id="jobLevel"
            name="jobLevel"
            value={formData.jobLevel}
            onChange={handleInputChange}
            placeholder="VD: Junior / Mid / Senior"
            aria-invalid={!!errors.jobLevel}
            className={
              errors.jobLevel
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.jobLevel && (
            <span className="text-sm text-destructive">{errors.jobLevel}</span>
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
          value={formData.majorId}
          onValueChange={(value) => handleSelectChange("majorId", value)}
          defaultValue={formData.majorId}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Công ty</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="VD: FPT Software"
            aria-invalid={!!errors.company}
            className={
              errors.company
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.company && (
            <span className="text-sm text-destructive">{errors.company}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startAt">Ngày bắt đầu</Label>
          <Input
            id="startAt"
            name="startAt"
            type="date"
            value={
              formData.startAt
                ? new Date(formData.startAt).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            aria-invalid={!!errors.startAt}
            className={
              errors.startAt
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.startAt && (
            <span className="text-sm text-destructive">{errors.startAt}</span>
          )}
        </div>

        <div>
          <Label htmlFor="endAt">Ngày kết thúc</Label>
          <Input
            id="endAt"
            name="endAt"
            type="date"
            value={
              formData.endAt
                ? new Date(formData.endAt).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            aria-invalid={!!errors.endAt}
            className={
              errors.endAt
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.endAt && (
            <span className="text-sm text-destructive">{errors.endAt}</span>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="primaryDuties">Nhiệm vụ chính</Label>
        <Textarea
          id="primaryDuties"
          name="primaryDuties"
          value={formData.primaryDuties}
          onChange={handleInputChange}
          placeholder="Mô tả ngắn gọn trách nhiệm và thành tựu"
          aria-invalid={!!errors.primaryDuties}
          className={
            errors.primaryDuties
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.primaryDuties && (
          <span className="text-sm text-destructive">
            {errors.primaryDuties}
          </span>
        )}
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
    </form>
  );
});

export default CVForm;
