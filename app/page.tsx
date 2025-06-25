"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { useAuth } from "@/contexts/auth-context";
import {
  Users,
  Briefcase,
  MessageSquare,
  Calendar,
  UserCheck,
  Search,
  MapPin,
  Building,
  GraduationCap,
  Star,
  Clock,
  ArrowRight,
  Award,
  Heart,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { getRoleBadgeColor } from "@/utils/get-role-badge-color"; // Declare the variable before using it

// Import the auth guard hook at the top
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

// Mock data (same as before)
const featuredAlumni = [
  {
    id: 1,
    name: "Nguyễn Thị Mai",
    position: "Senior Product Manager",
    company: "Google Vietnam",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Ho Chi Minh City",
    year: "2018",
    achievement: "Led product team of 15+ engineers",
  },
  {
    id: 2,
    name: "Trần Văn Đức",
    position: "Tech Lead",
    company: "Shopee",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Singapore",
    year: "2017",
    achievement: "Built microservices architecture",
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    position: "Data Scientist",
    company: "VinAI Research",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Ha Noi",
    year: "2019",
    achievement: "Published 10+ AI research papers",
  },
];

const featuredJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechViet Solutions",
    location: "Ho Chi Minh City",
    type: "Full-time",
    salary: "$2,000 - $3,500",
    posted: "2 days ago",
    applicants: 24,
    remote: true,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Ha Noi",
    type: "Full-time",
    salary: "$1,800 - $3,000",
    posted: "1 week ago",
    applicants: 18,
    remote: false,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    salary: "$25 - $40/hour",
    posted: "3 days ago",
    applicants: 31,
    remote: true,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Alumni Networking Night 2024",
    date: "Dec 15, 2024",
    time: "18:00 - 21:00",
    location: "FPT University Campus",
    attendees: 156,
    type: "Networking",
  },
  {
    id: 2,
    title: "Tech Talk: AI in Software Development",
    date: "Dec 20, 2024",
    time: "19:00 - 20:30",
    location: "Online",
    attendees: 89,
    type: "Workshop",
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "Jan 10, 2025",
    time: "09:00 - 17:00",
    location: "FPT University Campus",
    attendees: 234,
    type: "Career",
  },
];

const forumPosts = [
  {
    id: 1,
    title: "Tips for transitioning from student to professional developer",
    author: "Phạm Văn Nam",
    replies: 23,
    likes: 45,
    time: "2 hours ago",
    category: "Career",
  },
  {
    id: 2,
    title: "Remote work best practices - Share your experience",
    author: "Trần Thị Lan",
    replies: 18,
    likes: 32,
    time: "5 hours ago",
    category: "Work Life",
  },
  {
    id: 3,
    title: "Startup funding in Vietnam - Current landscape",
    author: "Lê Minh Tuấn",
    replies: 15,
    likes: 28,
    time: "1 day ago",
    category: "Business",
  },
];

const mentors = [
  {
    id: 1,
    name: "Dr. Nguyễn Văn A",
    expertise: "Software Architecture",
    company: "Microsoft",
    experience: "15+ years",
    rating: 4.9,
    sessions: 127,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Trần Thị B",
    expertise: "Product Management",
    company: "Google",
    experience: "10+ years",
    rating: 4.8,
    sessions: 89,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Lê Văn C",
    expertise: "Data Science",
    company: "VinAI",
    experience: "8+ years",
    rating: 4.9,
    sessions: 64,
    avatar: "/placeholder.svg?height=50&width=50",
  },
];

