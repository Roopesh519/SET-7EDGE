import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import ChatHeader from '../components/Chat/ChatHeader';

export default function AboutUsPage() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        // Set viewport height for mobile compatibility
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => window.removeEventListener('resize', setViewportHeight);
    }, []);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    }, [showMobileMenu]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex">
            <div className="flex flex-col flex-1 relative min-h-0">
                <ChatHeader
                    setShowSidebar={() => { }} // No sidebar functionality
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                    handleLogout={handleLogout}
                />
                <main className="flex-1 p-4 min-h-0 pb-0">
                    <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
                        <div className="flex-1 overflow-y-auto settings-scrollbar">
                            <div className="max-w-6xl mx-auto p-6">
                                <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">About SET Mate</h1>

                                {/* Hero Section with 3D Model */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                    {/* 3D Spline Model */}
                                    <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 relative">
                                        <Spline scene="https://prod.spline.design/UZNd0zodTKcVx7VM/scene.splinecode" />

                                        {/* Custom overlay to cover Spline watermark */}
                                        <div className="absolute bottom-4 right-4 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90">
                                            SET Mate
                                        </div>
                                    </div>

                                    {/* Mission Statement */}
                                    <div className="flex flex-col justify-center space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                                        <p className="text-gray-700 text-lg leading-relaxed">
                                            SET Mate is revolutionizing the world of software testing and quality assurance through intelligent automation.
                                            We empower developers and QA professionals with cutting-edge AI tools that streamline test creation,
                                            enhance coverage, and accelerate delivery cycles.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Test Automation</span>
                                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">BDD/TDD</span>
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Quality Assurance</span>
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">AI-Powered</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Founder Section */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Meet the Engineer</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                        {/* Profile Image Placeholder */}
                                        <div className="flex justify-center">
                                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                                                <img
                                                    src="./roopesh.jpeg" // ← Replace with your image URL
                                                    alt="Profile"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>

                                        </div>

                                        {/* Founder Details */}
                                        <div className="md:col-span-2 space-y-4">
                                            <h3 className="text-xl font-bold text-gray-800">Roopesh</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                A passionate software engineer and testing enthusiast with extensive experience in
                                                quality assurance, test automation, and AI integration. Dedicated to creating tools
                                                that make testing more efficient, reliable, and accessible to development teams worldwide.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">Software Engineer</span>
                                                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">QA Engineer</span>
                                                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">AI Enthusiast</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Values */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Innovation</h3>
                                        <p className="text-gray-600 text-sm">
                                            Continuously pushing the boundaries of what's possible in test automation and AI.
                                        </p>
                                    </div>

                                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Quality</h3>
                                        <p className="text-gray-600 text-sm">
                                            Delivering reliable, robust solutions that teams can depend on for critical testing needs.
                                        </p>
                                    </div>

                                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Community</h3>
                                        <p className="text-gray-600 text-sm">
                                            Building a supportive ecosystem where developers and testers can grow together.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
                                    <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
                                    <p className="mb-6 text-indigo-100">
                                        Have questions about SET Mate or want to collaborate? We'd love to hear from you!
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <a
                                            href="mailto:rsroopesh565@gmail.com"
                                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
                                        >
                                            Email Us
                                        </a>
                                        <a
                                            href="/chat"
                                            className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                                        >
                                            Try SET Mate
                                        </a>
                                    </div>
                                </div>

                                {/* Technology Stack */}
                                <div className="mt-8 text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Built with Technologies</h3>
                                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">React</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Node.js</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">AI/ML</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">MongoDB</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">together.ai</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Deepseek</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Spline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}