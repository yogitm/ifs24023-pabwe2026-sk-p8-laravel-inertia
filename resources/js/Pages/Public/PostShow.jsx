import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import MarkdownViewer from '../../Components/MarkdownViewer';
import { ArrowLeft, Calendar, User, LogIn, UserPlus, BookOpen } from 'lucide-react';

export default function PostShow({ post }) {
    return (
        <AppLayout publicPage={true}>
            <Head title={`${post.title} - BlogVerse Pro`} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {/* Back to Catalog */}
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
                >
                    <ArrowLeft size={16} />
                    <span>Kembali ke Semua Artikel</span>
                </Link>

                {/* Article Header Metadata */}
                <div className="space-y-4 mb-8">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        {post.category}
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-b border-slate-100 pb-6">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <User size={15} className="text-blue-600" />
                            {post.user?.name || 'Anonim'}
                        </span>
                        {post.published_at && (
                            <span className="flex items-center gap-1.5">
                                <Calendar size={15} className="text-slate-400" />
                                {new Date(post.published_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                {post.cover_image_path && (
                    <div className="rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-200">
                        <img
                            src={`/storage/${post.cover_image_path}`}
                            alt={post.title}
                            className="w-full max-h-[500px] object-cover"
                        />
                    </div>
                )}

                {/* Excerpt Lead */}
                {post.excerpt && (
                    <div className="text-lg sm:text-xl text-slate-600 font-serif italic mb-8 p-4 bg-slate-100/60 rounded-xl border-l-4 border-blue-600">
                        "{post.excerpt}"
                    </div>
                )}

                {/* Markdown Content (Rendered via TOAST UI Viewer) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm leading-relaxed text-slate-800">
                    <MarkdownViewer content={post.content} />
                </div>

                {/* Community Call-to-Action Card */}
                <div className="mt-14 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
                    <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <BookOpen size={24} className="text-blue-300" />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Punya Ide atau Artikel yang Ingin Dibagikan?
                    </h2>
                    <p className="mt-3 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        Bergabunglah dengan komunitas penulis BlogVerse Pro. Publikasikan tulisan Anda, dapatkan pembaca, dan manfaatkan asisten AI kami untuk memperkaya artikel Anda.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 transition"
                        >
                            <LogIn size={18} />
                            <span>Halaman Login</span>
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold shadow-lg shadow-blue-500/30 transition"
                        >
                            <UserPlus size={18} />
                            <span>Halaman Register</span>
                        </Link>
                    </div>
                </div>
            </article>
        </AppLayout>
    );
}
