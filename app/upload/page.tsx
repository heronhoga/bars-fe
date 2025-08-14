"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Music,
  Play,
  Pause,
  X,
  FileAudio,
  AlertCircle,
} from "lucide-react";
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
import Link from "next/link";
import { CustomAlert, type AlertType } from "@/components/custom-alert";
import { useRouter } from "next/navigation";
import { AlertState } from "@/types/alertType";
import { UploadFormData, UploadFormErrors } from "@/types/uploadType";
import { createNewBeat } from "@/api/createNewBeat";

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

export default function UploadPage() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    genre: "",
    tags: "",
    file: null,
  });

  const [errors, setErrors] = useState<UploadFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: UploadFormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
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

    // File validation
    if (!formData.file) {
      newErrors.file = "Please select an audio file";
    } else {
      const allowedTypes = ["audio/mpeg", "audio/mp3"];
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = "Please select a valid audio file (MP3)";
      } else if (formData.file.size > 5 * 1024 * 1024) {
        // 5 MB limit
        newErrors.file = "File size must be less than 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof Omit<UploadFormData, "file">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, file }));

    // Clear file error
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: undefined }));
    }

    // Create audio preview
    if (audioPreview) {
      audioPreview.pause();
      setAudioPreview(null);
      setIsPlaying(false);
    }

    const audio = new Audio(URL.createObjectURL(file));
    setAudioPreview(audio);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      handleFileSelect(file);
    }
  };

  const toggleAudioPreview = () => {
    if (!audioPreview) return;

    if (isPlaying) {
      audioPreview.pause();
      setIsPlaying(false);
    } else {
      audioPreview.play();
      setIsPlaying(true);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (audioPreview) {
      audioPreview.pause();
      setAudioPreview(null);
      setIsPlaying(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        router.push("/home");
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("genre", formData.genre);
      uploadData.append("tags", formData.tags);
      if (formData.file) {
        uploadData.append("file", formData.file);
      }

      const res = await createNewBeat(uploadData);

      console.log(res);

      if (res.message == "New Beat successfully created") {
        showAlert(
          "success",
          "Beat Uploaded Successfully!",
          "Your beat has been uploaded and is now live on BARS! The community can now discover and enjoy your creation. Keep creating and sharing your musical talent!",
          "Back to Home"
        );

        // Reset form
        setFormData({
          title: "",
          description: "",
          genre: "",
          tags: "",
          file: null,
        });
        removeFile();
      } else {
        showAlert(
          "error",
          "Upload Failed",
          "We encountered an issue while uploading your beat. This could be due to a server error or network issue. Please try again or contact support if the problem persists.",
          "Try Again"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlert(
        "error",
        "Upload Error",
        "An unexpected error occurred while uploading your beat. Please check your internet connection and try again.",
        "Retry"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">BARS</h1>
          </div>
          <div className="w-24"></div>
        </nav>
      </header>

      {/* Upload Form */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center space-x-2">
              <Upload className="h-8 w-8" />
              <span>Upload New Beat</span>
            </CardTitle>
            <p className="text-gray-300 text-center">
              Share your latest creation with the BARS community
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-white text-lg font-semibold">
                  Audio File
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-pink-400 bg-pink-400/10"
                      : "border-white/30 hover:border-white/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {formData.file ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <FileAudio className="h-8 w-8 text-green-400" />
                        <div className="text-left">
                          <p className="text-white font-medium">
                            {formData.file.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatFileSize(formData.file.size)}
                          </p>
                        </div>
                      </div>

                      {audioPreview && (
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            type="button"
                            onClick={toggleAudioPreview}
                            className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 ml-0.5" />
                            )}
                          </Button>
                          <span className="text-gray-300 text-sm">
                            Preview your beat
                          </span>
                        </div>
                      )}

                      <Button
                        type="button"
                        onClick={removeFile}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20 bg-transparent"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-white font-medium mb-2">
                          Drop your audio file here
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          or click to browse
                        </p>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Choose File
                        </Button>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Supported formats: MP3 (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {errors.file && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.file}</span>
                  </div>
                )}
              </div>

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
                  placeholder="Enter your beat title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                  maxLength={100}
                />
                <div className="flex justify-between items-center">
                  {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.title.length}/100
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
                  onChange={(e: any) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 min-h-[120px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.description.length}/500
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-3 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading Beat...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Beat</span>
                  </div>
                )}
              </Button>
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
