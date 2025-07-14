import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserPlus,
} from "lucide-react";

interface personCardProps {
  person: any;
  handleButtonClick: (e?: any) => any;
}
const personCard = ({ person, handleButtonClick }: personCardProps) => {
  console.log(person);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={person.avatar || "/placeholder.svg"}
              alt={person.firstName}
            />
            <AvatarFallback> {person.firstName}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {`${person.lastName} ${person.firstName}`}
            </h3>
            <p className="text-sm text-gray-600 truncate">{person.email}</p>
            {/* <p className="text-sm font-medium text-blue-600 truncate">
              {person.company}
            </p> */}
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
            {/* {person.skills?.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))} */}
            {/* {person.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{person.skills.length - 3}
              </Badge>
            )} */}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={person.isConnected ? "outline" : "default"}
              onClick={() => handleButtonClick(person.userId)}
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
  );
};

export default personCard;
