import React from "react";
import {
  MapPin,
  Building,
  Clock,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatDateToDMY } from "@/lib/utils";

interface JobProps {
  featuredJobs: any[];
  handleClick: () => any;
}
const LatestJob = ({ featuredJobs, handleClick }: JobProps) => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Latest Job Opportunities
        </h2>
        <Button
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => router.push("/jobs")}
        >
          Post a Job
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredJobs.map((job, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-green-300"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {job.jobTitle}
                  </h3>
                  <p className="text-blue-600 font-medium">{job.location}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-100 text-green-800 border-green-200"
                >
                  {job.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                  {/* {job.status && (
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs border-blue-200 text-blue-700"
                    >
                      {job.status}
                    </Badge>
                  )} */}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  {`${job.minSalary} - ${job.maxSalary}`}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Posted {formatDateToDMY(job.time)}
                  {/* • {job.applicants} applicants */}
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={handleClick}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestJob;
