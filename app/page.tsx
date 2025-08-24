"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Heart, Users, Music, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFavoriteBeats } from "@/api/getFavoriteBeats";
import Link from "next/link";
import { Beat } from "@/types/beatType";

export default function BarsLanding() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const data = await getFavoriteBeats();
        setBeats(data);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };

    fetchBeats();
  }, []);

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
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Where Music Collaboration Comes Alive
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Connect with artists, producers, and creators worldwide. Share your
            beats, collaborate on tracks, and showcase your musical talent to
            the world.
          </p>
        </div>
      </section>

      {/* Music Showcase Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Favorite Beats
          </h3>
          <p className="text-gray-400 text-lg">
            Discover the most loved musical creations from our community
          </p>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto">
          {beats.map((track) => (
            <Card
              key={track.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg rounded-2xl"
            >
              <CardContent className="p-6 space-y-4">
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
                      <h4 className="text-white font-semibold text-lg">
                        {track.title}
                      </h4>
                      <p className="text-gray-400">{track.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-pink-400" />
                      <span className="text-white font-medium">
                        {track.likes.toLocaleString()}
                      </span>
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
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              About BARS
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Empowering musicians and creators to collaborate, innovate, and
              share their passion for music
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">
                Collaborate
              </h4>
              <p className="text-gray-400">
                Connect with talented artists, producers, and musicians from
                around the globe. Build your network and create amazing music
                together.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Create</h4>
              <p className="text-gray-400">
                Share your beats, vocals, and musical ideas. Use our platform to
                showcase your creativity and get feedback from the community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">
                Discover
              </h4>
              <p className="text-gray-400">
                Explore new sounds, genres, and styles. Find inspiration from
                diverse musical collaborations and expand your creative
                horizons.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-2xl font-bold text-white mb-4">
                Join the BARS Community
              </h4>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Whether you're a seasoned producer, an aspiring rapper, a
                vocalist, or just someone who loves music, BARS is your platform
                to connect, create, and collaborate. Join thousands of artists
                who are already making music magic happen.
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
  );
}
