"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Music, ArrowLeft, User, Lock, Globe, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const regions = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania", "Middle East"]

interface FormData {
  username: string
  password: string
  confirmPassword: string
  region: string
  discord: string
}

interface FormErrors {
  username?: string
  password?: string
  confirmPassword?: string
  region?: string
  discord?: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    region: "",
    discord: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Region validation
    if (!formData.region) {
      newErrors.region = "Please select your region"
    }

    // Discord validation (optional but if provided, should be valid format)
    if (formData.discord && !/^[a-zA-Z0-9._]{2,32}$/.test(formData.discord)) {
      newErrors.discord =
        "Discord username should be 2-32 characters and contain only letters, numbers, dots, and underscores"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Real-time password confirmation validation
    if (field === "confirmPassword" || (field === "password" && formData.confirmPassword)) {
      const password = field === "password" ? value : formData.password
      const confirmPassword = field === "confirmPassword" ? value : formData.confirmPassword

      if (confirmPassword && password !== confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would typically make an API call to register the user
      console.log("Registration data:", formData)

      // Redirect to login or dashboard
      alert("Registration successful! Please check your email to verify your account.")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-pink-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">BARS</h1>
          </div>
          <p className="text-gray-300">Join the music collaboration community</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Username</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e: any) => handleInputChange("username", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                />
                {errors.username && <p className="text-pink-400 text-sm">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e: any) => handleInputChange("password", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-pink-400 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Confirm Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e: any) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-pink-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region" className="text-white flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Region</span>
                </Label>
                <Select value={formData.region} onValueChange={(value: any) => handleInputChange("region", value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-pink-400">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region} className="text-white hover:bg-gray-800">
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-pink-400 text-sm">{errors.region}</p>}
              </div>

              {/* Discord */}
              <div className="space-y-2">
                <Label htmlFor="discord" className="text-white flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Discord Username (Optional)</span>
                </Label>
                <Input
                  id="discord"
                  type="text"
                  placeholder="your_discord_username"
                  value={formData.discord}
                  onChange={(e: any) => handleInputChange("discord", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400"
                />
                {errors.discord && <p className="text-pink-400 text-sm">{errors.discord}</p>}
                <p className="text-gray-400 text-xs">Connect with other artists on Discord</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
