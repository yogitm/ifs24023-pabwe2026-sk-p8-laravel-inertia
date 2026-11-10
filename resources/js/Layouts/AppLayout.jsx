import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    BookOpen,
    LogIn,
    UserPlus,
    LayoutDashboard,
    LogOut,
    Shield,
    User as UserIcon,
    Menu,
    X,
    FileText,
    Users,
} from 'lucide-react';

export default function AppLayout({ children, publicPage = false }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [isProcessing, setIsProcessing] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setIsProcessing(true));
        const removeFinish = router.on('finish', () => setIsProcessing(false));
        const removeError = router.on('error', () => setIsProcessing(false));
        return () => {
            removeStart();
            removeFinish();
            removeError();
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            {/* Top Global Loading Progress Bar */}
            {isProcessing && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    <div className="h-full bg-white/50 w-full animate-pulse"></div>
                </div>
            )}

            {/* Floating Action Processing Badge */}
            {isProcessing && (
                <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-semibold backdrop-blur-sm border border-slate-700/60 animate-fadeIn">
                    <svg className="animate-spin w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses tindakan...</span>
                </div>
            )}

            {/* Sticky Top Navbar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-blue-600 hover:text-blue-700 transition">
                            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                                <BookOpen size={20} />
                            </span>
                            <span className="tracking-tight text-slate-900 font-extrabold">BlogVerse <span className="text-blue-600">Pro</span></span>
                        </Link>
                        <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
                            <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
                            <Link href="/articles" className="hover:text-blue-600 transition">Jelajah Artikel</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard/posts"
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                                >
                                    <LayoutDashboard size={17} className="text-blue-600" />
                                    <span>Dashboard</span>
                                </Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link
                                            href="/admin/users"
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <Users size={17} className="text-purple-600" />
                                            <span>Kelola User</span>
                                        </Link>
                                        <Link
                                            href="/admin/posts"
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <FileText size={17} className="text-purple-600" />
                                            <span>Semua Artikel</span>
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                                    title="Edit Profil"
                                >
                                    <UserIcon size={16} className="text-slate-500" />
                                    <span className="max-w-[120px] truncate">{user.name}</span>
                                    {user.role === 'admin' && (
                                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>
                                    )}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    <span>Keluar</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl transition"
                                >
                                    <LogIn size={16} />
                                    <span>Masuk</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
                                >
                                    <UserPlus size={16} />
                                    <span>Daftar</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </nav>

                {/* Mobile Dropdown */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
                        <Link href="/" className="block py-2 text-sm font-semibold text-slate-700">Beranda</Link>
                        <Link href="/articles" className="block py-2 text-sm font-semibold text-slate-700">Jelajah Artikel</Link>
                        {user ? (
                            <>
                                <Link href="/dashboard/posts" className="block py-2 text-sm font-semibold text-blue-600">Dashboard Penulis</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link href="/admin/users" className="block py-2 text-sm font-semibold text-purple-600">Admin User</Link>
                                        <Link href="/admin/posts" className="block py-2 text-sm font-semibold text-purple-600">Admin Artikel</Link>
                                    </>
                                )}
                                <Link href="/profile" className="block py-2 text-sm font-semibold text-slate-700">Profil ({user.name})</Link>
                                <button onClick={handleLogout} className="w-full text-left py-2 text-sm font-semibold text-rose-600">Keluar</button>
                            </>
                        ) : (
                            <div className="pt-2 flex gap-2">
                                <Link href="/login" className="flex-1 text-center py-2 border rounded-xl text-sm font-semibold">Masuk</Link>
                                <Link href="/register" className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Daftar</Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Flash Alerts */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Editorial Footer */}
            <footer className="mt-20 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-bold text-lg">
                                <BookOpen size={18} />
                                <span>BlogVerse Pro</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Platform publikasi artikel, ide, dan pengetahuan modern multi-tier.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-600">
                            <Link href="/" className="hover:text-blue-600 transition">Beranda Publik</Link>
                            <Link href="/articles" className="hover:text-blue-600 transition">Semua Artikel</Link>
                            <Link href="/login" className="hover:text-blue-600 transition">Halaman Login</Link>
                            <Link href="/register" className="hover:text-blue-600 transition">Halaman Register</Link>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 mt-8 pt-6 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} BlogVerse Pro · Dikembangkan dengan Laravel 13, Inertia.js, dan React.
                    </div>
                </div>
            </footer>
        </div>
    );
}
