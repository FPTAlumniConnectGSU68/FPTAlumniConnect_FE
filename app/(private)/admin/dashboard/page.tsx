"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useGetUser, useGetUserCount } from "@/hooks/use-user";
import {
  CalendarDays,
  Shield,
  Users,
  Briefcase,
  Newspaper,
} from "lucide-react";
import { useGetJobPostCount } from "@/hooks/use-jobs";
import { useGetEventCount } from "@/hooks/use-event";
import {
  useEventCountByMonth,
  useEventCountByStatus,
  useGetJobApplicationCount,
  useGetMajorCount,
  useGetMentorshipCount,
  useGetPostCount,
  useGetScheduleCount,
  useJobPostCountByMonth,
  useMentorshipCountByMonth,
  usePostCountByMonth,
  useScheduleCountByMonth,
  useUserCountByMonth,
} from "@/hooks/use-analytics";
import { MonthYearSelect } from "@/components/ui/month-year-select";
import dynamic from "next/dynamic";

// Constants and helpers (module scope for stability and performance)
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Lazy-load chart components (client-only) with built-in loading fallbacks
const BarChartLazy = dynamic(
  () => import("@/components/ui/charts").then((m) => m.BarChart),
  { ssr: false }
);

// Skeletons
const ChartSkeleton = ({ height = 260 }: { height?: number }) => (
  <div className="w-full" style={{ height }}>
    <div className="h-full rounded-lg bg-gray-100 animate-pulse" />
  </div>
);

