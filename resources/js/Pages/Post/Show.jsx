import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import MarkdownViewer from '../../Components/MarkdownViewer';
import {
    ArrowLeft,
    Calendar,
    Upload,
    Trash2,
    Edit3,
    CheckCircle,
    Clock,
    Image as ImageIcon,
} from 'lucide-react';

export default function Show({ post }) {
    const [uploading, setUploading] = useState(false);

    const handleCoverUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('cover', file);

        setUploading(true);
        router.post(`/dashboard/posts/${post.id}/cover`, formData, {
            onFinish: () => setUploading(false),
        });
    };

    const handleDeleteCover = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus gambar cover ini?')) return;
        router.delete(`/dashboard/posts/${post.id}/cover`);
    };

    const handleTogglePublish = () => {
        router.patch(`/dashboard/posts/${post.id}/publish`);
    };

    return (
        <AppLayout>
            <Head title={`${post.title} - Detail Artikel`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <Link
                        href="/dashboard/posts"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                    >
                        <ArrowLeft size={14} /> Kembali ke Artikel Saya
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleTogglePublish}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                post.is_published
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                        >
                            {post.is_published ? (
                                <>
                                    <Clock size={13} />
                                    <span>Jadikan Draf</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={13} />
                                    <span>Publikasikan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
                    {/* Header Info */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                            {post.category}
                        </span>
                        <span
                            className={`px-2.5 py-1 rounded-md ${
                                post.is_published
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                            {post.is_published ? 'Dipublikasikan' : 'Status Draf'}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-4 border-b border-slate-100 pb-6">
                        <span>Slug: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{post.slug}</code></span>
                        {post.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Dipublikasikan {new Date(post.published_at).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>

                    {/* Cover Section */}
                    <div className="my-8 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                        {post.cover_image_path ? (
                            <div className="space-y-4">
                                <img
                                    src={`/storage/${post.cover_image_path}`}
                                    alt={post.title}
                                    className="w-full max-h-[400px] object-cover rounded-xl border border-slate-200"
                                />
                                <div className="flex justify-between items-center text-xs">
                                    <label className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer inline-flex items-center gap-1">
                                        <Upload size={14} /> Ganti Foto Sampul
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                    <button
                                        onClick={handleDeleteCover}
                                        className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <Trash2 size={14} /> Hapus Sampul
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <ImageIcon size={36} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-xs text-slate-500 mb-3">Belum ada gambar sampul untuk artikel ini.</p>
                                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-sm transition">
                                    <Upload size={14} />
                                    <span>{uploading ? 'Mengunggah...' : 'Unggah Foto Sampul'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-8 p-4 bg-slate-50 rounded-xl text-slate-700 text-sm italic border-l-4 border-blue-500">
                            {post.excerpt}
                        </div>
                    )}

                    {/* Markdown Content (Rendered via TOAST UI Viewer) */}
                    <div className="pt-4 border-t border-slate-100">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Konten Artikel</h2>
                        <MarkdownViewer content={post.content} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
