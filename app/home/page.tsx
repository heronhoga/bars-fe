"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  Heart,
  Plus,
  User,
  Home,
  Search,
  Music,
  LogOut,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { BeatFull } from "@/types/beatType";
import { getAllBeats } from "@/api/getAllBeats";
import { likeBeat } from "@/api/likeBeat";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const [showcases, setShowcases] = useState<BeatFull[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  //stop music when navigate to other pages
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setCurrentlyPlaying(null);
  }, [pathname]);

    useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);
  //end stop music when navigate to other pages

  // Load initial data
  useEffect(() => {
    loadShowcases(1);
  }, []);

  const loadShowcases = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getAllBeats(pageNum);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setShowcases(data);
        } else {
          setShowcases((prev) => [...prev, ...data]);
        }
      }
    } catch (error) {
      console.error("Error loading showcases:", error);
      setHasMore(false);
    }
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

  const togglePlay = (id: string, fileUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setCurrentlyPlaying(null);
    }

    if (currentlyPlaying !== id) {
      const newAudio = new Audio(fileUrl);
      audioRef.current = newAudio;
      newAudio.play();

      newAudio.onended = () => {
        setCurrentlyPlaying(null);
        audioRef.current = null;
      };

      setCurrentlyPlaying(id);
    }
  };

  const toggleLike = async (id: string) => {
    const res = await likeBeat(id);

    if (res.message) {
      setShowcases((prev) =>
        prev.map((showcase) => {
          if (showcase.id !== id) return showcase;

          return {
            ...showcase,
            is_liked: res.message === "Like added" ? "1" : "0",
            likes:
              res.message === "Like added"
                ? showcase.likes + 1
                : showcase.likes - 1,
          };
        })
      );
    }
  };

  const handleLogout = async () => {
    await fetch("/function/logout", { method: "POST" });
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
                className="border-white/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-colors"
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
                  {/* demo */}
                  <Button
                    size="sm"
                    onClick={() => togglePlay(showcase.id, showcase.file_url)}
                    className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {currentlyPlaying === showcase.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  {/* Title & Description */}
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {showcase.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed break-words">
                      {showcase.description}
                    </p>
                  </div>
                  {/* Username */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                      <Link
                        href={`https://discordapp.com/users/${showcase.discord}`}
                        className="text-indigo-300 hover:text-indigo-200 transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        By: {showcase.username} | Discord: {showcase.discord}
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
                      {showcase.tags.split(",").map((tag) => (
                        <span
                          key={`${showcase.id}-${tag.trim()}`}
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
                        showcase.is_liked ? "text-pink-400" : "text-gray-400"
                      } hover:text-pink-400 transition`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          Boolean(Number(showcase.is_liked))
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>{showcase.likes}</span>
                    </Button>
                    {/* Download button */}
                    <a
                      href={showcase.file_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 transition"
                      >
                        <Download className="h-5 w-5" />
                        <span>Download</span>
                      </Button>
                    </a>
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
                  window.location.href = "/home";
                }}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Refresh Feed
              </Button>
            </div>
          )}
        </div>
      </main>

      <Link href="/upload">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}
