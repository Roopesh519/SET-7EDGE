import React, { useEffect, useState, useRef } from 'react';
import { User, Mail, Lock, Edit3, Save, X, Check, Camera, Shield, Settings } from 'lucide-react';
import ChatHeader from '../components/Chat/ChatHeader';
import api from '../utils/api';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Remove any existing page transition overlay
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.remove();
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to access your profile.');
            window.location.href = '/login';
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data);
                setName(res.data.username);
                // Add slight delay for smooth entrance animation
                setTimeout(() => setIsPageLoaded(true), 100);
            } catch (err) {
                setError('Failed to load profile');
                setTimeout(() => setIsPageLoaded(true), 100);
            }
        };

        fetchProfile();

        // Set viewport height for mobile compatibility
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => window.removeEventListener('resize', setViewportHeight);
    }, []);

    useEffect(() => {
        document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    }, [showMobileMenu]);

    const handleUpdate = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const res = await api.put('/profile', {
                name,
                password: password || undefined
            });

            setMessage('Profile updated successfully!');
            setPassword('');
            setIsEditing(false);
            setUser(prev => ({ ...prev, username: name }));

            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setError('Update failed');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div 
                style={{ height: 'calc(var(--vh) * 100)' }} 
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex"
            >
                <div className="flex flex-col flex-1 relative min-h-0">
                    <ChatHeader
                        setShowSidebar={() => { }}
                        showMobileMenu={showMobileMenu}
                        setShowMobileMenu={setShowMobileMenu}
                        handleLogout={handleLogout}
                    />
                    <main className="flex-1 p-4 min-h-0 pb-0">
                        <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
                            <div className="flex-1 flex items-center justify-center text-gray-600">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-lg animate-pulse">Loading profile...</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div 
            style={{ height: 'calc(var(--vh) * 100)' }} 
            className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex transition-all duration-500 ease-out ${
                isPageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className="flex flex-col flex-1 relative min-h-0">
                <ChatHeader
                    setShowSidebar={() => { }}
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                    handleLogout={handleLogout}
                    isOnChatPage={false}
                />
                <main className="flex-1 p-4 min-h-0 pb-0">
                    <div className={`flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)] transition-all duration-700 ease-out ${
                        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="flex-1 overflow-y-auto settings-scrollbar">
                            <div className="max-w-4xl mx-auto p-6">
                                {/* Edit Toggle */}
                                <div className={`flex justify-between items-center mb-6 transition-all duration-500 delay-100 ease-out ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}>
                                    <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                    </button>
                                </div>

                                {/* Profile Header */}
                                <div className={`relative mb-8 transition-all duration-700 delay-200 ease-out ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}>
                                    <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                        <div className="absolute bottom-12 left-6 text-white">
                                            <h2 className="text-2xl font-bold">Welcome back, {user.username}!</h2>
                                            <p className="text-indigo-100">Manage your profile settings</p>
                                        </div>
                                    </div>

                                    {/* Profile Image */}
                                    <div className="absolute -bottom-14 left-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white overflow-hidden hover:scale-105 transition-transform duration-300">
                                                {profileImage ? (
                                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    getInitials(user.username)
                                                )}
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-16 transition-all duration-700 delay-300 ease-out ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 stagger-animation">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Member since</p>
                                                <p className="font-semibold text-gray-800">{formatDate(user.joinDate || user.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300 stagger-animation">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-500 rounded-lg">
                                                <Shield className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Account Status</p>
                                                <p className="font-semibold text-gray-800 flex items-center">
                                                    <Check className="w-4 h-4 text-green-500 mr-1" />
                                                    Active
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300 stagger-animation">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-500 rounded-lg">
                                                <Settings className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">User ID</p>
                                                <p className="font-semibold text-gray-800 text-sm font-mono">{user._id.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`} style={{ transitionDelay: '400ms' }}>
                                    <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                                        <Settings className="w-5 h-5 mr-2 text-indigo-500" />
                                        Account Settings
                                    </h3>

                                    <div className="space-y-6">
                                        {/* User ID */}
                                        <div>
                                            <label className="block font-medium mb-2 text-gray-700 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                User ID
                                            </label>
                                            <input
                                                type="text"
                                                value={user._id}
                                                readOnly
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 font-mono text-sm transition-all duration-200 hover:shadow-sm"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block font-medium mb-2 text-gray-700 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                readOnly
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 transition-all duration-200 hover:shadow-sm"
                                            />
                                        </div>

                                        {/* Name */}
                                        <div>
                                            <label className="block font-medium mb-2 text-gray-700 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full border rounded-xl p-4 transition-all duration-200 ${isEditing
                                                        ? 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-800 hover:shadow-sm'
                                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:shadow-sm'
                                                    } focus:outline-none`}
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block font-medium mb-2 text-gray-700 flex items-center">
                                                <Lock className="w-4 h-4 mr-2 text-gray-500" />
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                placeholder="Password change disabled"
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled
                                                className="w-full border border-gray-300 rounded-xl p-4 text-gray-500 placeholder-gray-400 bg-gray-100 cursor-not-allowed transition-all duration-200"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        {isEditing && (
                                            <button
                                                onClick={handleUpdate}
                                                disabled={isLoading}
                                                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02] btn-press'
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        <span>Update Profile</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Messages */}
                                    {message && (
                                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl flex items-center animate-fade-in">
                                            <Check className="w-5 h-5 mr-2" />
                                            {message}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl flex items-center animate-fade-in">
                                            <X className="w-5 h-5 mr-2" />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .stagger-animation:nth-child(1) {
                    animation-delay: 0.1s;
                }

                .stagger-animation:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .stagger-animation:nth-child(3) {
                    animation-delay: 0.3s;
                }

                .btn-press:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}