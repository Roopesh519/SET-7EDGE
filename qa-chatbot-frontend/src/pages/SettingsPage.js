import React, { useEffect, useState } from 'react';
import { Key, Save, X, Check, Settings, Shield, Eye, EyeOff } from 'lucide-react';
import ChatHeader from '../components/Chat/ChatHeader';
import api from '../utils/api';

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);

    useEffect(() => {
        // Remove any existing page transition overlay
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.remove();
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to access settings.');
            window.location.href = '/login';
            return;
        }

        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setUser(res.data.user);
                setHasApiKey(res.data.hasApiKey);
                // Add slight delay for smooth entrance animation
                setTimeout(() => setIsPageLoaded(true), 100);
            } catch (err) {
                setError('Failed to load settings');
                setTimeout(() => setIsPageLoaded(true), 100);
            }
        };

        fetchSettings();

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

    const handleUpdateApiKey = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        if (!apiKey.trim()) {
            setError('API key cannot be empty');
            setIsLoading(false);
            return;
        }

        // Basic validation for Together.ai API key format
        if (!apiKey.startsWith('') && !apiKey.includes('')) {
            setError('Please enter a valid Together.ai API key');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.put('/settings/api-key', {
                apiKey: apiKey.trim()
            });

            setMessage('API key updated successfully!');
            setApiKey('');
            setIsEditing(false);
            setHasApiKey(true);

            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update API key');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveApiKey = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await api.delete('/settings/api-key');
            setMessage('API key removed successfully! Using default system key.');
            setHasApiKey(false);
            setIsEditing(false);
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setError('Failed to remove API key');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
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
                    <main className="flex-1 p-2 sm:p-4 min-h-0 pb-0">
                        <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
                            <div className="flex-1 flex items-center justify-center text-gray-600">
                                <div className="text-center px-4">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                                        <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <p className="text-base sm:text-lg animate-pulse">Loading settings...</p>
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
                <main className="flex-1 p-2 sm:p-4 min-h-0 pb-0">
                    <div className={`flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)] transition-all duration-700 ease-out ${
                        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="flex-1 overflow-y-auto settings-scrollbar">
                            <div className="max-w-4xl mx-auto p-3 sm:p-6">
                                {/* Header */}
                                <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 transition-all duration-500 delay-100 ease-out ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center mb-2 sm:mb-0">
                                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-500" />
                                        Settings
                                    </h1>
                                </div>

                                {/* API Key Section */}
                                <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 hover:shadow-xl transition-all duration-300 ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`} style={{ transitionDelay: '200ms' }}>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                                            <Key className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
                                            <span className="text-sm sm:text-base">Together.ai API Key</span>
                                        </h3>
                                        <div className="flex items-center space-x-2 self-start sm:self-auto">
                                            {hasApiKey && (
                                                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium flex items-center">
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                    Active
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                                            >
                                                {isEditing ? <X className="w-3 h-3 sm:w-4 sm:h-4" /> : <Settings className="w-3 h-3 sm:w-4 sm:h-4" />}
                                                <span>{isEditing ? 'Cancel' : 'Configure'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex items-start space-x-2 sm:space-x-3">
                                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">Why use your own API key?</p>
                                                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                                                    <li>• Get higher rate limits and priority access</li>
                                                    <li>• Your API usage is billed directly to you</li>
                                                    <li>• Better performance and reliability</li>
                                                    <li>• Your API key is encrypted and stored securely</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block font-medium mb-2 text-gray-700 flex items-center text-sm sm:text-base">
                                                    <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-700" />
                                                    Together.ai API Key
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showApiKey ? "text" : "password"}
                                                        value={apiKey}
                                                        onChange={(e) => setApiKey(e.target.value)}
                                                        placeholder="your-api-key-here..."
                                                        className="w-full border text-gray-700 border-gray-300 rounded-xl p-3 sm:p-4 pr-10 sm:pr-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 focus:outline-none font-mono text-xs sm:text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showApiKey ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                    </button>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                                    Get your API key from <a href="https://api.together.ai/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Together.ai Dashboard</a>
                                                </p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                                <button
                                                    onClick={handleUpdateApiKey}
                                                    disabled={isLoading}
                                                    className={`flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base ${
                                                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02]'
                                                    }`}
                                                >
                                                    {isLoading ? (
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            <span>Save API Key</span>
                                                        </>
                                                    )}
                                                </button>

                                                {hasApiKey && (
                                                    <button
                                                        onClick={handleRemoveApiKey}
                                                        disabled={isLoading}
                                                        className="px-4 sm:px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                                                    >
                                                        Remove Key
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!isEditing && !hasApiKey && (
                                        <div className="text-center py-6 sm:py-8">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Key className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 mb-2 text-sm sm:text-base">No API key configured</p>
                                        </div>
                                    )}

                                    {!isEditing && hasApiKey && (
                                        <div className="text-center py-6 sm:py-8">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                                            </div>
                                            <p className="text-gray-600 mb-2 text-sm sm:text-base">Personal API key is active</p>
                                            <p className="text-xs sm:text-sm text-gray-500 px-4">Your requests are using your personal Together.ai API key</p>
                                        </div>
                                    )}

                                    {/* Messages */}
                                    {message && (
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl flex items-center animate-fade-in text-sm sm:text-base">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                                            <span className="break-words">{message}</span>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl flex items-center animate-fade-in text-sm sm:text-base">
                                            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                                            <span className="break-words">{error}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Settings Section */}
                                <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 ${
                                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`} style={{ transitionDelay: '300ms' }}>
                                    <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center">
                                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
                                        Additional Settings
                                    </h3>
                                    <div className="text-center py-6 sm:py-8">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 mb-2 text-sm sm:text-base">More settings coming soon</p>
                                        <p className="text-xs sm:text-sm text-gray-500 px-4">We're working on additional customization options</p>
                                    </div>
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

                .settings-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .settings-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }

                .settings-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }

                .settings-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                @media (max-width: 640px) {
                    .settings-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                }
            `}</style>
        </div>
    );
}