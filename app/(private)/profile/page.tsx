"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "alumni":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="p-6 col-span-2">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.avatar || "/placeholder-user.jpg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-600">{"No bio provided yet."}</p>
          </div>

          {/* Role-specific sections */}
          {user.role === "admin" && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Administrative Access</h3>
              <p className="text-gray-600">
                You have administrative privileges to manage users and system
                settings.
              </p>
            </div>
          )}

          {user.role === "alumni" && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Alumni Information</h3>
              <p className="text-gray-600">
                Graduation Year: {user.graduationYear || "Not specified"}
                <br />
                Current Position: {"Not specified"}
                <br />
                Company: {user.company || "Not specified"}
              </p>
            </div>
          )}

          {user.role === "student" && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Student Information</h3>
              <p className="text-gray-600">
                Student ID: {user.studentId || "Not specified"}
                <br />
                Major: {user.major || "Not specified"}
                <br />
                Expected Graduation: {"Not specified"}
              </p>
            </div>
          )}
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Phone: {"Not provided"}</p>
              <p className="text-sm text-gray-600">
                Location: {"Not provided"}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Account Settings</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Member since: {"Not available"}
              </p>
              <p className="text-sm text-gray-600">
                Last updated: {"Not available"}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
