"use client";

import { JobCard } from "@/components/jobs/JobCard";
import { JobDetails, JobDetailsEmpty } from "@/components/jobs/JobDetails";
import { JobSearchFilters } from "@/components/jobs/JobSearchFilters";
import {
  JobCardSkeleton,
  JobDetailsSkeleton,
} from "@/components/jobs/JobSkeleton";
import { useAuth } from "@/contexts/auth-context";
import { useJobs } from "@/hooks/use-jobs";
import { useRouteHistory } from "@/hooks/use-route-history";
import { isApiSuccess } from "@/lib/utils";
import { JobPost, User } from "@/types/interfaces";
import { useEffect, useRef, useState } from "react";

export default function JobsPage() {
  // State management
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState("all");
  const [location, setLocation] = useState("all");
  const [data, setData] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const { user } = useAuth();
  // Fetch jobs data
  const { data: jobs, isLoading: jobsLoading } = useJobs({
    size: 10,
    query: {
      status: "Open",
      majorId: major === "all" ? "" : major,
      location: location === "all" ? "" : location,
    },
  });

  const clearAllRef = useRef<HTMLButtonElement>(null);

  // Initialize data and selected job
  useEffect(() => {
    if (jobs && isApiSuccess(jobs) && jobs.data?.items) {
      setData(jobs.data.items);
      if (jobs.data.items.length > 0 && !selectedJob) {
        setSelectedJob(jobs.data.items[0]);
      }
    }
  }, [jobs]);

  // click clear all button once the page is loaded
  useEffect(() => {
    clearAllRef.current?.click();
  }, []);

  // Event handlers
  const handleJobClick = (job: JobPost) => {
    setSelectedJob(job);
  };

  const handleApply = (jobId: number) => {
    // Implement apply logic here
    console.log("Applying to job:", jobId);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jobs Directory</h1>

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
            data.map((job) => (
              <JobCard
                key={job.jobPostId}
                job={job}
                isSelected={selectedJob?.jobPostId === job.jobPostId}
                onClick={handleJobClick}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No jobs found matching your criteria
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
