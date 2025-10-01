"use client";

import { Button } from "@/components/ui/button";
import { CitySelect } from "@/components/ui/city-select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SkillMultiSelect from "@/components/ui/skill-multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { useSkills } from "@/hooks/use-skills";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { JobPost, Skill } from "@/types/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    jobTitle: z.string().min(1, "Required Job Title"),
    jobDescription: z.string().min(1, "Required Job Description"),
    minSalary: z.coerce.number().nonnegative(),
    maxSalary: z.coerce.number().nonnegative(),
    recruitmentQuantity: z.coerce.number().int().nonnegative(),
    workType: z.string().min(1, "Required Work Type"),
    workHours: z.string().min(1, "Required Work Hours"),
    isDeal: z.boolean().default(false),
    location: z.string().min(1, "Required Location"),
    city: z.string().min(1, "Required City"),
    requirements: z.string().min(1, "Required Requirements"),
    benefits: z.string().min(1, "Required Benefits"),
    time: z.string().min(1, "Required Time"),
    status: z.string().min(1, "Required Status"),
    email: z.string().email("Invalid email"),
    majorId: z.coerce.number().int().nonnegative(),
    skillIds: z.array(z.coerce.number().int().nonnegative()).default([]),
  })
  .refine((data) => data.maxSalary === 0 || data.maxSalary >= data.minSalary, {
    message: "Max salary must be greater than or equal to min salary",
    path: ["maxSalary"],
  });

type FormValues = z.infer<typeof schema>;

interface JobPostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPost: JobPost | null;
  mode: "view" | "edit";
}

