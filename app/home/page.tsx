"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, Heart, MessageCircle, Share2, MoreHorizontal, User, Home, Search, Bell, Music } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface MusicShowcase {
  id: number
  title: string
  artist: string
  artistAvatar: string
  likes: number
  comments: number
  shares: number
  duration: string
  audioUrl: string
  coverImage: string
  timestamp: string
  description: string
  tags: string[]
  isLiked: boolean
}

// Mock data generator
const generateMockShowcase = (id: number): MusicShowcase => {
  const artists = [
    "DJ Shadow", "MC Flow", "BeatMaker Pro", "Lyrical Genius", "SynthWave Collective",
    "Wordsmith", "The Producer", "Code Beats", "Vocal Harmony", "Bass Master",
    "Rhythm King", "Melody Queen", "Sound Engineer", "Mix Master", "Beat Creator"
  ]
  
  const titles = [
    "Midnight Vibes", "Urban Symphony", "Neon Dreams", "Street Poetry", "Digital Harmony",
    "Electric Pulse", "Cosmic Beats", "Underground Flow", "Stellar Sounds", "Rhythm Revolution",
    "Sonic Waves", "Beat Laboratory", "Musical Journey", "Sound Fusion", "Harmony Heights"
  ]

  const tags = ["Hip-Hop", "Electronic", "R&B", "Pop", "Jazz", "Rock", "Ambient", "Trap", "House", "Techno"]
  
  const artist = artists[Math.floor(Math.random() * artists.length)]
  const title = titles[Math.floor(Math.random() * titles.length)]
  
  return {
    id,
    title,
    artist,
    artistAvatar: `/placeholder.svg?height=40&width=40&query=${artist.replace(' ', '+')}+avatar`,
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 200) + 10,
    shares: Math.floor(Math.random() * 100) + 5,
    duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: `/placeholder.svg?height=300&width=300&query=${title.replace(' ', '+')}+music+cover`,
    timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
    description: `New collaboration featuring ${artist}. This track blends modern beats with classic vibes.`,
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
    isLiked: Math.random() > 0.7
  }
}

export default function HomePage() {
  const [showcases, setShowcases] = useState<MusicShowcase[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Load initial data
  useEffect(() => {
    loadShowcases(1)
  }, [])

  const loadShowcases = async (pageNum: number) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newShowcases = Array.from({ length: 10 }, (_, i) => 
      generateMockShowcase((pageNum - 1) * 10 + i + 1)
    )
    
    if (pageNum === 1) {
      setShowcases(newShowcases)
    } else {
      setShowcases(prev => [...prev, ...newShowcases])
    }
    
    // Simulate end of data after 5 pages
    if (pageNum >= 5) {
      setHasMore(false)
    }
    
    setLoading(false)
  }

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return

    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      const nextPage = page + 1
      setPage(nextPage)
      loadShowcases(nextPage)
    }
  }, [loading, hasMore, page])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  const toggleLike = (id: number) => {
    setShowcases(prev => prev.map(showcase => 
      showcase.id === id 
        ? { 
            ...showcase, 
            isLiked: !showcase.isLiked,
            likes: showcase.isLiked ? showcase.likes - 1 : showcase.likes + 1
          }
        : showcase
    ))
  }

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
              <Link href="/home" className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors">
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link href="/search" className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors">
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </Link>
              <Link href="/notifications" className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="hidden sm:inline">Notifications</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Your Feed</h2>
            <p className="text-gray-300">Discover the latest music collaborations from artists worldwide</p>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {showcases.map((showcase) => (
              <Card key={showcase.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={showcase.artistAvatar || "/placeholder.svg"} alt={showcase.artist} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                          {showcase.artist.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-semibold">{showcase.artist}</h3>
                        <p className="text-gray-400 text-sm">{showcase.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-white mb-2">{showcase.title}</h4>
                    <p className="text-gray-300 mb-3">{showcase.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {showcase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Cover Image */}
                    <div className="relative mb-4">
                      <img
                        src={showcase.coverImage || "/placeholder.svg"}
                        alt={showcase.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <Button
                          size="lg"
                          onClick={() => togglePlay(showcase.id)}
                          className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30"
                        >
                          {currentlyPlaying === showcase.id ? (
                            <Pause className="h-8 w-8 text-white" />
                          ) : (
                            <Play className="h-8 w-8 text-white ml-1" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                        <span className="text-white text-sm">{showcase.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(showcase.id)}
                        className={`flex items-center space-x-2 ${
                          showcase.isLiked ? 'text-pink-400' : 'text-gray-400'
                        } hover:text-pink-400`}
                      >
                        <Heart className={`h-5 w-5 ${showcase.isLiked ? 'fill-current' : ''}`} />
                        <span>{showcase.likes.toLocaleString()}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                        <MessageCircle className="h-5 w-5" />
                        <span>{showcase.comments}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                        <Share2 className="h-5 w-5" />
                        <span>{showcase.shares}</span>
                      </Button>
                    </div>
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
              <p className="text-gray-400">You've reached the end of your feed!</p>
              <Button
                onClick={() => {
                  setPage(1)
                  setHasMore(true)
                  loadShowcases(1)
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
  )
}
