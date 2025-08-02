import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import DotGrid from '../components/Chat/DotGrid';

export default function HomePage() {
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

    return (
        <main
            style={{ minHeight: 'calc(var(--vh) * 100)' }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
        >
            {/* Header */}
            <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                {/* <span className="text-white font-bold text-sm">TM</span> */}
                                <img src='ai.png' alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                            </div>
                            {/* <h1 className="text-xl font-bold">TestMate AI</h1> */}
                            <img src='testmate-ai.png' alt="TestMate AI Logo" className="h-8" />
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                            <a
                                href="/chat"
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                            >
                                Get Started
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-white">Intelligent</span>{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Test Automation
                            </span>
                            <br />
                            <span className="text-white">for Modern Teams</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Revolutionize your testing workflow with AI-powered test generation,
                            intelligent automation, and comprehensive quality assurance tools.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/chat"
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="#demo"
                                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
                            >
                                Watch Demo
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive 3D Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Experience the Future of Testing</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Interact with our AI-powered testing environment and see how TestMate AI transforms your development workflow.
                        </p>
                    </div>
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black relative">
                        <div className="absolute inset-0 w-full h-full">
                            <DotGrid
                                dotSize={4}
                                gap={15}
                                baseColor="#ffffff20"
                                activeColor="#8b5cf6"
                                proximity={80}
                                shockRadius={150}
                                shockStrength={2}
                                resistance={500}
                                returnDuration={1.0}
                                className="w-full h-full"
                            />
                        </div>
                        {/* 3D Spline Model on top */}
                        <div className="relative z-10 w-full h-full">
                            <Spline scene="https://prod.spline.design/RDwCN0TjO1KiZfUu/scene.splinecode" />

                            {/* Overlay to cover "Built with Spline" watermark */}
                            <div className="absolute bottom-7 right-4 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90">
                                Powered by TestMate AI
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Testing</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Our comprehensive suite of AI-powered tools helps you build better software faster.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: "AI Test Generation",
                                description: "Automatically generate comprehensive test suites from your specifications using advanced AI algorithms."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: "Smart Automation",
                                description: "Intelligent test execution with self-healing capabilities and adaptive scheduling."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                ),
                                title: "Advanced Analytics",
                                description: "Deep insights into test performance, coverage metrics, and quality trends."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                ),
                                title: "Team Collaboration",
                                description: "Seamless integration with your existing workflow and collaborative test management."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                ),
                                title: "BDD & TDD Support",
                                description: "Native support for behavior-driven and test-driven development methodologies."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                ),
                                title: "CI/CD Integration",
                                description: "Seamless integration with popular CI/CD pipelines and version control systems."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 group">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-20 bg-gradient-to-b from-transparent to-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Built with Modern Technologies</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Leveraging the latest in web development and AI technologies for optimal performance.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['React', 'Node.js', 'AI/ML', 'MongoDB', 'TypeScript', 'Docker', 'Kubernetes', 'AWS'].map((tech) => (
                            <span key={tech} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-200">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Testing?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of developers who are already using TestMate AI to build better software faster.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <a
                            href="mailto:rsroopesh565@gmail.com"
                            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 border border-white/20"
                        >
                            Get in Touch
                        </a>
                        <a
                            href="https://github.com/Roopesh519/testmate-ai/"
                            className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                {/* <span className="text-white font-bold text-sm">TM</span> */}
                                <img src='ai.png' alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                            </div>
                            {/* <h1 className="text-xl font-bold">TestMate AI</h1> */}
                            <img src='testmate-ai.png' alt="TestMate AI Logo" className="h-8" />
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2025 TestMate AI. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}