export function JobPostEditDialog({
  open,
  onOpenChange,
  jobPost,
  mode,
}: JobPostEditDialogProps) {
  const queryClient = useQueryClient();
  const { data: skillsData } = useSkills({ page: 1, size: 300 });
  const { data: majorsData } = useMajorCodes({
    query: {
      Size: "300",
    },
  });

  const statusItems = {
    Open: "Open",
    Closed: "Closed",
    Deleted: "Deleted",
  };

  // Memoize derived data
  const skillItems = useMemo(
    () =>
      skillsData && isApiSuccess(skillsData)
        ? skillsData.data?.items ?? []
        : [],
    [skillsData]
  );

  const majorItems = useMemo(
    () =>
      majorsData && isApiSuccess(majorsData)
        ? majorsData.data?.items ?? []
        : [],
    [majorsData]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      minSalary: 0,
      maxSalary: 0,
      recruitmentQuantity: 0,
      workType: "",
      workHours: "",
      isDeal: false,
      location: "",
      city: "",
      requirements: "",
      benefits: "",
      time: new Date().toISOString(),
      status: statusItems.Open,
      email: "",
      majorId: 0,
      skillIds: [],
    },
  });

  const selectedSkillIds = watch("skillIds");
  const selectedSkills = useMemo(
    () =>
      (skillItems as any[]).filter((s) =>
        (selectedSkillIds || []).includes(s.skillId)
      ),
    [skillItems, selectedSkillIds]
  );

  const timeValue = watch("time");
  const dateObj = useMemo(
    () => (timeValue ? new Date(timeValue) : undefined),
    [timeValue]
  );

  // Populate form when jobPost changes
  useEffect(() => {
    if (jobPost && open) {
      reset({
        jobTitle: jobPost.jobTitle || "",
        jobDescription: jobPost.jobDescription || "",
        minSalary: jobPost.minSalary || 0,
        maxSalary: jobPost.maxSalary || 0,
        recruitmentQuantity: jobPost.recruitmentQuantity || 0,
        workType: jobPost.workType || "",
        workHours: jobPost.workHours || "",
        isDeal: jobPost.isDeal || false,
        location: jobPost.location || "",
        city: jobPost.city || "",
        requirements: jobPost.requirements || "",
        benefits: jobPost.benefits || "",
        time: jobPost.time || new Date().toISOString(),
        status: jobPost.status || "Open",
        email: jobPost.email || "",
        majorId: jobPost.majorId || 0,
        skillIds: jobPost.skills?.map((skill) => skill.skillId) || [],
      });
    }
  }, [jobPost, open, reset]);

  const onSubmit = async (values: FormValues) => {
    console.log("🚀 onSubmit function called!");
    console.log("Form submitted with values:", values);
    console.log("JobPost:", jobPost);

    if (!jobPost) {
      console.error("No jobPost provided");
      toast.error("Không tìm thấy thông tin tin tuyển dụng");
      return;
    }

    try {
      console.log("Attempting to update job post with ID:", jobPost.jobPostId);

      const response = await APIClient.invoke<ApiResponse<any>>({
        action: ACTIONS.UPDATE_JOB_POST,
        idQuery: jobPost.jobPostId.toString(),
        data: values,
      });

      console.log("API Response:", response);

      if (isApiSuccess(response)) {
        toast.success("Cập nhật tin tuyển dụng thành công!");
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        onOpenChange(false);
      } else {
        console.error("API returned error:", response);
        toast.error(response.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Failed to update job post:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "view"
              ? "Chi tiết tin tuyển dụng"
              : "Chỉnh sửa tin tuyển dụng"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <label className="text-sm font-medium">Chức danh</label>
            <Input {...register("jobTitle")} readOnly={isReadOnly} />
            {errors.jobTitle && (
              <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              rows={4}
              {...register("jobDescription")}
              readOnly={isReadOnly}
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-600">
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Lương tối thiểu</label>
            <Input
              type="number"
              {...register("minSalary", { valueAsNumber: true })}
              readOnly={isReadOnly}
            />
            {errors.minSalary && (
              <p className="text-sm text-red-600">{errors.minSalary.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Lương tối đa</label>
            <Input
              type="number"
              {...register("maxSalary", { valueAsNumber: true })}
              readOnly={isReadOnly}
            />
            {errors.maxSalary && (
              <p className="text-sm text-red-600">{errors.maxSalary.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Số lượng tuyển dụng</label>
            <Input
              type="number"
              {...register("recruitmentQuantity", { valueAsNumber: true })}
              readOnly={isReadOnly}
            />
            {errors.recruitmentQuantity && (
              <p className="text-sm text-red-600">
                {errors.recruitmentQuantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Loại hình làm việc</label>
            <Input {...register("workType")} readOnly={isReadOnly} />
            {errors.workType && (
              <p className="text-sm text-red-600">{errors.workType.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Giờ làm việc</label>
            <Input {...register("workHours")} readOnly={isReadOnly} />
            {errors.workHours && (
              <p className="text-sm text-red-600">{errors.workHours.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email liên hệ</label>
            <Input {...register("email")} readOnly={isReadOnly} />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Địa điểm</label>
            <Input {...register("location")} readOnly={isReadOnly} />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Thành phố</label>
            {isReadOnly ? (
              <Input {...register("city")} readOnly />
            ) : (
              <CitySelect
                value={watch("city") || ""}
                onValueChange={(value) => setValue("city", value)}
              />
            )}
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Chuyên ngành</label>
            <Select
              value={watch("majorId") ? watch("majorId").toString() : ""}
              onValueChange={(value) => setValue("majorId", parseInt(value))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                {majorItems.map((major: any) => (
                  <SelectItem
                    key={major.majorId}
                    value={major.majorId.toString()}
                  >
                    {major.majorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.majorId && (
              <p className="text-sm text-red-600">{errors.majorId.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={watch("status") || ""}
              onValueChange={(value) => setValue("status", value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusItems).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Thời gian</label>
            {isReadOnly ? (
              <Input
                value={timeValue ? new Date(timeValue).toLocaleString() : ""}
                readOnly
              />
            ) : (
              <DateTimePicker
                date={dateObj}
                setDate={(date) => setValue("time", date?.toISOString() || "")}
              />
            )}
            {errors.time && (
              <p className="text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Yêu cầu</label>
            <Textarea
              rows={3}
              {...register("requirements")}
              readOnly={isReadOnly}
            />
            {errors.requirements && (
              <p className="text-sm text-red-600">
                {errors.requirements.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Quyền lợi</label>
            <Textarea
              rows={3}
              {...register("benefits")}
              readOnly={isReadOnly}
            />
            {errors.benefits && (
              <p className="text-sm text-red-600">{errors.benefits.message}</p>
            )}
          </div>

          {isReadOnly ? (
            <div className="col-span-2">
              <label className="text-sm font-medium">Kỹ năng</label>
              <SkillMultiSelect
                disabled={true}
                value={selectedSkills}
                onChange={(skills: Skill[]) =>
                  setValue(
                    "skillIds",
                    skills.map((s: Skill) => s.skillId)
                  )
                }
                maxDisplay={4}
              />
            </div>
          ) : (
            <div className="col-span-2">
              <label className="text-sm font-medium">Kỹ năng</label>
              <SkillMultiSelect
                value={selectedSkills}
                onChange={(skills: Skill[]) =>
                  setValue(
                    "skillIds",
                    skills.map((s: Skill) => s.skillId)
                  )
                }
              />
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {mode === "view" ? "Đóng" : "Hủy"}
            </Button>
            {mode === "edit" && (
              <>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log("Submit button clicked!", e);
                    console.log("Form errors before submit:", errors);
                  }}
                >
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
