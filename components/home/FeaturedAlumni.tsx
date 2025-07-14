import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Award, GraduationCap, MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AlumniProp {
  featuredAlumni: any[];
  handleClick: () => any;
}
const FeaturedAlumni = ({ featuredAlumni, handleClick }: AlumniProp) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Featured Alumni</h2>
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
        {featuredAlumni.map((alumni, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-blue-300"
          >
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16 ring-2 ring-blue-100">
                  <AvatarImage
                    src={alumni.avatar || "/placeholder.svg"}
                    alt={alumni.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {alumni.firstName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {`${alumni.lastName} ${alumni.firstName}`}
                  </h3>
                  <p className="text-sm text-gray-600">{alumni.email}</p>
                  <p className="text-sm font-medium text-blue-600">
                    {/* {alumni.company} */}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  {/* <MapPin className="h-4 w-4 mr-2" />
                  {alumni.location} */}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {/* <GraduationCap className="h-4 w-4 mr-2" />
                  Class of {alumni.year} */}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {/* <Award className="h-4 w-4 mr-2" />
                  {alumni.achievement} */}
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleClick}
              >
                Connect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedAlumni;
