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
import { useState, useCallback, useMemo, memo } from "react";
import { toast } from "sonner";

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

  const [formData, setFormData] = useState<CV>(
    initialData || {
      id: 0,
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
      additionalContent: "",
      status: "Public",
      majorId: "",
      majorName: "",
      skillIds: [],
      skillNames: [],
      userId: 0,
    }
  );

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
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

  return (
    <form id="cv-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <span className="text-sm text-red-500">{errors.fullName}</span>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-sm text-red-500">{errors.gender}</span>
          )}
        </div>

        <div>
          <Label htmlFor="birthday">Birthday</Label>
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
            className={errors.birthday ? "border-red-500" : ""}
          />
          {errors.birthday && (
            <span className="text-sm text-red-500">{errors.birthday}</span>
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
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone}</span>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <span className="text-sm text-red-500">{errors.status}</span>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <span className="text-sm text-red-500">{errors.address}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <CitySelect
            value={formData.city}
            onValueChange={(value) => handleSelectChange("city", value)}
          />
          {errors.city && (
            <span className="text-sm text-red-500">{errors.city}</span>
          )}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={errors.company ? "border-red-500" : ""}
          />
          {errors.company && (
            <span className="text-sm text-red-500">{errors.company}</span>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="desiredJob">Desired Job</Label>
        <Input
          id="desiredJob"
          name="desiredJob"
          value={formData.desiredJob}
          onChange={handleInputChange}
          className={errors.desiredJob ? "border-red-500" : ""}
        />
        {errors.desiredJob && (
          <span className="text-sm text-red-500">{errors.desiredJob}</span>
        )}
      </div>
      <div>
        <Label htmlFor="majorId">Major</Label>
        <Select
          value={formData.majorId}
          onValueChange={(value) => handleSelectChange("majorId", value)}
          defaultValue={formData.majorId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select major" />
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
          <span className="text-sm text-red-500">{errors.majorId}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={errors.position ? "border-red-500" : ""}
          />
          {errors.position && (
            <span className="text-sm text-red-500">{errors.position}</span>
          )}
        </div>

        <div>
          <Label htmlFor="jobLevel">Job Level</Label>
          <Input
            id="jobLevel"
            name="jobLevel"
            value={formData.jobLevel}
            onChange={handleInputChange}
            className={errors.jobLevel ? "border-red-500" : ""}
          />
          {errors.jobLevel && (
            <span className="text-sm text-red-500">{errors.jobLevel}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startAt">Start Date</Label>
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
            className={errors.startAt ? "border-red-500" : ""}
          />
          {errors.startAt && (
            <span className="text-sm text-red-500">{errors.startAt}</span>
          )}
        </div>

        <div>
          <Label htmlFor="endAt">End Date</Label>
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
            className={errors.endAt ? "border-red-500" : ""}
          />
          {errors.endAt && (
            <span className="text-sm text-red-500">{errors.endAt}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className={errors.language ? "border-red-500" : ""}
          />
          {errors.language && (
            <span className="text-sm text-red-500">{errors.language}</span>
          )}
        </div>

        <div>
          <Label htmlFor="languageLevel">Language Level</Label>
          <Input
            id="languageLevel"
            name="languageLevel"
            value={formData.languageLevel}
            onChange={handleInputChange}
            className={errors.languageLevel ? "border-red-500" : ""}
          />
          {errors.languageLevel && (
            <span className="text-sm text-red-500">{errors.languageLevel}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <SkillMultiSelect
          value={selectedSkills}
          onChange={handleSkillsChange}
        />
        {errors.skills && (
          <span className="text-sm text-red-500">{errors.skills}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minSalary">Min Salary</Label>
          <Input
            id="minSalary"
            name="minSalary"
            type="number"
            value={formData.minSalary}
            onChange={handleInputChange}
            className={errors.minSalary ? "border-red-500" : ""}
          />
          {errors.minSalary && (
            <span className="text-sm text-red-500">{errors.minSalary}</span>
          )}
        </div>
        <div>
          <Label htmlFor="maxSalary">Max Salary</Label>
          <Input
            id="maxSalary"
            name="maxSalary"
            type="number"
            value={formData.maxSalary}
            onChange={handleInputChange}
            className={errors.maxSalary ? "border-red-500" : ""}
          />
          {errors.maxSalary && (
            <span className="text-sm text-red-500">{errors.maxSalary}</span>
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
        <Label htmlFor="isDeal">Negotiable salary</Label>
      </div>

      <div>
        <Label htmlFor="primaryDuties">Primary Duties</Label>
        <Textarea
          id="primaryDuties"
          name="primaryDuties"
          value={formData.primaryDuties}
          onChange={handleInputChange}
          className={errors.primaryDuties ? "border-red-500" : ""}
        />
        {errors.primaryDuties && (
          <span className="text-sm text-red-500">{errors.primaryDuties}</span>
        )}
      </div>

      <div>
        <Label htmlFor="additionalContent">Additional Information</Label>
        <Textarea
          id="additionalContent"
          name="additionalContent"
          value={formData.additionalContent}
          onChange={handleInputChange}
          className={`h-24 ${errors.additionalContent ? "border-red-500" : ""}`}
        />
        {errors.additionalContent && (
          <span className="text-sm text-red-500">
            {errors.additionalContent}
          </span>
        )}
      </div>
    </form>
  );
});

export default CVForm;
