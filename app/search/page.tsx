"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Play,
  Pause,
  Heart,
  ArrowLeft,
  Music,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getSearchBeats } from "@/api/getSearchBeats";
import { BeatFull } from "@/types/beatType";
import { likeBeat } from "@/api/likeBeat";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<BeatFull[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, currentPage);
    }
  }, [currentPage]);

  const performSearch = async (query: string, page = 1) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await getSearchBeats(query, page);

      setSearchData(res.data);
      setSearchQuery(query);
      setTotalPages(res.totalPages);

      // Add to recent searches
      if (query.trim() && !recentSearches.includes(query.trim())) {
        const newRecentSearches = [query.trim(), ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
        localStorage.setItem(
          "recentSearches",
          JSON.stringify(newRecentSearches)
        );
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

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

  const toggleLike = async (id: string) => {
    const res = await likeBeat(id);

    if (res.message) {
      setSearchData((prev) =>
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

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isSearching}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isSearching}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
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

      {/* Search Section */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Music
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Search for beats and artists
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="beats or artists.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-20 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 rounded-full"
              />
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>

          {/* Recent Searches */}
          {!hasSearched && recentSearches.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(search);
                      performSearch(search, 1);
                    }}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Search Results for "{searchQuery}"
                </h3>
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Searching for beats...</p>
                </div>
              </div>
            )}

            {/* Search Results Grid */}
            {!isSearching && searchData.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {searchData.map((result) => (
                    <Card
                      key={result.id}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg rounded-2xl"
                    >
                      <CardContent className="p-6 space-y-4">
                        {/* demo */}
                        <Button
                          size="sm"
                          onClick={() => togglePlay(result.id, result.file_url)}
                          className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          {currentlyPlaying === result.id ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5 ml-0.5" />
                          )}
                        </Button>
                        {/* Title & Description */}
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-2">
                            {result.title}
                          </h4>
                          <p className="text-gray-300 leading-relaxed break-words">
                            {result.description}
                          </p>
                        </div>
                        {/* Username */}
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                            <Link
                              href={`https://discordapp.com/users/${result.discord}`}
                              className="text-indigo-300 hover:text-indigo-200 transition"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              By: {result.username} | Discord: {result.discord}
                            </Link>
                          </span>
                        </div>
                        {/* Upload date */}
                        <p className="text-gray-400 text-sm">
                          Uploaded on{" "}
                          <span className="font-medium">
                            {new Date(result.created_at).toLocaleDateString(
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
                        {result.tags && (
                          <div className="flex flex-wrap gap-2">
                            {result.tags.split(",").map((tag) => (
                              <span
                                key={`${result.id}-${tag.trim()}`}
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
                            onClick={() => toggleLike(result.id)}
                            className={`flex items-center space-x-2 ${
                              result.is_liked
                                ? "text-pink-400"
                                : "text-gray-400"
                            } hover:text-pink-400 transition`}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                Boolean(Number(result.is_liked))
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                            <span>{result.likes}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between mt-4 items-center">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  <span className="text-white">
                    Page {currentPage} of {totalPages || 1}
                  </span>

                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* No Results */}
            {!isSearching &&
              hasSearched &&
              searchData.length === 0 &&
              searchQuery && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any beats matching "{searchQuery}". Try
                    different keywords or browse our featured content.
                  </p>
                  <Link href="/home">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      Explore Featured Beats
                    </Button>
                  </Link>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
