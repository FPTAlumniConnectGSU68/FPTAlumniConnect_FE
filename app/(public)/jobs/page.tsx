"use client";

import { JobCard } from "@/components/jobs/JobCard";
import { JobDetails, JobDetailsEmpty } from "@/components/jobs/JobDetails";
import { JobSearchFilters } from "@/components/jobs/JobSearchFilters";
import {
  JobCardSkeleton,
  JobDetailsSkeleton,
} from "@/components/jobs/JobSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useJobs } from "@/hooks/use-jobs";
import { isApiSuccess } from "@/lib/utils";
import { JobPost, User } from "@/types/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

function JobsPageContent() {
  // State management
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState<string>("Tất cả chuyên ngành");
  const [location, setLocation] = useState("all");
  const [data, setData] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  // Fetch jobs data
  const {
    data: jobs,
    isLoading: jobsLoading,
    isFetching,
  } = useJobs({
    page,
    size: 5,
    query: {
      status: "Open",
      majorId: major === "Tất cả chuyên ngành" ? "" : major,
      location: location === "all" ? "" : location,
    },
  });

  console.log("jobs: ", jobs);

  const router = useRouter();

  const clearAllRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Initialize/append data and selected job
  useEffect(() => {
    if (jobs && isApiSuccess(jobs) && jobs.data?.items) {
      if (page === 1) {
        setData(jobs.data.items);
        const idNum = jobId ? Number(jobId) : NaN;
        if (jobId && Number.isFinite(idNum)) {
          const match = jobs.data.items.find(
            (item) => item.jobPostId === idNum
          );
          setSelectedJob(match ?? null);
        } else {
          setSelectedJob(
            jobs.data.items.length > 0 ? jobs.data.items[0] : null
          );
        }
      } else {
        setData((prev) => {
          const existingIds = new Set(prev.map((item) => item.jobPostId));
          const newItems = jobs.data!.items.filter(
            (item) => !existingIds.has(item.jobPostId)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [jobs, page, jobId]);

  // Select job based on URL id when data updates
  useEffect(() => {
    const idNum = jobId ? Number(jobId) : NaN;
    if (!jobId || !Number.isFinite(idNum)) return;
    const found = data.find((j) => j.jobPostId === idNum) || null;
    if (found && selectedJob?.jobPostId !== idNum) {
      setSelectedJob(found);
    }
  }, [jobId, data, selectedJob]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    // Keep selected job if URL has an id
    if (!jobId) {
      setSelectedJob(null);
    }
  }, [major, location, search, jobId]);

  // click clear all button once the page is loaded
  useEffect(() => {
    clearAllRef.current?.click();
  }, []);

  // Event handlers
  const handleJobClick = (job: JobPost) => {
    router.push(
      pathname + "?" + createQueryString("id", job.jobPostId.toString()),
      { scroll: false }
    );
    setSelectedJob(job);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tìm việc làm</h1>

      {/* Search and Filters */}
      <JobSearchFilters
        search={search}
        major={major}
        location={location}
        onSearchChange={setSearch}
        onMajorChange={setMajor}
        onLocationChange={setLocation}
        clearAllRef={clearAllRef as React.RefObject<HTMLButtonElement>}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Job Listings */}
        <div className="lg:col-span-5 space-y-4">
          {jobsLoading ? (
            // Show skeleton loading for job cards
            <>
              {[1, 2, 3, 4].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </>
          ) : data.length > 0 ? (
            <>
              {data.map((job) => (
                <JobCard
                  key={job.jobPostId}
                  job={job}
                  isSelected={
                    selectedJob?.jobPostId === job.jobPostId ||
                    jobId === job.jobPostId.toString()
                  }
                  onClick={handleJobClick}
                />
              ))}
              {jobs &&
                isApiSuccess(jobs) &&
                jobs.data &&
                page < jobs.data.totalPages && (
                  <div className="pt-2 w-full flex justify-center">
                    <Button
                      className="w-fit bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isFetching}
                    >
                      {isFetching ? "Đang tải..." : "Tải thêm việc làm"}
                    </Button>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy việc làm phù hợp
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="lg:col-span-7">
          {jobsLoading ? (
            <JobDetailsSkeleton />
          ) : selectedJob && data.length > 0 ? (
            <JobDetails job={selectedJob} user={user as User} />
          ) : (
            <JobDetailsEmpty />
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
