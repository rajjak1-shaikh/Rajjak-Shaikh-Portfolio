"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Github, ExternalLink, Activity, BarChart3, Database, Globe, Terminal, Video, Zap, FileText, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface Project {
    title: string;
    description: string;
    tags: string[];
    features: string[];
    stats: { label: string; value: string; icon: React.ElementType }[];
    links: { github?: string; demo?: string };
    gradient: string;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    iconPath: React.ReactNode;
}

const projects: Project[] = [
    {
        title: "Binance Futures Bot",
        description: "Production-quality CLI trading bot for Binance Futures Testnet (USDT-M). Features robust validation, structured logging, and market/limit order support.",
        features: [
            "Testnet USDT-M Trading",
            "Market & Limit Orders",
            "Robust Error Actions",
            "Structured Logging"
        ],
        stats: [
            { label: "Type", value: "CLI", icon: Terminal },
            { label: "Speed", value: "Real-time", icon: Zap },
            { label: "Market", value: "USDT-M", icon: Activity }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/" },
        tags: ['Python', 'Binance API', 'CLI', 'Trading'],
        gradient: "from-yellow-500/50 via-orange-500/30 to-transparent",
        iconBg: "bg-yellow-500/10",
        iconBorder: "border-yellow-500/20",
        iconColor: "text-yellow-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        )
    },
    {
        title: "AI Video Pipeline",
        description: "Fully automated video generation pipeline. Orchestrates n8n, Gemini, Edge TTS, and MoviePy to turn a topic into a YouTube-ready MP4.",
        features: [
            "100% Automated Workflow",
            "Gemini AI Scripting",
            "Edge TTS Voiceover",
            "Auto-Thumbnail Gen"
        ],
        stats: [
            { label: "Output", value: "1080p", icon: Video },
            { label: "Cost", value: "Free-tier", icon: Activity },
            { label: "Status", value: "Auto", icon: Zap }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/" },
        tags: ['n8n', 'Python', 'Gemini AI', 'FFmpeg'],
        gradient: "from-pink-500/50 via-rose-500/30 to-transparent",
        iconBg: "bg-pink-500/10",
        iconBorder: "border-pink-500/20",
        iconColor: "text-pink-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        )
    },
    {
        title: "ResumeFit AI",
        description: "Production-ready resume analyzer using TF-IDF & cosine similarity to match resumes with job descriptions. Features a premium glassmorphism UI.",
        features: [
            "TF-IDF Vectorization",
            "Cosine Similarity Scoring",
            "Skill Gap Analysis",
            "Privacy-First (Local)"
        ],
        stats: [
            { label: "Stack", value: "Django", icon: Database },
            { label: "Model", value: "TF-IDF", icon: Activity },
            { label: "Speed", value: "~ms", icon: Zap }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/" },
        tags: ['Django', 'Python', 'Scikit-learn', 'NLP'],
        gradient: "from-blue-500/50 via-cyan-500/30 to-transparent",
        iconBg: "bg-blue-500/10",
        iconBorder: "border-blue-500/20",
        iconColor: "text-blue-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        )
    },
    {
        title: "Real-time Facial Recognition",
        description: "High-performance biometric system utilizing OpenCV and Qt C++ for real-time face detection. Optimized for low-latency environments with custom threading.",
        features: [
            "99.8% Accuracy on LFW Dataset",
            "Multi-threaded Processing Pipeline",
            "Anti-spoofing Liveness Detection",
            "Secure Local Biometric Database"
        ],
        stats: [
            { label: "Accuracy", value: "99.8%", icon: Activity },
            { label: "Latency", value: "~15ms", icon: Activity },
            { label: "FPS", value: "60+", icon: Activity }
        ],
        links: { github: "#" },
        tags: ['C++', 'OpenCV', 'Qt', 'Biometrics'],
        gradient: "from-indigo-500/50 via-purple-500/30 to-transparent",
        iconBg: "bg-indigo-500/10",
        iconBorder: "border-indigo-500/20",
        iconColor: "text-indigo-400",
        iconPath: (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </>
        )
    },
    {
        title: "Personal Portfolio v2",
        description: "Next-gen portfolio with RAG-powered Semantic Search. Users can query my experience using natural language. Built with Next.js 16 and Pinecone.",
        features: [
            "RAG using OpenAI & Pinecone",
            "Sub-millisecond Vector Retrieval",
            "Dynamic MDX Blog System",
            "Edge-Cached Global Delivery"
        ],
        stats: [
            { label: "Query Time", value: "<100ms", icon: Activity },
            { label: "Vectors", value: "10k+", icon: Database },
            { label: "Lighthouse", value: "100", icon: Activity }
        ],
        links: { github: "#", demo: "#" },
        tags: ['Next.js 16', 'Pinecone', 'RAG', 'React'],
        gradient: "from-emerald-500/50 via-teal-500/30 to-transparent",
        iconBg: "bg-emerald-500/10",
        iconBorder: "border-emerald-500/20",
        iconColor: "text-emerald-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        )
    },
    {
        title: "Fraud Detection System",
        description: "Enterprise-grade ML pipeline for anomalous transaction detection. Implements ensemble learning with Scikit-learn to minimize false positives.",
        features: [
            "Process over 10,000 TPS",
            "Ensemble: XGBoost + Random Forest",
            "Explainable AI (SHAP) Metrics",
            "Real-time Stream Processing"
        ],
        stats: [
            { label: "Throughput", value: "10k TPS", icon: Activity },
            { label: "Precision", value: "99.9%", icon: BarChart3 },
            { label: "False Pos", value: "<0.1%", icon: Activity }
        ],
        links: { github: "#" },
        tags: ['Python', 'Scikit-learn', 'ML', 'Pandas'],
        gradient: "from-red-500/50 via-orange-500/30 to-transparent",
        iconBg: "bg-red-500/10",
        iconBorder: "border-red-500/20",
        iconColor: "text-red-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )
    },
    {
        title: "Movies Analysis",
        description: "Data analysis project exploring trends in 44,000+ movies. Visualizes budget vs. revenue correlations and genre popularity using Pandas and Matplotlib.",
        features: [
            "Analysis of 44,000+ Films",
            "ROI & Revenue Analysis",
            "Genre & Cast Insights",
            "Content Discovery (Keywords)"
        ],
        stats: [
            { label: "Dataset", value: "44k+", icon: Database },
            { label: "Range", value: "100 Yrs", icon: Activity },
            { label: "Charts", value: "Static", icon: BarChart3 }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/CineData-Analysis" },
        tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
        gradient: "from-yellow-500/50 via-amber-500/30 to-transparent",
        iconBg: "bg-yellow-500/10",
        iconBorder: "border-yellow-500/20",
        iconColor: "text-yellow-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        )
    },
    {
        title: "Data Grid React",
        description: "Custom-built virtualized data grid for React. identifying performance bottlenecks, it efficiently handles 50k+ rows with client-side sorting and column management.",
        features: [
            "Virtualization (50k+ Rows)",
            "Client-side Sorting",
            "Column Pinning/Reordering",
            "Undo/Redo History Stack"
        ],
        stats: [
            { label: "Rows", value: "50k+", icon: Database },
            { label: "FPS", value: "60", icon: Activity },
            { label: "Nav", value: "A11y", icon: Activity }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/react-virtualized-data-grid", demo: "#" },
        tags: ['React', 'TypeScript', 'Vite', 'Vitest'],
        gradient: "from-cyan-500/50 via-blue-500/30 to-transparent",
        iconBg: "bg-cyan-500/10",
        iconBorder: "border-cyan-500/20",
        iconColor: "text-cyan-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7-6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
        )
    },
    {
        title: "College Portal",
        description: "Full-stack academic management platform. Features student enrollment, admin dashboards, and a blog submission workflow using Flask and MongoDB.",
        features: [
            "Flask & MongoDB Backend",
            "Student/Admin Auth",
            "Blog Approval Workflow",
            "Admin Dashboard"
        ],
        stats: [
            { label: "Users", value: "Multi", icon: Activity },
            { label: "Backend", value: "Flask", icon: Activity },
            { label: "DB", value: "Mongo", icon: Database }
        ],
        links: { github: "https://github.com/KrishnaJadhav2525/College_Web-_Portal-_Full-Stack" },
        tags: ['Flask', 'MongoDB', 'HTML/CSS', 'Python'],
        gradient: "from-violet-500/50 via-fuchsia-500/30 to-transparent",
        iconBg: "bg-violet-500/10",
        iconBorder: "border-violet-500/20",
        iconColor: "text-violet-400",
        iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        )
    }
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        scale: 0.9,
        filter: "blur(4px)",
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0,
        scale: 0.9,
        filter: "blur(4px)",
    }),
};

// Mobile Project Modal Component
function MobileProjectModal({ project, isOpen, onClose }: { project: Project; isOpen: boolean; onClose: () => void }) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`
                            relative w-full max-w-lg max-h-[90vh] overflow-y-auto
                            rounded-3xl border border-white/10
                            bg-neutral-900 shadow-2xl
                        `}
                    >
                        {/* Gradient Header */}
                        <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${project.gradient} opacity-20`} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-neutral-400 hover:text-white transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative p-6 md:p-8 flex flex-col items-center">
                            {/* Icon */}
                            <div className={`relative w-16 h-16 rounded-2xl ${project.iconBg} border ${project.iconBorder} flex items-center justify-center shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] mb-4`}>
                                <svg className={`w-8 h-8 ${project.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {project.iconPath}
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-white text-center mb-1">
                                {project.title}
                            </h3>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 mb-6">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-white/5 border border-white/10 text-neutral-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-neutral-400 text-sm leading-relaxed text-center mb-8">
                                {project.description}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 w-full mb-8">
                                {project.stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-neutral-800/50 rounded-xl p-3 border border-white/5 text-center flex flex-col items-center justify-center"
                                    >
                                        <stat.icon className={`w-4 h-4 ${project.iconColor} mb-1.5`} />
                                        <div className="text-sm font-bold text-white leading-none mb-1">{stat.value}</div>
                                        <div className="text-[9px] text-neutral-500 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Features */}
                            <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/5 mb-8">
                                <h4 className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mb-3 uppercase tracking-wider">
                                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Key Features
                                </h4>
                                <ul className="space-y-2.5">
                                    {project.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start text-sm text-neutral-400"
                                        >
                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full mr-3 ${project.iconBg.replace('bg-', 'bg-').split('/')[0]} flex-shrink-0`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full">
                                {project.links.github && (
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors text-sm"
                                    >
                                        <Github size={18} /> View Code
                                    </a>
                                )}
                                {project.links.demo && (
                                    <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 text-white py-3 rounded-xl font-semibold border border-neutral-700 hover:bg-neutral-700 transition-colors text-sm"
                                    >
                                        <Globe size={18} /> Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default function ProjectCarousel() {
    const [[page, direction], setPage] = useState([1, 0]);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Wrap index effectively
    const projectIndex = Math.abs(page % projects.length);
    const project = projects[projectIndex];

    const paginate = useCallback((newDirection: number) => {
        setPage([page + newDirection, newDirection]);
        setIsHovered(false); // Reset hover state on navigation
    }, [page]);

    // Handle Mobile Detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle Card Click
    const handleCardClick = () => {
        if (isMobile) {
            setSelectedProject(project);
        } else {
            setIsHovered(!isHovered);
        }
    };

    return (
        <>
            <div className="relative w-full max-w-7xl mx-auto h-[600px] md:h-[700px] flex items-center justify-center">
                {/* Navigation Buttons */}
                <div className={`absolute inset-x-2 md:-inset-x-12 flex items-center justify-between z-20 pointer-events-none top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <button
                        className="pointer-events-auto p-3 md:p-4 rounded-full bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-sm"
                        onClick={() => paginate(-1)}
                        aria-label="Previous project"
                    >
                        <ChevronLeft size={24} className="md:w-8 md:h-8" />
                    </button>
                    <button
                        className="pointer-events-auto p-3 md:p-4 rounded-full bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-sm"
                        onClick={() => paginate(1)}
                        aria-label="Next project"
                    >
                        <ChevronRight size={24} className="md:w-8 md:h-8" />
                    </button>
                </div>

                {/* Card Container */}
                <div className="relative w-full h-full flex items-center justify-center perspective-1000 px-4">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.4 },
                                scale: { duration: 0.4 },
                                filter: { duration: 0.3 },
                            }}
                            className="absolute w-full flex justify-center items-center"
                            style={{ zIndex: isHovered ? 50 : 1 }}
                        >
                            {/* The Card - Glass Shard Design */}
                            <motion.div
                                layout
                                onMouseEnter={() => !isMobile && setIsHovered(true)}
                                onMouseLeave={() => !isMobile && setIsHovered(false)}
                                onClick={handleCardClick}
                                whileHover={{ y: isMobile ? 0 : -8 }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className={`
                                    relative overflow-hidden
                                    rounded-3xl glass
                                    shadow-xl
                                    cursor-pointer
                                    group/card
                                    ${isHovered ? 'w-full max-w-4xl shadow-indigo-500/20' : 'w-full max-w-sm md:max-w-lg hover:border-white/20'}
                                `}
                                animate={{
                                    scale: isHovered ? 1 : 0.98,
                                }}
                            >
                                {/* Dynamic Gradient Glow Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover/card:opacity-10 transition-opacity duration-700`} />

                                <div className={`relative p-8 md:p-10 flex flex-col h-full ${isHovered ? 'min-h-[550px]' : 'min-h-[450px]'}`}>

                                    {/* HEADER: Icon & Title */}
                                    <motion.div layout className="flex flex-col items-start gap-4 mb-6">
                                        <div className={`p-3 rounded-xl ${project.iconBg} border ${project.iconBorder} ${project.iconColor}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {project.iconPath}
                                            </svg>
                                        </div>
                                        <motion.h3 layout className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                                            {project.title}
                                        </motion.h3>
                                    </motion.div>

                                    {/* CONTENT: Description */}
                                    <motion.div layout className="mb-6 flex-grow">
                                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                                            {project.description}
                                        </p>
                                    </motion.div>

                                    {/* TECH STACK (Visible always) */}
                                    <motion.div layout className="flex flex-wrap gap-2 mb-6">
                                        {(isHovered ? project.tags : project.tags.slice(0, 3)).map(tag => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-white/5 border-white/5 text-neutral-400 group-hover/card:text-white transition-colors"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                        {!isHovered && project.tags.length > 3 && (
                                            <span className="text-[10px] text-neutral-600 self-center">+{project.tags.length - 3}</span>
                                        )}
                                    </motion.div>

                                    {/* EXPANDED CONTENT (Desktop Only) */}
                                    <AnimatePresence>
                                        {isHovered && !isMobile && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-8">
                                                    {/* Key Features */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Highlights</h4>
                                                        <ul className="space-y-2">
                                                            {project.features.slice(0, 3).map((feature, idx) => (
                                                                <li key={idx} className="flex items-center text-sm text-neutral-300">
                                                                    <div className={`w-1 h-1 rounded-full mr-2 ${project.iconColor.replace('text-', 'bg-')}`} />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col justify-end gap-3">
                                                        {project.links.github && (
                                                            <a
                                                                href={project.links.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
                                                            >
                                                                <Github size={16} /> View Code
                                                            </a>
                                                        )}
                                                        {project.links.demo && (
                                                            <a
                                                                href={project.links.demo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-2 py-3 rounded-lg border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors"
                                                            >
                                                                <Globe size={16} /> Live Demo
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Mobile Tap Hint */}
                                    <div className="md:hidden mt-2 text-center">
                                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Tap for details</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                    {projects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage([idx, idx > projectIndex ? 1 : -1])}
                            className={`
                  w-2 h-2 rounded-full transition-all duration-300 
                  ${idx === projectIndex
                                    ? 'w-8 bg-white'
                                    : 'bg-neutral-800 hover:bg-neutral-600'}
                `}
                            aria-label={`Go to project ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Modal */}
            <MobileProjectModal
                project={selectedProject!}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
}
