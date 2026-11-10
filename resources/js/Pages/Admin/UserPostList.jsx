import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Download, FileText, ArrowLeft } from 'lucide-react';

export default function UserPostList({ user, posts }) {
    return (
        <AppLayout>
            <Head title={`Admin: Artikel ${user.name} - BlogVerse Pro`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition"
                        >
                            <ArrowLeft size={14} /> Kembali ke Kelola Pengguna
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Artikel Milik: {user.name}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {user.email} · Monitoring seluruh postingan artikel user ini (Read-Only)
                        </p>
                    </div>

                    <a
                        href={`/admin/users/${user.id}/posts/export`}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition cursor-pointer"
                    >
                        <Download size={15} />
                        <span>Ekspor Artikel User ke Excel</span>
                    </a>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between">
                        <span>Daftar Artikel Penulis</span>
                        <span className="text-xs text-slate-400 font-normal">
                            Total {posts.total || posts.data?.length || 0} artikel
                        </span>
                    </div>

                    {!posts.data || posts.data.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">Pengguna ini belum memiliki artikel</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {posts.data.map((post) => (
                                <div key={post.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-xs mb-1">
                                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {post.category}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className={post.is_published ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                                                {post.is_published ? 'Dipublikasikan' : 'Draf'}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-400">
                                                {new Date(post.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <h2 className="font-bold text-slate-900 text-base">
                                            <Link href={`/articles/${post.slug}`} target="_blank" className="hover:text-blue-600 transition">
                                                {post.title}
                                            </Link>
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/articles/${post.slug}`}
                                        target="_blank"
                                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition shrink-0"
                                    >
                                        Lihat Publik ↗
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {posts.links && posts.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex justify-center gap-1.5 flex-wrap">
                            {posts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-purple-600 text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
