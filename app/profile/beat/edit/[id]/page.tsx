"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Music, Loader, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CustomAlert, type AlertType } from "@/components/custom-alert";
import { AlertState } from "@/types/alertType";
import { BeatFull, BeatUpdateFormErrors } from "@/types/beatType";
import { editBeat } from "@/api/editBeat";

const genres = [
  "Hip-Hop",
  "Trap",
  "R&B",
  "Pop",
  "Electronic",
  "House",
  "Techno",
  "Ambient",
  "Jazz",
  "Rock",
  "Reggae",
  "Drill",
  "Afrobeat",
  "Latin",
  "Other",
];

const updateBeat = async (
  id: string,
  data: Omit<
    BeatFull,
    | "id"
    | "file_url"
    | "likes"
    | "created_at"
    | "username"
    | "file_size"
    | "is_liked"
  >
) => {
  await editBeat(id, data);
};

export default function EditBeatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [beatId, setBeatId] = useState<string>("");
  const [beatData, setBeatData] = useState<BeatFull | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    tags: "",
  });
  const [errors, setErrors] = useState<BeatUpdateFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setBeatId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!beatId) return;

    const fetchBeat = async () => {
      setIsLoading(true);
      try {
        const data = JSON.parse(localStorage.getItem("editTrack") || "{}");
        console.log(data);
        setBeatData(data);
        setFormData({
          title: data.title,
          description: data.description,
          genre: data.genre,
          tags: data.tags,
        });
      } catch (error) {
        console.error("Failed to fetch beat:", error);
        showAlert(
          "error",
          "Error Loading Beat",
          "Failed to load beat data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeat();
  }, [beatId]);

  const validateForm = (): boolean => {
    const newErrors: BeatUpdateFormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (formData.title.length > 20) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Genre validation
    if (!formData.genre) {
      newErrors.genre = "Please select a genre";
    }

    // Tags validation
    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
    } else if (formData.tags.length > 200) {
      newErrors.tags = "Tags must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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

    // If it was a success alert, redirect to profile
    if (alert.type === "success") {
      setTimeout(() => {
        router.push("/profile");
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await updateBeat(beatId, formData);

      showAlert(
        "success",
        "Beat Updated Successfully!",
        "Your beat information has been updated and is now live. The changes will be visible to all users.",
        "Back to Profile"
      );
    } catch (error) {
      console.error("Failed to update beat:", error);
      showAlert(
        "error",
        "Update Failed",
        "We encountered an issue while updating your beat. Please check your connection and try again.",
        "Try Again"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editTrack");
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading beat data...</p>
        </div>
      </div>
    );
  }

  if (!beatData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Beat Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The beat you're trying to edit could not be found.
            </p>
            <Button
              onClick={handleCancel}
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
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="inline-flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Profile</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-white" />
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
              <Music className="h-8 w-8" />
              <span>Edit Beat</span>
            </CardTitle>
            <p className="text-gray-300 text-center">
              Update your beat information
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-white text-lg font-semibold"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter beat title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                  maxLength={20}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center">
                  {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.title.length}/20
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-white text-lg font-semibold"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your beat, the inspiration behind it, or how it should be used..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 min-h-[120px] resize-none"
                  maxLength={200}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.description.length}/200
                  </p>
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label
                  htmlFor="genre"
                  className="text-white text-lg font-semibold"
                >
                  Genre
                </Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => handleInputChange("genre", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-pink-400">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {genres.map((genre) => (
                      <SelectItem
                        key={genre}
                        value={genre}
                        className="text-white hover:bg-gray-800"
                      >
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <p className="text-red-400 text-sm">{errors.genre}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-white text-lg font-semibold"
                >
                  Tags
                </Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., chill, trap, melodic, dark, upbeat (separate with commas)"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                  maxLength={200}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center">
                  {errors.tags && (
                    <p className="text-red-400 text-sm">{errors.tags}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.tags.length}/200
                  </p>
                </div>
                <p className="text-gray-400 text-xs">
                  Use tags to help others discover your beat. Separate multiple
                  tags with commas.
                </p>
              </div>

              {/* Beat Info Display */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2">
                  Beat Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Likes:</span>
                    <span className="text-white ml-2">{beatData.likes}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">
                      {new Date(beatData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
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
