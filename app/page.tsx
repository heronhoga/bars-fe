"use client"

import { useState } from "react"
import { Play, Pause, Heart, Users, Music, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Mock data for music showcases
const musicShowcases = [
  {
    id: 1,
    title: "Midnight Vibes",
    artist: "DJ Shadow & MC Flow",
    likes: 1247,
    duration: "3:42",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 2,
    title: "Urban Symphony",
    artist: "BeatMaker Pro & Lyrical Genius",
    likes: 892,
    duration: "4:15",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 3,
    title: "Neon Dreams",
    artist: "SynthWave Collective",
    likes: 2156,
    duration: "3:28",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 4,
    title: "Street Poetry",
    artist: "Wordsmith & The Producer",
    likes: 1634,
    duration: "2:58",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 5,
    title: "Digital Harmony",
    artist: "Code Beats & Vocal Harmony",
    likes: 987,
    duration: "4:03",
    audioUrl: "/placeholder-audio.mp3",
  },
]

export default function BarsLanding() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">BARS</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-900 bg-transparent"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            BARS
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">Where Music Collaboration Comes Alive</p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Connect with artists, producers, and creators worldwide. Share your beats, collaborate on tracks, and
            showcase your musical talent to the world.
          </p>
        </div>
      </section>

      {/* Music Showcase Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Collaborations</h3>
          <p className="text-gray-400 text-lg">Discover the latest musical creations from our community</p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {musicShowcases.map((track) => (
            <Card
              key={track.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      onClick={() => togglePlay(track.id)}
                      className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      {currentlyPlaying === track.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{track.title}</h4>
                      <p className="text-gray-400">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-gray-400 text-sm">{track.duration}</span>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-pink-400" />
                      <span className="text-white font-medium">{track.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">About BARS</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Empowering musicians and creators to collaborate, innovate, and share their passion for music
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Collaborate</h4>
              <p className="text-gray-400">
                Connect with talented artists, producers, and musicians from around the globe. Build your network and
                create amazing music together.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Create</h4>
              <p className="text-gray-400">
                Share your beats, vocals, and musical ideas. Use our platform to showcase your creativity and get
                feedback from the community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Discover</h4>
              <p className="text-gray-400">
                Explore new sounds, genres, and styles. Find inspiration from diverse musical collaborations and expand
                your creative horizons.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-2xl font-bold text-white mb-4">Join the BARS Community</h4>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Whether you're a seasoned producer, an aspiring rapper, a vocalist, or just someone who loves music,
                BARS is your platform to connect, create, and collaborate. Join thousands of artists who are already
                making music magic happen.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Music className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">BARS</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 BARS. All rights reserved. Made for music lovers, by hg
          </p>
        </div>
      </footer>
    </div>
  )
}
