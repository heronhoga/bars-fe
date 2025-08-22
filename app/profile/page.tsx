"use client";

import {
  Music,
  ArrowLeft,
  Settings,
  Edit,
  Users,
  Heart,
  Play,
  Trash,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfileInfo } from "@/api/getProfileInfo";
import { BeatByProfile, Profile } from "@/types/profileType";
import { BeatByUser } from "@/types/beatType";
import { getBeatByUser } from "@/api/getBeatByUser";
import { getLikedBeatByUser } from "@/api/getLikedBeatByUser";
import { CustomAlert } from "@/components/custom-alert";
import { AlertState, ConfirmState } from "@/types/alertType";
import { useRouter } from "next/navigation";
import { deleteBeat } from "@/api/deleteBeat";
import { CustomConfirm } from "@/components/custom-confirm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>();
  const [myBeats, setMyBeats] = useState<BeatByUser[]>();
  const [likedBeats, setLikedBeats] = useState<BeatByUser[]>();
  const [beatPage, setBeatPage] = useState(1);
  const [likedPage, setLikedPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [likedTotalPages, setLikedTotalPages] = useState<number>(1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
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

  //fetch profile information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileInfo();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };

    fetchProfile();
  }, [beatPage]);

  //fetch account owned beats
  useEffect(() => {
    const fetchMyBeats = async () => {
      try {
        const response = await getBeatByUser(beatPage);
        setMyBeats(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };
    fetchMyBeats();
  }, [beatPage]);

  //fetch liked beats by users
  useEffect(() => {
    const fetchLikedBeats = async () => {
      try {
        const response = await getLikedBeatByUser(likedPage);
        console.log(response.data);
        setLikedBeats(response.data);
        setLikedTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };

    fetchLikedBeats();
  }, [likedPage]);

  //navigate to edit page
  const handleEdit = (track: BeatByProfile) => {
    localStorage.setItem("editTrack", JSON.stringify(track));
    router.push(`/profile/beat/edit/${track.id}`);
  };

  //end navigate to edit page

  //linked with confirm pop up
  const handleClose = () => setConfirm((prev) => ({ ...prev, isOpen: false }));

  const deleteData = async (id: string) => {
    //delete
    handleClose();
    const res = await deleteBeat(id);

    if (res.message) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Track Deletion Succeed",
        message: "The track has been successfully deleted",
      });

      //remove data from array
      setMyBeats((prev) => (prev ? prev.filter((beat) => beat.id !== id) : []));
    } else {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Track Deletion Failed",
        message: "Failed to the delete the track",
      });
    }
  };

  const handleConfirm = async (id: string) => {
    setConfirm({
      isOpen: true,
      type: "error",
      title: "Delete Item?",
      message: `Are you sure you want to delete this track?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        deleteData(id);
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

  //end linked with confirm pop up

  const togglePlay = (id: string, fileUrl: string) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      setCurrentlyPlaying(null);
    }

    if (currentlyPlaying !== id) {
      const newAudio = new Audio(fileUrl);
      newAudio.play();

      newAudio.onended = () => {
        setCurrentlyPlaying(null);
        setAudio(null);
      };

      setAudio(newAudio);
      setCurrentlyPlaying(id);
    }
  };

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
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
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
          <Button variant="ghost" className="text-white hover:text-pink-400">
            <Settings className="h-5 w-5" />
          </Button>
        </nav>
      </header>

      {/* Profile Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src="/placeholder.svg?height=128&width=128"
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile?.username}
                </h2>

                <div className="flex justify-center md:justify-start space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile?.tracks}
                    </div>
                    <div className="text-gray-400 text-sm">Tracks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile?.likes}
                    </div>
                    <div className="text-gray-400 text-sm">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile?.region}
                    </div>
                    <div className="text-gray-400 text-sm">Region</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile?.discord}
                    </div>
                    <div className="text-gray-400 text-sm">Discord</div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start space-x-4">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-pink-500 hover:bg-white/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger
              value="tracks"
              className="data-[state=active]:bg-white/20"
            >
              My Tracks
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="data-[state=active]:bg-white/20"
            >
              Liked
            </TabsTrigger>
          </TabsList>

          {/* My Tracks */}
          <TabsContent value="tracks" className="space-y-4">
            {myBeats?.map((track) => (
              <Card
                key={track.id}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        onClick={() => togglePlay(track.id, track.file_url)}
                        className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        {currentlyPlaying === track.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      <div>
                        {/* Title */}
                        <h4 className="text-2xl font-bold text-white mb-2">
                          {track.title}
                        </h4>

                        {/* Description */}
                        <p className="text-gray-300 leading-relaxed mb-2">
                          {track.description}
                        </p>

                        {/* Genre */}
                        {track.genre && (
                          <p className="text-gray-400 text-sm mb-2">
                            <span className="font-medium">Genre:</span>{" "}
                            {track.genre}
                          </p>
                        )}

                        {/* Tags */}
                        {track.tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {track.tags.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-pink-400/10 text-pink-300 text-xs font-medium border border-pink-400/20"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-white">{track.likes}</span>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => handleEdit(track)}
                      >
                        <Edit className="h-4 w-4 text-pink-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-red-400 hover:bg-red-500 hover:text-white"
                        onClick={() => handleConfirm(track.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={beatPage === 1}
                onClick={() => setBeatPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-white">
                Page {beatPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={beatPage === totalPages}
                onClick={() => setBeatPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Liked Tracks */}
          <TabsContent value="liked" className="space-y-4">
            {likedTotalPages > 0 ? (
              <>
                {likedBeats?.map((track) => (
                  <Card
                    key={track.id}
                    className="bg-white/10 backdrop-blur-sm border-white/20"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            size="sm"
                            onClick={() => togglePlay(track.id, track.file_url)}
                            className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 ml-0.5" />
                            )}
                          </Button>
                          <div>
                            {/* Title */}
                            <h4 className="text-2xl font-bold text-white mb-2">
                              {track.title}
                            </h4>

                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed mb-2">
                              {track.description}
                            </p>

                            {/* Genre */}
                            {track.genre && (
                              <p className="text-gray-400 text-sm mb-2">
                                <span className="font-medium">Genre:</span>{" "}
                                {track.genre}
                              </p>
                            )}

                            {/* Tags */}
                            {track.tags && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {track.tags.split(",").map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-pink-400/10 text-pink-300 text-xs font-medium border border-pink-400/20"
                                  >
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-white">{track.likes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    disabled={likedPage === 1}
                    onClick={() => setLikedPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-white">
                    Page {likedPage} of {likedTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={likedPage === likedTotalPages}
                    onClick={() => setLikedPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Your liked tracks will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
