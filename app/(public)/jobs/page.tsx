"use client";
import { useJobs } from "@/hooks/use-jobs";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { MapPin, Clock, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateToDMY, isApiSuccess } from "@/lib/utils";

const years = ["All Years", "2016", "2017", "2018", "2019", "2020", "2021"];
const majors = [
  "All Majors",
  "Computer Science",
  "Business Administration",
  "Information Technology",
  "Digital Marketing",
  "Software Engineering",
  "Data Science",
];
const locations = [
  "All Locations",
  "New York",
  "Seattle",
  "Redmond",
  "Menlo Park",
  "San Francisco",
  "Los Angeles",
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("All Years");
  const [major, setMajor] = useState("All Majors");
  const [location, setLocation] = useState("All Locations");
  const [data, setData] = useState<any[]>();

  const { data: jobs, isLoading: jobsLoading } = useJobs({
    size: 6,
    query: {
      status: "Open",
    },
  });

  useEffect(() => {
    if (jobs && isApiSuccess(jobs) && jobs.data?.items) {
      const enriched = jobs.data.items.map((job) => ({
        ...job,
        isConnected: Math.random() < 0.5,
      }));
      setData(enriched);
    }
  }, [jobs]);

  console.log(jobs);

  const handleClick = (id: number) => {
    console.log("Apply to: " + id);
  };

  const filtered = useMemo(() => {
    return data;
  }, [data]);
  // const filtered = data.filter((item) => {
  //   const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
  //   const matchYear = year === "All Years" || item.year === year;
  //   const matchMajor = major === "All Majors" || item.major === major;
  //   const matchLocation =
  //     location === "All Locations" || item.location === location;
  //   return matchSearch && matchYear && matchMajor && matchLocation;
  // });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jobs Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full md:w-1/6 border rounded-lg px-3 py-2"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <select
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          {majors.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          {locations.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered && (
          <>
            {" "}
            {filtered.map((job, index) => (
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
                      <p className="text-blue-600 font-medium">
                        {job.location}
                      </p>
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
                    onClick={() => handleClick(job.jobPostId)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
