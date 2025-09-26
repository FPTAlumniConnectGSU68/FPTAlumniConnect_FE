"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { EveryoneTab } from "@/components/mentoring/EveryoneTab";
import { MyRequestsTab } from "@/components/mentoring/MyRequestsTab";
import { MentorTab } from "@/components/mentoring/MentorTab";
import { User } from "@/types/interfaces";

export default function MentoringPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const isAlumni = user?.roleName.toLowerCase() === "alumni";
  const isMentor = user?.mentorStatus === "Active";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh mục cố vấn</h1>

      <Tabs defaultValue="everyone" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="everyone" className="flex-1">
            Tất cả
          </TabsTrigger>
          {isAlumni && (
            <TabsTrigger value="my-requests" className="flex-1">
              Yêu cầu của tôi
            </TabsTrigger>
          )}
          {isAlumni && isMentor && (
            <TabsTrigger value="mentor" className="flex-1">
              Mentor
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="everyone">
          <EveryoneTab currentPage={currentPage} user={user as User} />
        </TabsContent>

        {isAlumni && (
          <TabsContent value="my-requests">
            <MyRequestsTab userId={user?.userId ?? 0} />
          </TabsContent>
        )}

        {isAlumni && isMentor && (
          <TabsContent value="mentor">
            <MentorTab
              currentPage={currentPage}
              userId={user?.userId.toString() ?? ""}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
