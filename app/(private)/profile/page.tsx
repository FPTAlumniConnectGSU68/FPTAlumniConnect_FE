"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  School,
  Shield,
  User2,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roleConfigs = {
    Admin: {
      color: "bg-red-50 text-red-800 border border-red-200",
      icon: Shield,
      description: "System administrator with full access privileges",
    },
    Alumni: {
      color: "bg-blue-50 text-blue-800 border border-blue-200",
      icon: GraduationCap,
      description: "Graduate of FPT University",
    },
    Student: {
      color: "bg-yellow-50 text-yellow-800 border border-yellow-200",
      icon: School,
      description: "Current student at FPT University",
    },
  };

  const roleConfig = roleConfigs[user.roleName as keyof typeof roleConfigs] || {
    color: "bg-gray-50 text-gray-800 border border-gray-200",
    icon: User2,
    description: "User",
  };

  const RoleIcon = roleConfig.icon;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center gap-3 text-gray-600">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="min-w-[100px] text-gray-500">{label}:</span>
      <span className="font-medium">{value || "Not specified"}</span>
    </div>
  );

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-gray-100">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={user.firstName || ""}
              />
              <AvatarFallback className="text-xl">
                {user.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge className={roleConfig.color}>
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {user.roleName.toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-600">{roleConfig.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Basic Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                CONTACT INFORMATION
              </h3>
              <div className="space-y-3">
                <InfoItem icon={Mail} label="Email" value="" />
                <InfoItem icon={Phone} label="Phone" value="" />
                <InfoItem icon={MapPin} label="Location" value="" />
              </div>
            </div>
          </div>

          {/* Middle Column - Role Specific Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                {user.roleName.toUpperCase()} INFORMATION
              </h3>
              <div className="space-y-3">
                {user.roleName === "Alumni" && (
                  <>
                    <InfoItem icon={Calendar} label="Graduated" value="" />
                    <InfoItem icon={Building2} label="Company" value="" />
                    <InfoItem icon={User2} label="Position" value="" />
                  </>
                )}
                {user.roleName === "Student" && (
                  <>
                    <InfoItem icon={School} label="Student ID" value="" />
                    <InfoItem icon={GraduationCap} label="Major" value="" />
                    <InfoItem
                      icon={Calendar}
                      label="Expected Graduation"
                      value=""
                    />
                  </>
                )}
                {user.roleName === "Admin" && (
                  <p className="text-gray-600">
                    You have full administrative access to manage users,
                    content, and system settings.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">ABOUT</h3>
              <p className="text-gray-600">No bio provided yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
