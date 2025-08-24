"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/use-user";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { GraduationCap, School, Shield, User2 } from "lucide-react";
import { downscaleImage } from "@/lib/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.userId ?? 0;
  const { data: userData } = useGetUser(userId);
  const userUnique = userData?.status === "success" && userData?.data;

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

  const roleName = user?.roleName ?? "User";
  const roleConfig = roleConfigs[roleName as keyof typeof roleConfigs] || {
    color: "bg-gray-50 text-gray-800 border border-gray-200",
    icon: User2,
    description: "User",
  };

  const RoleIcon = roleConfig.icon;

  const [form, setForm] = useState({
    code: "",
    firstName: "",
    lastName: "",
    email: "",
    isMentor: false,
    profilePicture: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSource, setImageSource] = useState<"cloudinary" | "url">(
    "cloudinary"
  );
  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    if (!userUnique) return;
    setForm({
      code: userUnique.code || "",
      firstName: userUnique.firstName || "",
      lastName: userUnique.lastName || "",
      email: userUnique.email || "",
      isMentor: !!userUnique.isMentor,
      profilePicture: userUnique.profilePicture || "",
    });
    setAvatarPreview(userUnique.profilePicture || "/placeholder.svg");
  }, [userUnique]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      // Preview right away (local object URL)
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Downscale/compress then upload to Cloudinary
      setUploading(true);
      const compressedBlob = await downscaleImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      const url = await uploadImageToCloudinary(compressedBlob, {
        folder: "profiles",
      });
      setForm((prev) => ({ ...prev, profilePicture: url }));
      toast.success("Avatar uploaded");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyImageUrl = () => {
    try {
      if (!imageUrlInput.trim()) {
        toast.error("Please enter an image URL");
        return;
      }
      try {
        // Validate URL
        // eslint-disable-next-line no-new
        new URL(imageUrlInput.trim());
      } catch {
        toast.error("Invalid URL format");
        return;
      }
      setForm((prev) => ({ ...prev, profilePicture: imageUrlInput.trim() }));
      setAvatarPreview(imageUrlInput.trim());
      toast.success("Image URL applied");
    } catch (err: any) {
      toast.error(err?.message || "Failed to set image URL");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleMentor = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isMentor: checked }));
  };

  const handleReset = () => {
    if (!userUnique) return;
    setForm({
      code: userUnique.code || "",
      firstName: userUnique.firstName || "",
      lastName: userUnique.lastName || "",
      email: userUnique.email || "",
      isMentor: !!userUnique.isMentor,
      profilePicture: userUnique.profilePicture || "",
    });
    setAvatarPreview(userUnique.profilePicture || "/placeholder.svg");
  };

  const handleSave = async () => {
    try {
      if (uploading) {
        toast.info("Please wait for the image upload to finish");
        return;
      }
      setSaving(true);
      console.log(form);
      await APIClient.invoke({
        action: ACTIONS.PATCH_MENTOR_USER,
        idQuery: String(userId),
        data: {
          code: form.code,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          isMentor: form.isMentor,
          profilePicture: form.profilePicture,
        },
      });

      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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

  if (!user || !userUnique) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-2 ring-gray-100">
                <AvatarImage src={avatarPreview} alt={form.firstName || ""} />
                <AvatarFallback className="text-xl">
                  {form.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {imageSource === "cloudinary" && (
                <label className="absolute -bottom-2 -right-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <span className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-blue-600 text-white cursor-pointer shadow">
                    {uploading ? "Uploading..." : "Upload"}
                  </span>
                </label>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold">
                  {form.firstName} {form.lastName}
                </h1>
                <Badge className={roleConfig.color}>
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {userUnique.roleName.toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-600">{roleConfig.description}</p>
              <div className="mt-3">
                <Tabs
                  value={imageSource}
                  onValueChange={(v) =>
                    setImageSource(v as "cloudinary" | "url")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="cloudinary" disabled={uploading}>
                      Local upload
                    </TabsTrigger>
                    <TabsTrigger value="url" disabled={uploading}>
                      Image URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="cloudinary">
                    <p className="text-xs text-gray-500 mt-2">
                      Choose a local image to upload via Cloudinary.
                    </p>
                  </TabsContent>
                  <TabsContent value="url">
                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                      />
                      <Button size="sm" onClick={handleApplyImageUrl}>
                        Apply
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Profile Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="code">Student/Employee Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="K16..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <span className="text-xs text-gray-500">Role</span>
                <span className="font-medium">{userUnique.roleName}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-xs text-gray-500">Major</span>
                <span className="font-medium">{userUnique.majorName}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 justify-end">
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
