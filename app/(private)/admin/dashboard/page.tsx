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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useGetUser, useGetUserCount } from "@/hooks/use-user";
import {
  CalendarDays,
  MessageSquare,
  Shield,
  Users,
  Briefcase,
  Newspaper,
} from "lucide-react";
import { useGetJobPostCount } from "@/hooks/use-jobs";
import { useGetEventCount } from "@/hooks/use-event";

const StatCard = ({
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
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </CardContent>
  </Card>
);

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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
          value={"412"}
          trend={"-5% from last week"}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Mentorship Requests</CardTitle>
            <CardDescription>
              Track new mentorship requests requiring attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Request #{i} • Pending review
                    </p>
                    <p className="text-xs text-gray-500">
                      Student K16{i} requesting guidance for CV review
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Reports</CardTitle>
            <CardDescription>
              User-submitted reports on posts and comments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Report #{100 + i}</p>
                      <p className="text-xs text-gray-500">
                        Flagged for inappropriate language
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
