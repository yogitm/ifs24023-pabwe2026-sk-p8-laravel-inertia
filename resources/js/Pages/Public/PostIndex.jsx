import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Search, Filter, BookOpen, LogIn, UserPlus, ArrowRight, Calendar, User } from 'lucide-react';

export default function PostIndex({ posts, filters = {}, categories = [] }) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/articles', { q: search, category: selectedCategory }, { preserveState: true });
    };

    const handleCategorySelect = (category) => {
        const next = selectedCategory === category ? '' : category;
        setSelectedCategory(next);
        router.get('/articles', { q: search, category: next }, { preserveState: true });
    };

    return (
        <AppLayout publicPage={true}>
            <Head title="BlogVerse Pro - Jelajah Artikel & Pengetahuan" />

            {/* Hero Banner Beranda */}
            <section className="bg-gradient-to-b from-blue-50/70 to-slate-50 border-b border-slate-200 py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">
                        <BookOpen size={13} /> Platform Publikasi Modern & Terbuka
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Eksplorasi Ide, Pengetahuan, dan Inspirasi Tanpa Batas
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Temukan berbagai tulisan berkualitas seputar teknologi, tutorial, karir, dan pengembangan diri yang ditulis oleh komunitas penulis independen.
                    </p>

                    {/* CTA Buttons to Login & Register */}
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-50 hover:border-slate-400 shadow-sm transition"
                        >
                            <LogIn size={18} className="text-blue-600" />
                            <span>Halaman Login (Masuk)</span>
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/25 transition"
                        >
                            <UserPlus size={18} />
                            <span>Halaman Register (Daftar Penulis)</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Articles Catalog Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search & Category Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    <form onSubmit={handleSearch} className="w-full md:w-96 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul atau isi artikel..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
                        />
                        <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
                    </form>

                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => handleCategorySelect('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                !selectedCategory
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            Semua
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => handleCategorySelect(c)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    selectedCategory === c
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Article Grid */}
                {posts.data.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-8">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-bold text-slate-800">Belum Ada Artikel Ditemukan</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                            Tidak ada artikel yang cocok dengan pencarian Anda. Coba kata kunci lain atau pilih kategori berbeda.
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                            >
                                {post.cover_image_path ? (
                                    <div className="h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={`/storage/${post.cover_image_path}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-blue-600/30">
                                        <BookOpen size={48} />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {post.category}
                                            </span>
                                            {post.published_at && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(post.published_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                                            <Link href={`/articles/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>

                                        {post.excerpt && (
                                            <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[150px]">
                                            <User size={13} className="text-slate-400 shrink-0" />
                                            {post.user?.name || 'Anonim'}
                                        </span>
                                        <Link
                                            href={`/articles/${post.slug}`}
                                            className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition"
                                        >
                                            <span>Baca</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.links && posts.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-1.5 flex-wrap">
                        {posts.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
