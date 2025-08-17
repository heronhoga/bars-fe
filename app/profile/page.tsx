"use client";

import {
  Music,
  ArrowLeft,
  Settings,
  Edit,
  Users,
  Heart,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfileInfo } from "@/api/getProfileInfo";
import { Profile } from "@/types/profileType";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const data = await getProfileInfo();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };

    fetchBeats();
  }, []);

  const recentTracks = [
    { id: 1, title: "Midnight Vibes", plays: 1247, likes: 89 },
    { id: 2, title: "Urban Symphony", plays: 892, likes: 67 },
    { id: 3, title: "Neon Dreams", plays: 2156, likes: 134 },
  ];

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
                    className="border-white/20 text-white hover:bg-white/10"
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

          <TabsContent value="tracks" className="space-y-4">
            {recentTracks.map((track) => (
              <Card
                key={track.id}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        className="rounded-full w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div>
                        <h4 className="text-white font-semibold">
                          {track.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {track.plays} plays
                        </p>
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
          </TabsContent>

          <TabsContent value="liked">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  Your liked tracks will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
