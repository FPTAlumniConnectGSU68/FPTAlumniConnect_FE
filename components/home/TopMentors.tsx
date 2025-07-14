import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabsContent } from "@/components/ui/tabs";
import { Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Mentor } from "@/types/interfaces";

interface MentorsProps {
  mentors: Mentor[];
  handleClick: () => any;
}

const TopMentors = ({ mentors, handleClick }: MentorsProps) => {
  console.log(mentors);

  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Top Mentors</h2>
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
        {mentors.map((mentor, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-purple-300"
          >
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-16 h-16 ring-2 ring-yellow-100">
                  <AvatarImage
                    src={mentor.profilePicture || "/placeholder.svg"}
                    alt={mentor.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {mentor.firstName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {`${mentor.lastName} ${mentor.firstName}`}
                  </h3>
                  <p className="text-sm text-gray-600">{mentor.majorName}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-1 mt-[2px] text-gray-900">
                      {mentor.rating}
                    </span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                {/* <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium text-gray-900">
                    {mentor.sessions}
                  </span>
                </div> */}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleClick}
              >
                Book Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopMentors;
