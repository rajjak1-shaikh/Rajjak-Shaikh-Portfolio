'use client';

import Link from "next/link"
import { Github, Twitter, Linkedin, Activity } from "lucide-react"
import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Container } from "@/app/components/ui/section"
import { FadeIn } from "@/app/components/ui/fade-in"

const socialLinks = [
    { href: "https://github.com/KrishnaJadhav2525", icon: Github, label: "GitHub" },
    { href: "https://x.com/krlshn444", icon: Twitter, label: "Twitter" },
    { href: "https://www.linkedin.com/in/krishna-jadhav-a5122a316/", icon: Linkedin, label: "LinkedIn" },
]

export function ContactSection() {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.subject || !formData.message) {
            setStatus({ type: 'error', message: 'Please fill in all fields' });
            return;
        }

        // Store form data before clearing
        const submittedData = { ...formData };

        // Optimistic UI - show success immediately
        setStatus({
            type: 'success',
            message: 'Message sent successfully! I will get back to you soon.'
        });
        setFormData({ email: '', subject: '', message: '' });

        // API call in background
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submittedData),
            });

            const result = await response.json();

            // Only update if there was an error
            if (!result.success) {
                setStatus({
                    type: 'error',
                    message: result.error || 'Failed to send message. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again later.'
            });
            console.error('Contact form error:', error);
        }
    };

    return (
        <FadeIn
            className="py-24 border-t border-[var(--glass-border)] relative overflow-hidden"
            fullWidth
        >
            <section
                id="contact"
                className="relative"
            >
                <Container className="relative z-10">
                    <div className="mb-16">
                        <p className="text-sm font-mono text-[var(--text-accent)] mb-4 tracking-widest uppercase">
                            Get In Touch
                        </p>
                        <h2
                            className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4"
                            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
                        >
                            Let's create something <span className="text-[var(--text-tertiary)]">extraordinary.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 md:gap-24">

                        {/* LEFT: FORM */}
                        <div className="relative group">

                            <div className="relative glass rounded-3xl p-8 md:p-10">
                                {status.type === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeInUp">
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                                            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Message Received!</h3>
                                        <p className="text-[var(--text-secondary)] max-w-xs mx-auto mb-8">
                                            {status.message}
                                        </p>
                                        <Button
                                            onClick={() => setStatus({ type: '', message: '' })}
                                            variant="outline"
                                            className="glass"
                                        >
                                            Send another
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)] ml-1">Subject</label>
                                            <Input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Project Inquiry"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)] ml-1">Message</label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Tell me about your project..."
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full text-base font-bold h-14 rounded-full group/btn"
                                        >
                                            Send Message
                                            <span className="group-hover/btn:translate-x-1 transition-transform ml-2">→</span>
                                        </Button>

                                        {status.type === 'error' && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                                <Activity className="w-4 h-4" />
                                                {status.message}
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: INFO */}
                        <div className="flex flex-col justify-between py-4">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                        <span className="w-8 h-px bg-[hsl(var(--primary))]"></span>
                                        Contact Info
                                    </h3>
                                    <div className="space-y-4">
                                        <a href="mailto:jadhavkrishna475@gmail.com" className="block text-2xl md:text-3xl font-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                            jadhavkrishna475@gmail.com
                                        </a>
                                        <p className="text-[var(--text-tertiary)]">
                                            Based in India • Available Worldwide
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                        <span className="w-8 h-px bg-[hsl(var(--secondary))]"></span>
                                        Connect
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {socialLinks.map(({ href, icon: Icon, label }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative flex items-center justify-center p-4 rounded-2xl glass transition-all duration-300"
                                                aria-label={label}
                                            >
                                                <Icon size={24} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 glass rounded-lg text-xs text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {label}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-[var(--text-tertiary)] text-sm max-w-xs leading-relaxed">
                                    I'm currently opening to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                                </p>
                            </div>
                        </div>

                    </div>
                </Container>
            </section>
        </FadeIn>
    )
}
