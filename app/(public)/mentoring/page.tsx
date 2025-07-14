"use client";
import { useMentors } from "@/hooks/use-mentors";
import { Mentor } from "@/types/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";
import { isApiSuccess } from "@/lib/utils";

const years = ["All Years", "2018", "2019", "2020"];
const majors = [
  "All Majors",
  "Computer Science",
  "Software Engineering",
  "Design",
];
const topics = ["All Topics", "ReactJS", "NodeJS", "UI/UX"];

export default function MentoringPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("All Years");
  const [major, setMajor] = useState("All Majors");
  const [topic, setTopic] = useState("All Topics");
  const [data, setData] = useState<any[]>();

  const { data: mentors, isLoading: mentorsLoading } = useMentors({
    size: 6,
    query: {},
  });

  useEffect(() => {
    if (mentors && isApiSuccess(mentors) && mentors.data?.items) {
      const enriched = mentors.data.items.map((user) => ({
        ...user,
        isConnected: Math.random() < 0.5,
      }));
      setData(enriched);
    }
  }, [mentors]);

  const handleConnect = (id: number) => {
    console.log("Connect to: " + id);
  };
  const handleMsg = (id: number) => {
    console.log("msg to:" + id);
  };
  console.log();

  const filtered = useMemo(() => {
    return data;
  }, [data]);
  // const filtered = data.filter((item) => {
  //   const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
  //   const matchYear = year === "All Years" || item.year === year;
  //   const matchMajor = major === "All Majors" || item.major === major;
  //   const matchTopic = topic === "All Topics" || item.topic === topic;
  //   return matchSearch && matchYear && matchMajor && matchTopic;
  // });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mentoring Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/4">
          <input
            type="text"
            placeholder="Search by mentor name..."
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
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered &&
          filtered.map((mentor, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16 ring-2 ring-yellow-100">
                  <AvatarImage
                    src={mentor.profilePicture || "/placeholder.svg"}
                    alt={mentor.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {mentor.firstName}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-lg">
                    {`${mentor.lastName} ${mentor.firstName}`}
                  </div>
                  {/* <div className="text-gray-500 flex items-center gap-2 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                  </svg>
                  Class of {item.year}
                </div> */}
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1 font-semibold">
                    {mentor.majorName}
                  </span>
                  {/* <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mt-1 font-semibold ml-2">
                  {item.topic}
                </span> */}
                </div>
              </div>
              {/* <div className="text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <path d="M7 11l5-5 5 5" />
                </svg>
                {item.description}
              </div> */}
              <div className="flex gap-2 mt-auto">
                <Button
                  size="sm"
                  variant={mentor.isConnected ? "outline" : "default"}
                  onClick={() =>
                    mentor.isConnected ? handleMsg : handleConnect
                  }
                  className="flex-1"
                >
                  {mentor.isConnected ? (
                    <>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
