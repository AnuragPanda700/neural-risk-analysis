import React, { useEffect, useRef, useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';

const GOOGLE_COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];

export default function LoginPage({ onLogin }) {
    const canvasRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // Particle System
        const particles = [];
        const particleCount = 150;
        const mouse = { x: null, y: null };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5; // Slightly faster for energy
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 3 + 1;
                this.color = GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)];
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Antigravity Mouse Interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let maxDistance = 250; // Interaction radius

                    if (distance < maxDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        this.x -= directionX * 3; // Repulsion
                        this.y -= directionY * 3;
                    }
                }

                // Return to natural movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                this.draw();
            }
        }

        // Init Particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        const animate = () => {
            // Clear with slight trail effect
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => particle.update());
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Mouse Listeners
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleBypassLogin = (e) => {
        e.preventDefault();
        // No validation needed - Direct Bypass
        onLogin();
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
            {/* CANVAS BACKGROUND */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-crosshair" />

            {/* LOGIN CONTAINER */}
            <div className="relative z-10 w-full max-w-md p-6">
                {/* Glassmorphism Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.01] duration-500">

                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center backdrop-blur-md border border-blue-400/30 relative z-10">
                                <Shield size={32} className="text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
                        Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI-Powered</span><br />Portfolio Sentinel
                    </h1>
                    <p className="text-center text-slate-400 text-sm mb-8">
                        Enter your credentials to access the Neural Engine.
                    </p>

                    <form onSubmit={handleBypassLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="admin"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group mt-4 transform active:scale-95"
                        >
                            Access Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            By accessing, you agree to the <span className="text-blue-400/80 cursor-pointer hover:underline">Neural Protocol</span>.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
