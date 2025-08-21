"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Play, Pause, Heart, ArrowLeft, Music, Filter, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const searchBeats = async (query: string, page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!query.trim()) {
    return {
      results: [],
      totalPages: 0,
      currentPage: page,
      totalResults: 0,
      query: query,
    }
  }

  const allResults = Array.from({ length: 47 }, (_, i) => ({
    id: `search-${i + 1}`,
    title: `${query} Beat ${i + 1}`,
    artist: `Artist ${i + 1}`,
    artistAvatar: `/placeholder.svg?height=40&width=40&query=artist${i + 1}`,
    likes: Math.floor(Math.random() * 5000) + 100,
    plays: Math.floor(Math.random() * 10000) + 500,
    duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    file_url: "/placeholder-audio.mp3",
    coverImage: `/placeholder.svg?height=200&width=200&query=${query}+beat${i + 1}`,
    tags: ["Hip-Hop", "Trap", "Chill"][Math.floor(Math.random() * 3)],
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    is_liked: Math.random() > 0.7,
  }))

  const startIndex = (page - 1) * 10
  const endIndex = startIndex + 10
  const results = allResults.slice(startIndex, endIndex)

  return {
    results,
    totalPages: Math.ceil(allResults.length / 10),
    currentPage: page,
    totalResults: allResults.length,
    query: query,
  }
}

interface SearchResult {
  id: string
  title: string
  artist: string
  artistAvatar: string
  likes: number
  plays: number
  duration: string
  file_url: string
  coverImage: string
  tags: string
  created_at: string
  is_liked: boolean
}

interface SearchData {
  results: SearchResult[]
  totalPages: number
  currentPage: number
  totalResults: number
  query: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchData, setSearchData] = useState<SearchData>({
    results: [],
    totalPages: 0,
    currentPage: 1,
    totalResults: 0,
    query: "",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const performSearch = async (query: string, page = 1) => {
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const data = await searchBeats(query, page)
      setSearchData(data)

      // Add to recent searches
      if (query.trim() && !recentSearches.includes(query.trim())) {
        const newRecentSearches = [query.trim(), ...recentSearches.slice(0, 4)]
        setRecentSearches(newRecentSearches)
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery, 1)
  }

  const handlePageChange = (page: number) => {
    performSearch(searchData.query, page)
    // Scroll to top of results
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const togglePlay = (id: string, fileUrl: string) => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setAudio(null)
      setCurrentlyPlaying(null)
    }

    if (currentlyPlaying !== id) {
      const newAudio = new Audio(fileUrl)
      newAudio.play()

      newAudio.onended = () => {
        setCurrentlyPlaying(null)
        setAudio(null)
      }

      setAudio(newAudio)
      setCurrentlyPlaying(id)
    }
  }

  const toggleLike = (id: string) => {
    setSearchData((prev) => ({
      ...prev,
      results: prev.results.map((result) =>
        result.id === id
          ? {
              ...result,
              is_liked: !result.is_liked,
              likes: result.is_liked ? result.likes - 1 : result.likes + 1,
            }
          : result,
      ),
    }))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const PaginationControls = () => {
    if (searchData.totalPages <= 1) return null

    const { currentPage, totalPages } = searchData

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

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={isSearching}
                className={
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

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
    )
  }

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
          <div className="w-24"></div> {/* Spacer for centering */}
        </nav>
      </header>

      {/* Search Section */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Music</h2>
          <p className="text-gray-300 text-lg mb-8">Search for beats, artists, and collaborations</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for beats, artists, or genres..."
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
                      setSearchQuery(search)
                      performSearch(search, 1)
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
            {/* Results Header */}
            {searchData.totalResults > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Search Results for "{searchData.query}"</h3>
                  <p className="text-gray-400">{searchData.totalResults.toLocaleString()} results found</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            )}

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
            {!isSearching && searchData.results.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {searchData.results.map((result) => (
                    <Card
                      key={result.id}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg rounded-2xl"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Cover Image */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={result.coverImage || "/placeholder.svg"}
                              alt={result.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <Button
                              size="sm"
                              onClick={() => togglePlay(result.id, result.file_url)}
                              className="absolute inset-0 rounded-lg bg-black/50 hover:bg-black/70 transition-all duration-300 opacity-0 hover:opacity-100 flex items-center justify-center"
                            >
                              {currentlyPlaying === result.id ? (
                                <Pause className="h-5 w-5 text-white" />
                              ) : (
                                <Play className="h-5 w-5 text-white ml-0.5" />
                              )}
                            </Button>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-xl font-bold text-white truncate">{result.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={result.artistAvatar || "/placeholder.svg"} alt={result.artist} />
                                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
                                      {result.artist.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-gray-300 text-sm">{result.artist}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLike(result.id)}
                                className={`${result.is_liked ? "text-pink-400" : "text-gray-400"} hover:text-pink-400`}
                              >
                                <Heart className={`h-5 w-5 ${result.is_liked ? "fill-current" : ""}`} />
                              </Button>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
                              <span>{result.plays.toLocaleString()} plays</span>
                              <span>{result.duration}</span>
                              <span className="px-2 py-1 bg-pink-400/10 text-pink-300 rounded-full text-xs">
                                #{result.tags}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Heart className="h-4 w-4 text-pink-400" />
                                <span className="text-white text-sm">{result.likes.toLocaleString()}</span>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {new Date(result.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <PaginationControls />
              </>
            )}

            {/* No Results */}
            {!isSearching && hasSearched && searchData.results.length === 0 && searchData.query && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any beats matching "{searchData.query}". Try different keywords or browse our
                  featured content.
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
  )
}
