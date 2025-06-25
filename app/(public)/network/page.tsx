"use client";

import { useState } from "react";
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
  const [alumni, setAlumni] = useState(alumniData);

  const handleConnect = (alumniId: string) => {
    setAlumni(
      alumni.map((person) =>
        person.id === alumniId
          ? { ...person, isConnected: !person.isConnected }
          : person
      )
    );
  };

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "all" || person.location.includes(locationFilter);

    const matchesSkill =
      skillFilter === "all" ||
      person.skills.some((skill) =>
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );

    return matchesSearch && matchesLocation && matchesSkill;
  });

  const connectedAlumni = alumni.filter((person) => person.isConnected);

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
        <div className="flex flex-col gap-4">
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
                {filteredAlumni.map((person) => (
                  <Card
                    key={person.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={person.avatar || "/placeholder.svg"}
                            alt={person.name}
                          />
                          <AvatarFallback>
                            {person.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {person.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {person.position}
                          </p>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {person.company}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {person.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          Class of {person.graduationYear} • {person.major}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {person.connections} connections
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {person.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {person.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{person.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={person.isConnected ? "outline" : "default"}
                            onClick={() => handleConnect(person.id)}
                            className="flex-1"
                          >
                            {person.isConnected ? (
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedAlumni.map((person) => (
                  <Card
                    key={person.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={person.avatar || "/placeholder.svg"}
                            alt={person.name}
                          />
                          <AvatarFallback>
                            {person.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {person.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {person.position}
                          </p>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {person.company}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {person.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          Class of {person.graduationYear}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {person.interests.slice(0, 2).map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {connectedAlumni.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">
                      You haven't connected with any alumni yet.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Start building your network by connecting with fellow
                      alumni!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
