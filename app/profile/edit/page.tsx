"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  User,
  Globe,
  MessageCircle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { CustomAlert, type AlertType } from "@/components/custom-alert";
import { getProfileInfo } from "@/api/getProfileInfo";
import type {
  EditProfileFormData,
  EditProfileFormErrors,
  Profile,
} from "@/types/profileType";
import { AlertState, ConfirmState } from "@/types/alertType";
import { CustomConfirm } from "@/components/custom-confirm";
import { updateProfile } from "@/api/updateProfile";

const regions = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East",
];

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<EditProfileFormData>({
    id: "",
    username: "",
    region: "",
    discord: "",
  });
  const [errors, setErrors] = useState<EditProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const router = useRouter();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getProfileInfo();
        setProfile(data);
        setFormData({
          id: data.id,
          username: data.username,
          region: data.region,
          discord: data.discord,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showAlert(
          "error",
          "Error Loading Profile",
          "Failed to load profile data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    field: keyof EditProfileFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    confirmText?: string
  ) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
    });
  };

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));

    if (alert.type === "success") {
      setTimeout(() => {
        router.push("/profile");
      }, 300);
    }
  };

  //linked with update data process
  const handleClose = () => setConfirm((prev) => ({ ...prev, isOpen: false }));

  const updateData = async (formData: EditProfileFormData) => {
    handleClose();
    const res = await updateProfile(formData);
    if (res.message) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Profile Data Updated",
        message: "Your profile data has been updated",
      });
    } else {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Failed",
        message: "Failed to the update profile data",
      });
    }
  };
  //end linked with update data process

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setConfirm({
      isOpen: true,
      type: "warning",
      title: "Update Information?",
      message: `Are you sure you want to update your profile information?`,
      confirmText: "Update",
      cancelText: "Cancel",
      onConfirm: () => {
        updateData(formData);
        setConfirm({
          isOpen: false,
          type: "info",
          title: "",
          message: "",
          confirmText: "Confirm",
          cancelText: "Cancel",
        });
      },
      onClose: () => handleClose(),
    });
  };

  const handleCancel = () => {
    localStorage.removeItem("editProfile");
    router.push("/profile");
  };

  const handleBackProfile = () => {
    localStorage.removeItem("editProfile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              Unable to load your profile information.
            </p>
            <Button
              onClick={handleBackProfile}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* confirmation */}
      <CustomConfirm
        isOpen={confirm.isOpen}
        type={confirm.type}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        onConfirm={confirm.onConfirm ?? (() => {})}
        onClose={confirm.onClose ?? (() => {})}
      />

      {/* alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={handleAlertClose}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="inline-flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Profile</span>
          </button>
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">BARS</h1>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </nav>
      </header>

      {/* Edit Form */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center space-x-2">
              <User className="h-8 w-8" />
              <span>Edit Profile</span>
            </CardTitle>
            <p className="text-gray-300 text-center">
              Update your profile information
            </p>
          </CardHeader>

          <CardContent>
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                  {profile.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* <p className="text-gray-400 text-sm text-center">
                Profile picture updates coming soon
              </p> */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-white text-lg font-semibold flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Username</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="bg-white/10 border-white/20 text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
                  maxLength={30}
                  disabled={true} // You can also use readOnly={true}
                />
                <p className="text-gray-400 text-xs">
                  Your username cannot be changed.
                </p>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="text-white text-lg font-semibold flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Region</span>
                </Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange("region", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-pink-400">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {regions.map((region) => (
                      <SelectItem
                        key={region}
                        value={region}
                        className="text-white hover:bg-gray-800"
                      >
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-red-400 text-sm">{errors.region}</p>
                )}
                <p className="text-gray-400 text-xs">
                  Help other artists find collaborators in their region or
                  discover global talent.
                </p>
              </div>

              {/* Discord */}
              <div className="space-y-2">
                <Label
                  htmlFor="discord"
                  className="text-white text-lg font-semibold flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Discord Username</span>
                </Label>
                <Input
                  id="discord"
                  type="text"
                  placeholder="your discord username"
                  value={formData.discord}
                  onChange={(e) => handleInputChange("discord", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                  maxLength={32}
                  required
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center">
                  {errors.discord && (
                    <p className="text-red-400 text-sm">{errors.discord}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.discord?.length}/32
                  </p>
                </div>
                <p className="text-gray-400 text-xs">
                  Connect with other artists on Discord for real-time
                  collaboration and communication.
                </p>
              </div>

              {/* Read-only Stats */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile Statistics</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile.tracks}
                    </div>
                    <div className="text-gray-400 text-sm">Total Tracks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile.likes}
                    </div>
                    <div className="text-gray-400 text-sm">Total Likes</div>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-3 text-center">
                  These statistics are automatically updated based on your
                  activity.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin h-4 w-4" />
                      <span>Saving Changes...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Custom Alert */}
        <CustomAlert
          isOpen={alert.isOpen}
          onClose={handleAlertClose}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          confirmText={alert.confirmText}
        />
      </main>
    </div>
  );
}