function normalizeSeries<T>(items: T | T[] | null | undefined): T[] {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function toBarData(items: any): { label: string; value: number }[] {
  const arr = normalizeSeries(items);
  return arr.map((it: any) => {
    const label = it?.month
      ? MONTH_NAMES[Math.max(0, (it.month as number) - 1)]
      : "Unknown";
    const value = typeof it?.count === "number" ? it.count : 0;
    return { label, value };
  });
}

function toPieData(items: any): { name: string; value: number }[] {
  const arr = normalizeSeries(items);
  return arr.map((it: any) => ({
    name: it?.status ?? "Unknown",
    value: typeof it?.count === "number" ? it.count : 0,
  }));
}

const StatCard = React.memo(
  ({
    icon: Icon,
    title,
    value,
    trend,
  }: {
    icon: any;
    title: string;
    value: string;
    trend?: string;
  }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )
);
StatCard.displayName = "StatCard";

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.userId ?? 0;
  const { data: userData } = useGetUser(userId);
  const userUnique = userData?.status === "success" && userData?.data;
  const { data: userCount } = useGetUserCount();
  const userCountData = userCount?.status === "success" && userCount?.data;
  const { data: jobPostCount } = useGetJobPostCount();
  const jobPostCountData =
    jobPostCount?.status === "success" && jobPostCount?.data;
  const { data: eventCount } = useGetEventCount();
  const eventCountData = eventCount?.status === "success" && eventCount?.data;

  // Additional stat counts
  const { data: jobAppCount } = useGetJobApplicationCount();
  const jobAppCountData =
    jobAppCount?.status === "success" && jobAppCount?.data;
  const { data: majorCount } = useGetMajorCount();
  const majorCountData = majorCount?.status === "success" && majorCount?.data;
  const { data: mentorshipCount } = useGetMentorshipCount();
  const mentorshipCountData =
    mentorshipCount?.status === "success" && mentorshipCount?.data;
  const { data: postCount } = useGetPostCount();
  const postCountData = postCount?.status === "success" && postCount?.data;
  const { data: scheduleCount } = useGetScheduleCount();
  const scheduleCountData =
    scheduleCount?.status === "success" && scheduleCount?.data;

  // Month/Year filters per chart
  const [eventsMY, setEventsMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [usersMY, setUsersMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [jobPostsMY, setJobPostsMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [mentorshipMY, setMentorshipMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [postsMY, setPostsMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [schedulesMY, setSchedulesMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });
  const [eventStatusMY, setEventStatusMY] = React.useState<{
    month?: number;
    year?: number;
  }>({ year: new Date().getFullYear() });

  // Queries for charts
  const { data: eventsByMonth, isLoading: eventsLoading } =
    useEventCountByMonth(eventsMY);
  const eventsByMonthData =
    eventsByMonth?.status === "success" ? eventsByMonth?.data : [];
  const { data: usersByMonth, isLoading: usersLoading } =
    useUserCountByMonth(usersMY);
  const usersByMonthData =
    usersByMonth?.status === "success" && (usersByMonth?.data || []);
  const { data: jobPostsByMonth, isLoading: jobsLoading } =
    useJobPostCountByMonth(jobPostsMY);
  const jobPostsByMonthData =
    jobPostsByMonth?.status === "success" && (jobPostsByMonth?.data || []);
  const { data: mentorshipsByMonth, isLoading: mentorshipsLoading } =
    useMentorshipCountByMonth(mentorshipMY);
  const mentorshipsByMonthData =
    mentorshipsByMonth?.status === "success" &&
    (mentorshipsByMonth?.data || []);
  const { data: postsByMonth, isLoading: postsLoading } =
    usePostCountByMonth(postsMY);
  const postsByMonthData =
    postsByMonth?.status === "success" && (postsByMonth?.data || []);
  const { data: schedulesByMonth, isLoading: schedulesLoading } =
    useScheduleCountByMonth(schedulesMY);
  const schedulesByMonthData =
    schedulesByMonth?.status === "success" && (schedulesByMonth?.data || []);
  const { data: eventStatus, isLoading: statusLoading } =
    useEventCountByStatus();
  const eventStatusData =
    eventStatus?.status === "success" && (eventStatus?.data || []);

  // Memoized, normalized chart data
  const eventsBarData = React.useMemo(
    () => toBarData(eventsByMonthData),
    [eventsByMonthData]
  );
  const usersBarData = React.useMemo(
    () => toBarData(usersByMonthData),
    [usersByMonthData]
  );
  const jobPostsBarData = React.useMemo(
    () => toBarData(jobPostsByMonthData),
    [jobPostsByMonthData]
  );
  const mentorshipsBarData = React.useMemo(
    () => toBarData(mentorshipsByMonthData),
    [mentorshipsByMonthData]
  );
  const postsBarData = React.useMemo(
    () => toBarData(postsByMonthData),
    [postsByMonthData]
  );
  const schedulesBarData = React.useMemo(
    () => toBarData(schedulesByMonthData),
    [schedulesByMonthData]
  );
  const eventsStatusPieData = React.useMemo(
    () => toPieData(eventStatusData),
    [eventStatusData]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back{userUnique ? `, ${userUnique.firstName}` : ""}.
          </p>
        </div>
        <Badge className="bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Admin
        </Badge>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="New Users"
          value={userCountData?.toString() ?? "0"}
          trend={"+12% from last week"}
        />
        <StatCard
          icon={Briefcase}
          title="Job Posts"
          value={jobPostCountData?.toString() ?? "0"}
          trend={"+3 this week"}
        />
        <StatCard
          icon={CalendarDays}
          title="Upcoming Events"
          value={eventCountData?.toString() ?? "0"}
          trend={"2 this month"}
        />
        <StatCard
          icon={Newspaper}
          title="Forum Posts"
          value={postCountData?.toString() ?? "0"}
          trend={"-5% from last week"}
        />
        <StatCard
          icon={Briefcase}
          title="Job Applications"
          value={jobAppCountData?.toString() ?? "0"}
          trend={"This week"}
        />
        <StatCard
          icon={Users}
          title="Mentorship Requests"
          value={mentorshipCountData?.toString() ?? "0"}
          trend={"This month"}
        />
        <StatCard
          icon={Users}
          title="Schedules"
          value={scheduleCountData?.toString() ?? "0"}
          trend={"This month"}
        />
        <StatCard
          icon={Users}
          title="Majors"
          value={majorCountData?.toString() ?? "0"}
          trend={"Total"}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Events by Month</CardTitle>
              <CardDescription>Monthly event count</CardDescription>
            </div>
            <MonthYearSelect value={eventsMY} onChange={setEventsMY} />
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={eventsBarData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users by Month</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </div>
            <MonthYearSelect value={usersMY} onChange={setUsersMY} />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={usersBarData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Posts by Month</CardTitle>
              <CardDescription>Monthly job posts</CardDescription>
            </div>
            <MonthYearSelect value={jobPostsMY} onChange={setJobPostsMY} />
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={jobPostsBarData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mentorships by Month</CardTitle>
              <CardDescription>Monthly mentorship requests</CardDescription>
            </div>
            <MonthYearSelect value={mentorshipMY} onChange={setMentorshipMY} />
          </CardHeader>
          <CardContent>
            {mentorshipsLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={mentorshipsBarData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Posts by Month</CardTitle>
              <CardDescription>Monthly forum posts</CardDescription>
            </div>
            <MonthYearSelect value={postsMY} onChange={setPostsMY} />
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={postsBarData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Schedules by Month</CardTitle>
              <CardDescription>Monthly schedules</CardDescription>
            </div>
            <MonthYearSelect value={schedulesMY} onChange={setSchedulesMY} />
          </CardHeader>
          <CardContent>
            {schedulesLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChartLazy data={schedulesBarData} />
            )}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Events by Status</CardTitle>
              <CardDescription>Status breakdown</CardDescription>
            </div>
            <MonthYearSelect
              value={eventStatusMY}
              onChange={setEventStatusMY}
            />
          </CardHeader>
          <CardContent>
            <PieChart data={toPieData(eventStatusData)} />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
