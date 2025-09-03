"use client";

import { JobPost } from "@/types/interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateToDMY } from "@/lib/utils";
import { CircleDollarSign, Clock, GraduationCap } from "lucide-react";
import Image from "next/image";

interface JobCardProps {
  job: JobPost;
  isSelected: boolean;
  onClick: (job: JobPost) => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 border ${
        isSelected
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => onClick(job)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {job.jobTitle}
            </h3>
            <p className="text-blue-600">{job.location}</p>
            {job.recruiterInfoId && (
              <div className="flex items-center gap-2">
                <Image
                  src={job.companyLogoUrl}
                  alt={job.jobTitle}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-ellipsis overflow-hidden w-full">
                  {job.companyName}
                </p>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {job.status}
          </Badge>
        </div>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Đăng ngày: {formatDateToDMY(job.time)}
          </div>
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            {job.majorName}
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <div className="bg-green-100 text-green-800 rounded-md px-2 py-1 font-bold">
              {`${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} VNĐ / tháng`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
