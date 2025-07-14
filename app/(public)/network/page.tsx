"use client";

import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useUsers } from "@/hooks/use-user";
import AlumniCard from "@/components/network/AlumniCard";
import { User } from "@/types/interfaces";
import { isApiSuccess } from "@/lib/utils";
// Mock alumni data
const alumniData = [
  {
    id: "alumni_1",
    name: "Trần Thị Mai",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "Senior Product Manager",
    company: "Google Vietnam",
    location: "Ho Chi Minh City",
    graduationYear: "2018",
    major: "Computer Science",
    skills: ["Product Management", "Data Analysis", "UX Design"],
    interests: ["AI/ML", "Startup", "Mentoring"],
    connections: 245,
    isConnected: false,
  },
  {
    id: "alumni_2",
    name: "Lê Văn Đức",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "Tech Lead",
    company: "Shopee",
    location: "Singapore",
    graduationYear: "2017",
    major: "Software Engineering",
    skills: ["Java", "Microservices", "System Design"],
    interests: ["Backend Development", "Cloud Computing"],
    connections: 189,
    isConnected: true,
  },
  {
    id: "alumni_3",
    name: "Nguyễn Thị Lan",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "Data Scientist",
    company: "VinAI Research",
    location: "Ha Noi",
    graduationYear: "2019",
    major: "Information Technology",
    skills: ["Python", "Machine Learning", "Deep Learning"],
    interests: ["AI Research", "Data Science", "Academia"],
    connections: 156,
    isConnected: false,
  },
  {
    id: "alumni_4",
    name: "Phạm Minh Tuấn",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "Founder & CEO",
    company: "TechStartup Vietnam",
    location: "Ho Chi Minh City",
    graduationYear: "2016",
    major: "Business Information Technology",
    skills: ["Leadership", "Business Strategy", "Fundraising"],
    interests: ["Entrepreneurship", "Fintech", "Investment"],
    connections: 312,
    isConnected: false,
  },
  {
    id: "alumni_5",
    name: "Hoàng Thị Hương",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "UX Designer",
    company: "Grab",
    location: "Singapore",
    graduationYear: "2020",
    major: "Digital Art & Design",
    skills: ["UI/UX Design", "Figma", "User Research"],
    interests: ["Design Systems", "Mobile UX", "Accessibility"],
    connections: 98,
    isConnected: false,
  },
  {
    id: "alumni_6",
    name: "Vũ Đình Nam",
    role: "alumni",
    avatar: "/placeholder.svg?height=60&width=60",
    position: "DevOps Engineer",
    company: "Amazon Web Services",
    location: "Sydney, Australia",
    graduationYear: "2018",
    major: "Network & System Administration",
    skills: ["AWS", "Kubernetes", "Terraform"],
    interests: ["Cloud Infrastructure", "Automation", "Security"],
    connections: 167,
    isConnected: true,
  },
];

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [alumni, setAlumni] = useState<any[]>();
  const [query, setQuery] = useState("");

  const { data: users, isLoading } = useUsers({
    page: 1,
    role: "2",
    query: {
      query,
    },
  });

  useEffect(() => {
    if (users && isApiSuccess(users) && users.data?.items) {
      const enriched = users.data.items.map((user) => ({
        ...user,
        isConnected: Math.random() < 0.5,
      }));
      setAlumni(enriched);
    }
  }, [users]);

  const handleConnect = (alumniId: string) => {
    console.log("connect to: " + alumniId);

    // if (alumni) {
    //   setAlumni(
    //     alumni.map((person) =>
    //       person.id === alumniId
    //         ? { ...person, isConnected: !person.isConnected }
    //         : person
    //     )
    //   );
    // }
  };

  const handleMsg = (alumniId: string) => {
    console.log("msg to:" + alumniId);
  };

  const filteredAlumni = useMemo(() => {
    return alumni;
  }, [alumni, searchTerm, locationFilter, skillFilter]);

  const connectedAlumni = useMemo(() => {
    if (alumni) {
      return alumni.filter((person) => person.isConnected);
    }
  }, [alumni, searchTerm, locationFilter, skillFilter]);

  // const filteredAlumni = alumni.filter((person) => {
  //   const matchesSearch =
  //     person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     person.position.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesLocation =
  //     locationFilter === "all" || person.location.includes(locationFilter);

  //   const matchesSkill =
  //     skillFilter === "all" ||
  //     person.skills.some((skill) =>
  //       skill.toLowerCase().includes(skillFilter.toLowerCase())
  //     );

  //   return matchesSearch && matchesLocation && matchesSkill;
  // });

  // const connectedAlumni = alumni.filter((person) => person.isConnected);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>
          <p className="text-gray-600">
            Connect with fellow FPT University alumni worldwide
          </p>
        </div>
      </div>
      <div className="bg-white mt-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col gap-4 w-full">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, company, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Ho Chi Minh City">
                      Ho Chi Minh City
                    </SelectItem>
                    <SelectItem value="Ha Noi">Ha Noi</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Skills" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="Product Management">
                      Product Management
                    </SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="AWS">AWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Network Tabs */}
          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discover">Discover Alumni</TabsTrigger>
              <TabsTrigger value="connections">My Connections</TabsTrigger>
            </TabsList>

            {/* Discover Tab */}
            <TabsContent value="discover">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isLoading && (
                  <>
                    {filteredAlumni &&
                      filteredAlumni.map((person, index) => (
                        <AlumniCard
                          person={person}
                          handleButtonClick={
                            person.isConnected ? handleMsg : handleConnect
                          }
                          key={index}
                        />
                      ))}
                  </>
                )}
              </div>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections">
              {!isLoading && (
                <>
                  {connectedAlumni && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connectedAlumni.map((person, index) => (
                          <AlumniCard
                            person={person}
                            handleButtonClick={
                              person.isConnected ? handleMsg : handleConnect
                            }
                            key={index}
                          />
                        ))}
                      </div>
                      {connectedAlumni.length === 0 && (
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-gray-500">
                              You haven't connected with any alumni yet.
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              Start building your network by connecting with
                              fellow alumni!
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
