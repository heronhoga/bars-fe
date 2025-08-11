"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  User,
  Home,
  Search,
  Music,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { BeatFull } from "@/types/beatType";
import { getAllBeats } from "@/api/getAllBeats";

const generateMockShowcase = (id: number): BeatFull => {
  const artists = [
    "DJ Shadow",
    "MC Flow",
    "BeatMaker Pro",
    "Lyrical Genius",
    "SynthWave Collective",
    "Wordsmith",
    "The Producer",
    "Code Beats",
    "Vocal Harmony",
    "Bass Master",
    "Rhythm King",
    "Melody Queen",
    "Sound Engineer",
    "Mix Master",
    "Beat Creator",
  ];

  const titles = [
    "Midnight Vibes",
    "Urban Symphony",
    "Neon Dreams",
    "Street Poetry",
    "Digital Harmony",
    "Electric Pulse",
    "Cosmic Beats",
    "Underground Flow",
    "Stellar Sounds",
    "Rhythm Revolution",
    "Sonic Waves",
    "Beat Laboratory",
    "Musical Journey",
    "Sound Fusion",
    "Harmony Heights",
  ];

  const tags = [
    "Hip-Hop",
    "Electronic",
    "R&B",
    "Pop",
    "Jazz",
    "Rock",
    "Ambient",
    "Trap",
    "House",
    "Techno",
  ];

  const artist = artists[Math.floor(Math.random() * artists.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];

  return {
    id,
    title,
    artist,
    artistAvatar: `/placeholder.svg?height=40&width=40&query=${artist.replace(
      " ",
      "+"
    )}+avatar`,
    likes: Math.floor(Math.random() * 5000) + 100,
    duration: `${Math.floor(Math.random() * 3) + 2}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}`,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: `/placeholder.svg?height=300&width=300&query=${title.replace(
      " ",
      "+"
    )}+music+cover`,
    timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
    description: `New collaboration featuring ${artist}. This track blends modern beats with classic vibes.`,
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
  };
};

export default function HomePage() {
  const [showcases, setShowcases] = useState<BeatFull[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load initial data
  useEffect(() => {
    loadShowcases(1);
  }, []);

  const loadShowcases = async (pageNum: number) => {
    setLoading(true);

    const data = await getAllBeats(pageNum);
    setShowcases(data);
    setLoading(false);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadShowcases(nextPage);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(id);
    }
  };

  const toggleLike = (id: number) => {
    setShowcases((prev) =>
      prev.map((showcase) =>
        showcase.id === id
          ? {
              ...showcase,
              isLiked: !showcase.isLiked,
              likes: showcase.isLiked ? showcase.likes - 1 : showcase.likes + 1,
            }
          : showcase
      )
    );
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">BARS</h1>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/home"
                className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to Your Feed
            </h2>
            <p className="text-gray-300">
              Discover the latest music collaborations from artists worldwide
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {showcases.map((showcase) => (
              <Card
                key={showcase.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg rounded-2xl"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Title & Description */}
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {showcase.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {showcase.description}
                    </p>
                  </div>

                  {/* Username */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                      <Link
                        href={`https://discordapp.com/users/${showcase.username}`}
                        className="text-indigo-300 hover:text-indigo-200 transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {showcase.username}
                      </Link>
                    </span>
                  </div>

                  {/* Upload date */}
                  <p className="text-gray-400 text-sm">
                    Uploaded on{" "}
                    <span className="font-medium">
                      {new Date(showcase.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </p>

                  {/* Tags */}
                  {showcase.tags && (
                    <div className="flex flex-wrap gap-2">
                      {showcase.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-pink-400/10 text-pink-300 text-xs font-medium border border-pink-400/20"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(showcase.id)}
                      className={`flex items-center space-x-2 ${
                        showcase.isLiked ? "text-pink-400" : "text-gray-400"
                      } hover:text-pink-400 transition`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          showcase.isLiked ? "fill-current" : ""
                        }`}
                      />
                      <span>{showcase.likes}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
            </div>
          )}

          {/* End of Feed */}
          {!hasMore && showcases.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                You've reached the end of your feed!
              </p>
              <Button
                onClick={() => {
                  setPage(1);
                  setHasMore(true);
                  loadShowcases(1);
                }}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Refresh Feed
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
