'use client';

/**
 * SemanticSearch Component
 * 
 * A React component that provides semantic search functionality for blog posts.
 * Uses AI embeddings to find conceptually similar content, not just keyword matches.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

// TypeScript interfaces
interface Blog {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    tags?: string[];
}

interface SearchResult {
    score: number;
    blog: Blog;
}

interface SemanticSearchProps {
    className?: string;
}

// Debounce hook for search input
function useDebounce(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// Typewriter Component for "Streaming" Effect
function Typewriter({ text, speed = 10 }: { text: string; speed?: number }) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayedText}</span>;
}

export default function SemanticSearch({ className = '' }: SemanticSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounce search query by 500ms
    const debouncedQuery = useDebounce(query, 500);

    // Perform search when debounced query changes
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Search failed');
            }

            setResults(data.results || []);
            setHasSearched(true);
        } catch (err) {
            console.error('Search error:', err);
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching';
            setError(errorMessage);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Trigger search when debounced query changes
    useEffect(() => {
        performSearch(debouncedQuery);
    }, [debouncedQuery, performSearch]);

    // Format similarity score as percentage
    const formatScore = (score: number): string => {
        return `${Math.round(score * 100)}% match`;
    };

    return (
        <div className={`w-full max-w-2xl mx-auto ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-[var(--text-tertiary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search blogs semantically..."
                    className="w-full h-14 glass-input rounded-xl pl-12 pr-4 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus-visible:ring-[hsl(var(--ring))] transition-all"
                />

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <div className="w-5 h-5 border-2 border-[hsl(var(--primary)/0.3)] border-t-[hsl(var(--primary))] rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                </div>
            )}

            {/* Results */}
            {hasSearched && !error && (
                <div className="mt-6 space-y-4">
                    {results.length === 0 ? (
                        <p className="text-[var(--text-tertiary)] text-center py-8">
                            No matching blogs found for &ldquo;{query}&rdquo;
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-[var(--text-tertiary)]">
                                Found {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>

                            {results.map(({ score, blog }) => (
                                <Link
                                    key={blog._id}
                                    href={`/blog/${blog.slug}`}
                                    className="block group"
                                >
                                    <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-[hsl(var(--primary)/0.3)] via-[hsl(var(--secondary)/0.2)] to-transparent hover:from-[hsl(var(--primary)/0.5)] hover:via-[hsl(var(--secondary)/0.4)] transition-all duration-300">
                                        <div className="relative rounded-xl glass p-5 transition-colors">
                                            {/* Score badge */}
                                            <Badge
                                                variant="glass"
                                                className="absolute top-4 right-4"
                                            >
                                                {formatScore(score)}
                                            </Badge>

                                            {/* Title */}
                                            <h3 className="text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors pr-24">
                                                {blog.title}
                                            </h3>

                                            {/* Description - Streaming Effect */}
                                            {blog.description && (
                                                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2 min-h-[40px]">
                                                    <Typewriter text={blog.description} speed={15} />
                                                </p>
                                            )}

                                            {/* Tags */}
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {blog.tags.slice(0, 4).map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="glass"
                                                            className="text-[var(--text-secondary)]"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Help text when not searching */}
            {!hasSearched && !isLoading && (
                <p className="mt-4 text-sm text-[var(--text-tertiary)] text-center">
                    Enter a topic or concept to find related blog posts using AI-powered semantic search
                </p>
            )}
        </div>
    );
}
