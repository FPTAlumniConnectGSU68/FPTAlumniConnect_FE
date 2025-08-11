"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { useSkills } from "@/hooks/use-skills";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { UserInfo } from "@/types/auth";
import { JobPostCreate } from "@/types/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    jobTitle: z.string().min(1, "Required Job Title"),
    jobDescription: z.string().min(1, "Required Job Description"),
    minSalary: z.coerce.number().nonnegative(),
    maxSalary: z.coerce.number().nonnegative(),
    isDeal: z.boolean().default(false),
    location: z.string().min(1, "Required Location"),
    city: z.string().min(1, "Required City"),
    requirements: z.string().min(1, "Required Requirements"),
    benefits: z.string().min(1, "Required Benefits"),
    time: z.string().min(1, "Required Time"),
    status: z.string().min(1, "Required Status"),
    email: z.string().email("Invalid email"),
    userId: z.coerce.number().int().nonnegative(),
    majorId: z.coerce.number().int().nonnegative(),
    skillIds: z.array(z.coerce.number().int().nonnegative()).default([]),
  })
  .refine((data) => data.maxSalary === 0 || data.maxSalary >= data.minSalary, {
    message: "Max salary must be greater than or equal to min salary",
    path: ["maxSalary"],
  });

type FormValues = z.infer<typeof schema>;

export function JobPostCreateDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserInfo;
}) {
  const queryClient = useQueryClient();
  const { data: skillsData } = useSkills();
  const { data: majorsData } = useMajorCodes();

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
      isDeal: false,
      location: "",
      city: "",
      requirements: "",
      benefits: "",
      time: new Date().toISOString(),
      status: statusItems.Open,
      email: "",
      userId: user.userId,
      majorId: 0,
      skillIds: [],
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const timeValue = watch("time");
  const dateObj = useMemo(
    () => (timeValue ? new Date(timeValue) : undefined),
    [timeValue]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      const res = await APIClient.invoke<ApiResponse<JobPostCreate>>({
        action: ACTIONS.CREATE_JOB_POST,
        data: values,
      });
      if (res.status === "success") {
        toast.success("Job post created");
        // Refresh any jobs lists (all pages/filters)
        await queryClient.invalidateQueries({ queryKey: ["jobs"] });
        reset();
        onOpenChange(false);
      } else {
        toast.error(res.message || "Failed to create job post");
      }
    } catch (e) {
      toast.error("Failed to create job post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Job Post</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input {...register("jobTitle")} />
            {errors.jobTitle && (
              <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={4} {...register("jobDescription")} />
            {errors.jobDescription && (
              <p className="text-sm text-red-600">
                {errors.jobDescription.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Min Salary</label>
            <Input
              type="number"
              {...register("minSalary", { valueAsNumber: true })}
            />
            {errors.minSalary && (
              <p className="text-sm text-red-600">{errors.minSalary.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Max Salary</label>
            <Input
              type="number"
              {...register("maxSalary", { valueAsNumber: true })}
            />
            {errors.maxSalary && (
              <p className="text-sm text-red-600">{errors.maxSalary.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input {...register("location")} />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <Input {...register("city")} />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Requirements</label>
            <Textarea rows={3} {...register("requirements")} />
            {errors.requirements && (
              <p className="text-sm text-red-600">
                {errors.requirements.message}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Benefits</label>
            <Textarea rows={3} {...register("benefits")} />
            {errors.benefits && (
              <p className="text-sm text-red-600">{errors.benefits.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Time</label>
            <div className="mt-1">
              <DateTimePicker
                date={dateObj}
                setDate={(d) => setValue("time", d ? d.toISOString() : "")}
              />
            </div>
            {errors.time && (
              <p className="text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select {...register("status")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(statusItems).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Major</label>
            <Select
              onValueChange={(v) => setValue("majorId", Number(v))}
              value={String(watch("majorId") || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select major" />
              </SelectTrigger>
              <SelectContent>
                {majorItems.map((m: any) => (
                  <SelectItem key={m.majorId} value={String(m.majorId)}>
                    {m.majorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.majorId && (
              <p className="text-sm text-red-600">{errors.majorId.message}</p>
            )}
          </div>
          {/* <div>
            <label className="text-sm font-medium">User Id</label>
            <Input
              type="number"
              {...register("userId", { valueAsNumber: true })}
            />
            {errors.userId && (
              <p className="text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div> */}
          {/* <div>
            <label className="text-sm font-medium">Major Id</label>
            <Input
              type="number"
              {...register("majorId", { valueAsNumber: true })}
            />
            {errors.majorId && (
              <p className="text-sm text-red-600">{errors.majorId.message}</p>
            )}
          </div> */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Skills</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {skillItems.map((skill: any) => {
                const checked = (watch("skillIds") || []).includes(
                  skill.skillId
                );
                return (
                  <label
                    key={skill.skillId}
                    className={`inline-flex items-center gap-2 rounded border px-3 py-1 cursor-pointer ${
                      checked ? "bg-blue-50 border-blue-400" : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={(e) => {
                        const current = new Set(watch("skillIds") || []);
                        if (e.target.checked) current.add(skill.skillId);
                        else current.delete(skill.skillId);
                        setValue("skillIds", Array.from(current));
                      }}
                    />
                    <span className="text-sm">
                      {skill.name || skill.skillName}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting || isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || isSubmitting}>
              {submitting || isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
