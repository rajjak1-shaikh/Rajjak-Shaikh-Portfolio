'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Home, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  TrendingUp,
  Calendar,
  User,
  ExternalLink,
  Trash2,
  Eye,
  CheckCheck
} from 'lucide-react';

// TypeScript interface for Contact
interface Contact {
  _id: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = 'all' | 'new' | 'read' | 'replied';
type SortOption = 'newest' | 'oldest' | 'email';

export default function AdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  // New state for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const ADMIN_PASSWORD = 'R@jj@ak2005';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchContacts();
    } else {
      setError('Invalid password');
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Use Next.js API route
      const response = await fetch('/api/contact');
      const result = await response.json();

      if (result.success) {
        setContacts(result.contacts || []);
        setError('');
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = contacts?.length || 0;
    const newCount = contacts?.filter(c => c.status === 'new').length || 0;
    const readCount = contacts?.filter(c => c.status === 'read').length || 0;
    const repliedCount = contacts?.filter(c => c.status === 'replied').length || 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = contacts?.filter(c => new Date(c.createdAt) >= today).length || 0;

    return { total, newCount, readCount, repliedCount, todayCount };
  }, [contacts]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    
    let filtered = contacts;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.email.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

    return filtered;
  }, [contacts, statusFilter, searchQuery, sortBy]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Email', 'Subject', 'Message', 'Status', 'IP'];
    const rows = filteredContacts.map(c => [
      formatDate(c.createdAt),
      c.email,
      c.subject,
      c.message.replace(/\n/g, ' '),
      c.status,
      c.ipAddress || 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    // Could add a toast notification here
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-neutral-400">Enter your password to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Sign In
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-neutral-400 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contact Dashboard</h1>
              <p className="text-neutral-400">Manage and respond to contact submissions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchContacts}
                className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-neutral-300" />
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
              >
                <Download className="w-4 h-4 text-neutral-300" />
                <span className="text-neutral-300 font-medium">Export</span>
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
              >
                <Home className="w-4 h-4 text-neutral-300" />
                <span className="text-neutral-300 font-medium">Home</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm">Total Messages</span>
                <MessageSquare className="w-5 h-5 text-neutral-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm">New</span>
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-400">{stats.newCount}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Read</span>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{stats.readCount}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400 text-sm">Replied</span>
                <CheckCheck className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-purple-400">{stats.repliedCount}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-400 text-sm">Today</span>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-orange-400">{stats.todayCount}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email, subject, or message..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 bg-neutral-800 rounded-lg p-1">
              {(['all', 'new', 'read', 'replied'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="email">Email A-Z</option>
            </select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-neutral-500">
            Showing {filteredContacts.length} of {stats.total} messages
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
              <Mail className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matches found' : 'No messages yet'}
            </h3>
            <p className="text-neutral-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Contact submissions will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => {
              const isExpanded = expandedCards.has(contact._id);
              const messagePreview = contact.message.substring(0, 150) + (contact.message.length > 150 ? '...' : '');

              return (
                <div
                  key={contact._id}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {contact.subject}
                        </h3>
                        
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'new' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : contact.status === 'read'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {contact.status === 'new' && <Clock className="w-3 h-3" />}
                          {contact.status === 'read' && <Eye className="w-3 h-3" />}
                          {contact.status === 'replied' && <CheckCheck className="w-3 h-3" />}
                          {contact.status}
                        </span>
                      </div>

                      {/* Email with copy button */}
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-500" />
                        <button
                          onClick={() => copyEmail(contact.email)}
                          className="text-sm text-neutral-400 hover:text-blue-400 transition"
                          title="Click to copy"
                        >
                          {contact.email}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeTime(contact.createdAt)}
                      </div>
                      <p className="text-xs text-neutral-600">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <p className="text-neutral-300 whitespace-pre-wrap">
                      {isExpanded ? contact.message : messagePreview}
                    </p>
                    {contact.message.length > 150 && (
                      <button
                        onClick={() => toggleExpanded(contact._id)}
                        className="text-blue-400 text-sm mt-2 hover:text-blue-300 transition"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>IP: {contact.ipAddress || 'N/A'}</span>
                      <span className="text-neutral-700">•</span>
                      <span>ID: {contact._id.substring(0, 8)}...</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Mail className="w-4 h-4" />
                        Reply
                      </a>

                      <button
                        className="p-1.5 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}