"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { useAuth } from "@/contexts/auth-context";
import {
  Users,
  Briefcase,
  MessageSquare,
  Calendar,
  UserCheck,
} from "lucide-react";
import { getRoleBadgeColor } from "@/utils/get-role-badge-color"; // Declare the variable before using it

// Import the auth guard hook at the top
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import FeaturedAlumni from "@/components/home/FeaturedAlumni";
import LatestJob from "@/components/home/LatestJob";
import TopMentors from "@/components/home/TopMentors";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Forums from "@/components/home/Forums";
import HeroSection from "@/components/home/HeroSection";
import { useJobs } from "@/hooks/use-jobs";
import { useMentors } from "@/hooks/use-mentors";
import { useEvents } from "@/hooks/use-event";
import { useUsers } from "@/hooks/use-user";
import { usePosts } from "@/hooks/use-post";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isApiSuccess } from "@/lib/utils";

// Add the auth guard hook in the component
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, logout } = useAuth();
  const { requireAuth, AuthGuard } = useAuthGuard(); // Add this line
  const router = useRouter();

  const { data: jobs, isLoading: jobsLoading } = useJobs({
    size: 6,
    query: { status: "Open" },
  });

  const { data: mentors, isLoading: mentorsLoading } = useMentors({
    size: 6,
    query: {},
  });

  const { data: events, isLoading: eventsLoading } = useEvents({
    size: 3,
    query: {},
  });

  const { data: alumnis, isLoading: alumnisLoading } = useUsers({
    size: 6,
    role: "2",
  });

  const { data: posts, isLoading: postLoading } = usePosts({
    size: 3,
  });

  const jobItems = jobs && isApiSuccess(jobs) ? jobs.data?.items ?? [] : [];
  const mentorItems =
    mentors && isApiSuccess(mentors) ? mentors.data?.items ?? [] : [];
  const eventItems =
    events && isApiSuccess(events) ? events.data?.items ?? [] : [];
  const alumniItems =
    alumnis && isApiSuccess(alumnis) ? alumnis.data?.items ?? [] : [];
  const postItems = posts && isApiSuccess(posts) ? posts.data?.items ?? [] : [];

  // Add auth-protected handlers for guest interactions
  const handleConnectClick = () => {
    if (
      !requireAuth({
        title: "Connect with Alumni",
        description:
          "Sign in to connect with FPT University alumni and expand your network",
        actionText: "alumni connections",
      })
    ) {
      console.log("connect alumni");
    }

    return;
  };

  const handleApplyJobClick = () => {
    if (
      !requireAuth({
        title: "Apply for Jobs",
        description:
          "Sign in to apply for job opportunities posted by the FPT community",
        actionText: "job applications",
      })
    )
      return;
  };

  const handleRegisterEventClick = (id: string | number) => {
    if (
      !requireAuth({
        title: "Register for Events",
        description:
          "Sign in to register for alumni events and networking opportunities",
        actionText: "event registration",
      })
    )
      return;
    router.push(`/events?openModal=true&eventId=${id}`);
  };

  const handleBookMentorClick = () => {
    if (
      !requireAuth({
        title: "Book Mentoring Session",
        description:
          "Sign in to book mentoring sessions with experienced alumni",
        actionText: "mentoring sessions",
      })
    )
      return;
  };

  const handleOpenDiscussionClick = (id: string | number) => {
    if (
      !requireAuth({
        title: "Join Discussions",
        description:
          "Sign in to participate in forum discussions and share your thoughts",
        actionText: "forum discussions",
      })
    )
      return;
    router.push(`/forums?openModal=true&postId=${id}`);
  };

  const tabItems = [
    {
      title: "Alumni",
      triggerValue: "alumni",
      icon: <Users className="h-4 w-4" />,
      className: ["bg-blue-50", "text-blue-700"],
      component: alumnisLoading ? (
        <div className="flex align-middle justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <FeaturedAlumni
          featuredAlumni={alumniItems}
          handleClick={handleConnectClick}
        />
      ),
    },
    {
      title: "Jobs",
      triggerValue: "jobs",
      icon: <Briefcase className="h-4 w-4" />,
      className: ["bg-green-50", "text-green-700"],
      component: jobsLoading ? (
        <div className="flex align-middle justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <LatestJob featuredJobs={jobItems} handleClick={handleApplyJobClick} />
      ),
    },
    {
      title: "Events",
      triggerValue: "events",
      icon: <Calendar className="h-4 w-4" />,
      className: ["bg-orange-50", "text-orange-700"],
      component: eventsLoading ? (
        <div className="flex align-middle justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <UpcomingEvents
          upcomingEvents={eventItems}
          handleClick={handleRegisterEventClick}
        />
      ),
    },
    {
      title: "Mentoring",
      triggerValue: "mentoring",
      icon: <UserCheck className="h-4 w-4" />,
      className: ["bg-purple-50", "text-purple-700"],
      component: mentorsLoading ? (
        <div className="flex align-middle justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <TopMentors mentors={mentorItems} handleClick={handleBookMentorClick} />
      ),
    },
    {
      title: "Forums",
      triggerValue: "forums",
      icon: <MessageSquare className="h-4 w-4" />,
      className: ["bg-pink-50", "text-pink-700"],
      component: postLoading ? (
        <div className="flex align-middle justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Forums
          forumPosts={postItems}
          handleClick={handleOpenDiscussionClick}
        />
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        {/* <section className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 pb-20">
          <Tabs defaultValue="alumni" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-white border border-gray-200">
              {tabItems.map((item, index) => (
                <TabsTrigger
                  key={index}
                  value={item.triggerValue}
                  className={`flex items-center gap-2 ${item.className
                    .map((cls) => `data-[state=active]:${cls}`)
                    .join(" ")}`}
                >
                  {item.icon}
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabItems.map((item, index) => (
              <TabsContent key={index} value={item.triggerValue}>
                {item.component}
              </TabsContent>
            ))}
          </Tabs>
        </section> */}
        <Footer />
        {/* Auth Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
        {/* Add AuthGuard at the end */}
        <AuthGuard />
      </div>
    </>
  );
}