// Add the auth guard hook in the component
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, logout } = useAuth();
  const { requireAuth, AuthGuard } = useAuthGuard(); // Add this line
  const router = useRouter();

  // Add auth-protected handlers for guest interactions
  const handleConnectClick = () => {
    if (
      !requireAuth({
        title: "Connect with Alumni",
        description:
          "Sign in to connect with FPT University alumni and expand your network",
        actionText: "alumni connections",
      })
    )
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

  const handleRegisterEventClick = () => {
    if (
      !requireAuth({
        title: "Register for Events",
        description:
          "Sign in to register for alumni events and networking opportunities",
        actionText: "event registration",
      })
    )
      return;
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

  // const handleStartDiscussionClick = () => {
  //   if (
  //     !requireAuth({
  //       title: "Join Discussions",
  //       description:
  //         "Sign in to participate in forum discussions and share your thoughts",
  //       actionText: "forum discussions",
  //     })
  //   )
  //     return;

  //   // Handle discussion logic here
  //   console.log("Starting discussion...");
  // };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Connect with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FPT Alumni
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join thousands of FPT University alumni worldwide. Network, find
                opportunities, share knowledge, and grow your career together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search alumni, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 px-8"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explore Network
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  2,847
                </div>
                <div className="text-gray-600">Alumni Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  156
                </div>
                <div className="text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  89
                </div>
                <div className="text-gray-600">Mentors Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  12
                </div>
                <div className="text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Tabs defaultValue="alumni" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-white border border-gray-200">
              <TabsTrigger
                value="alumni"
                className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <Users className="h-4 w-4" />
                Alumni
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
              >
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="mentoring"
                className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
              >
                <UserCheck className="h-4 w-4" />
                Mentoring
              </TabsTrigger>
              <TabsTrigger
                value="forums"
                className="flex items-center gap-2 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700"
              >
                <MessageSquare className="h-4 w-4" />
                Forums
              </TabsTrigger>
            </TabsList>

            {/* Alumni Tab */}
            <TabsContent value="alumni">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Featured Alumni
                  </h2>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => router.push("/network")}
                  >
                    View All Alumni
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredAlumni.map((alumni) => (
                    <Card
                      key={alumni.id}
                      className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-blue-300"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-16 h-16 ring-2 ring-blue-100">
                            <AvatarImage
                              src={alumni.avatar || "/placeholder.svg"}
                              alt={alumni.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {alumni.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {alumni.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {alumni.position}
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              {alumni.company}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {alumni.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Class of {alumni.year}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Award className="h-4 w-4 mr-2" />
                            {alumni.achievement}
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={handleConnectClick}
                        >
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs">
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
                  {featuredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-green-300"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {job.company}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-green-100 text-green-800 border-green-200"
                          >
                            {job.type}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {job.location}
                            {job.remote && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs border-blue-200 text-blue-700"
                              >
                                Remote OK
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            {job.salary}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            Posted {job.posted} • {job.applicants} applicants
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          onClick={handleApplyJobClick}
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Events
                  </h2>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => router.push("/events")}
                  >
                    Create Event
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-orange-300"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            variant="outline"
                            className="mb-2 border-orange-200 text-orange-700"
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-3">
                          {event.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-2" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          onClick={handleRegisterEventClick}
                        >
                          Register Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Mentoring Tab */}
            <TabsContent value="mentoring">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Top Mentors
                  </h2>
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => router.push("/mentoring")}
                  >
                    Become a Mentor
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card
                      key={mentor.id}
                      className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-purple-300"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <Avatar className="w-16 h-16 ring-2 ring-yellow-100">
                            <AvatarImage
                              src={mentor.avatar || "/placeholder.svg"}
                              alt={mentor.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                              {mentor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {mentor.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mentor.expertise}
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              {mentor.company}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium text-gray-900">
                              {mentor.experience}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium ml-1 text-gray-900">
                                {mentor.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Sessions:</span>
                            <span className="font-medium text-gray-900">
                              {mentor.sessions}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={handleBookMentorClick}
                        >
                          Book Session
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Forums Tab */}
            <TabsContent value="forums">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Popular Discussions
                  </h2>
                  <Button
                    variant="outline"
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                    onClick={() => router.push("/forums")}
                  >
                    Start Discussion
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="hover:shadow-md transition-all duration-300 border border-gray-200 bg-white hover:border-pink-300"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-pink-100 text-pink-800 border-pink-200"
                              >
                                {post.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {post.time}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              by {post.author}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {post.replies} replies
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes} likes
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
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
