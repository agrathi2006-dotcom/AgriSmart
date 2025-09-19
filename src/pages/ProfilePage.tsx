import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { User as UserIcon, MapPin, Phone, Mail, Edit3, Save, X, Leaf, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface ProfilePageProps {
  user: User
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: any
  farm_size?: number
  farming_experience?: number
  preferred_language: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    farm_size: '',
    farming_experience: '',
    preferred_language: 'en'
  })

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
  ]

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile()
        } else {
          throw error
        }
      } else {
        setProfile(data)
        setEditForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location?.name || '',
          farm_size: data.farm_size?.toString() || '',
          farming_experience: data.farming_experience?.toString() || '',
          preferred_language: data.preferred_language || 'en'
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    try {
      const newProfile = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location ? { name: user.user_metadata.location } : null,
        farm_size: user.user_metadata?.farm_size || 0,
        farming_experience: user.user_metadata?.farming_experience || 0,
        preferred_language: 'en'
      }

      const { data, error } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      setEditForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        location: data.location?.name || '',
        farm_size: data.farm_size?.toString() || '',
        farming_experience: data.farming_experience?.toString() || '',
        preferred_language: data.preferred_language || 'en'
      })
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const updates = {
        full_name: editForm.full_name,
        phone: editForm.phone,
        location: editForm.location ? { name: editForm.location } : null,
        farm_size: editForm.farm_size ? parseFloat(editForm.farm_size) : null,
        farming_experience: editForm.farming_experience ? parseInt(editForm.farming_experience) : null,
        preferred_language: editForm.preferred_language,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location?.name || '',
        farm_size: profile.farm_size?.toString() || '',
        farming_experience: profile.farming_experience?.toString() || '',
        preferred_language: profile.preferred_language || 'en'
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-64"></div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.full_name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="City, State"
                  />
                ) : (
                  <p className="text-gray-900">{profile.location?.name || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Leaf className="w-4 h-4 inline mr-1" />
                  Farm Size (acres)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.farm_size}
                    onChange={(e) => setEditForm({ ...editForm, farm_size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                ) : (
                  <p className="text-gray-900">{profile.farm_size ? `${profile.farm_size} acres` : 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Farming Experience (years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.farming_experience}
                    onChange={(e) => setEditForm({ ...editForm, farming_experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                ) : (
                  <p className="text-gray-900">{profile.farming_experience ? `${profile.farming_experience} years` : 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                {isEditing ? (
                  <select
                    value={editForm.preferred_language}
                    onChange={(e) => setEditForm({ ...editForm, preferred_language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {languages.find(l => l.code === profile.preferred_language)?.name || 'English'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Account Actions</h2>
        <div className="space-y-4">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">Privacy & Data</h3>
        <p className="text-blue-700 text-sm">
          Your personal information is securely stored and used only to provide you with personalized 
          agricultural insights and recommendations. We never share your data with third parties without 
          your explicit consent.
        </p>
      </div>
    </div>
  )
}