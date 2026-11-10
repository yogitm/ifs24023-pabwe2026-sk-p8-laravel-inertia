import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '../../Layouts/AppLayout';
import MarkdownEditor from '../../Components/MarkdownEditor';
import {
    Plus,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Download,
    Upload,
    Sparkles,
    LoaderCircle,
    FileText,
    CheckCircle2,
    Clock,
    X,
    Save,
} from 'lucide-react';

function ArticleModal({ post = null, categories, onClose }) {
    const isEdit = Boolean(post?.id);
    const [title, setTitle] = useState(post?.title || '');
    const [category, setCategory] = useState(post?.category || categories[0] || 'Umum');
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [content, setContent] = useState(post?.content || '');
    const [isPublished, setIsPublished] = useState(Boolean(post?.is_published));
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});

        const payload = {
            title,
            category,
            excerpt,
            content,
            is_published: isPublished,
        };

        if (isEdit) {
            router.put(`/dashboard/posts/${post.id}`, payload, {
                onSuccess: () => {
                    setBusy(false);
                    onClose();
                },
                onError: (errs) => {
                    setBusy(false);
                    setErrors(errs);
                },
            });
        } else {
            router.post('/dashboard/posts', payload, {
                onSuccess: () => {
                    setBusy(false);
                    onClose();
                },
                onError: (errs) => {
                    setBusy(false);
                    setErrors(errs);
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Container Full Screen */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Distinct Colored Header (Dark Slate) */}
                <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            {isEdit ? 'Mode Penyuntingan' : 'Pembuatan Artikel Baru'}
                        </span>
                        <h2 className="text-xl font-bold tracking-tight">
                            {isEdit ? `Ubah Artikel: ${post.title}` : 'Tulis Artikel Baru'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        title="Tutup Modal"
                    >
                        <X size={22} />
                    </button>
                </header>

                {/* Form Body (Scrollable) */}
                <form
                    id="article-full-form"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6"
                >
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="form-title">
                            Judul Artikel <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="form-title"
                            type="text"
                            required
                            maxLength={255}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tuliskan judul artikel yang menarik..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base font-semibold"
                        />
                        {errors.title && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.title}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="form-category">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="form-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="form-excerpt">
                                Ringkasan Pemikat (Excerpt)
                            </label>
                            <input
                                id="form-excerpt"
                                type="text"
                                maxLength={1000}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="1-2 kalimat ringkasan yang menarik minat pembaca..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                            />
                            {errors.excerpt && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.excerpt}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1.5">
                            Konten Artikel (Markdown Format) <span className="text-rose-500">*</span>
                        </label>
                        <MarkdownEditor
                            value={content}
                            onChange={(md) => setContent(md)}
                            height="400px"
                            placeholder="Mulai tuliskan artikel Anda dalam format Markdown..."
                        />
                        {errors.content && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.content}</p>}
                    </div>

                    <div className="pt-2">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>Publikasikan artikel ini ke publik sekarang (is_published = true)</span>
                        </label>
                    </div>
                </form>

                {/* Distinct Colored Footer (Light Slate with Contrast Border) */}
                <footer className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-white transition cursor-pointer text-sm"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="article-full-form"
                        disabled={busy || !title.trim() || !content.trim()}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50 text-sm"
                    >
                        {busy ? (
                            <>
                                <LoaderCircle size={16} className="animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>{isEdit ? 'Perbarui Artikel' : 'Simpan Artikel'}</span>
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default function Index({ posts, stats = {}, categories = [] }) {
    const [modalPost, setModalPost] = useState(null); // null = closed, {} = new, { ...post } = edit
    const [activeKebab, setActiveKebab] = useState(null);

    // AI Generation states
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiCount, setAiCount] = useState(1);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiResults, setAiResults] = useState([]);
    const [aiError, setAiError] = useState('');
    const [aiSaving, setAiSaving] = useState(false);

    // AI Generator Handlers
    const handleGenerateAi = async () => {
        if (!aiPrompt.trim()) return;
        setAiGenerating(true);
        setAiError('');

        try {
            const countNum = Math.min(5, Math.max(1, Number(aiCount) || 1));
            const response = await axios.post('/dashboard/posts/ai-generate', {
                prompt: aiPrompt,
                count: countNum,
            });

            if (response.data && Array.isArray(response.data.articles)) {
                setAiResults(response.data.articles);
            }
        } catch (err) {
            setAiError(
                err.response?.data?.message ||
                'Gagal menghasilkan artikel AI. Periksa konfigurasi OPENAI_API_KEY Anda.'
            );
        } finally {
            setAiGenerating(false);
        }
    };

    const handleSaveAiDrafts = () => {
        if (aiResults.length === 0) return;
        setAiSaving(true);

        router.post('/dashboard/posts/ai-save', { articles: aiResults }, {
            onSuccess: () => {
                setAiSaving(false);
                setAiResults([]);
                setAiPrompt('');
            },
            onError: () => setAiSaving(false),
        });
    };

    // Toggle publish
    const handleTogglePublish = (post) => {
        router.patch(`/dashboard/posts/${post.id}/publish`, {}, { preserveScroll: true });
    };

    // Delete post
    const handleDeletePost = (post) => {
        if (!confirm(`Hapus artikel "${post.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/dashboard/posts/${post.id}`);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Penulis - BlogVerse Pro" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Dashboard Penulis
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                            Artikel Saya
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau, tulis, sunting, dan publikasikan seluruh karya tulis Anda
                        </p>
                    </div>

                    <button
                        onClick={() => setModalPost({})}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer text-sm"
                    >
                        <Plus size={18} />
                        <span>Tulis Artikel Baru</span>
                    </button>
                </div>

                {/* 3 Summary Statistics Cards */}
                <div className="grid sm:grid-cols-3 gap-5 my-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Artikel</span>
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <FileText size={16} />
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats.total ?? 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Total seluruh tulisan milik Anda</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Selesai</span>
                            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <CheckCircle2 size={16} />
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-3">{stats.published ?? 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Artikel telah dipublikasikan ke publik</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Belum Selesai</span>
                            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                <Clock size={16} />
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-amber-600 mt-3">{stats.draft ?? 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Artikel masih berstatus draf</p>
                    </div>
                </div>

                {/* AI Generator Interactive Section */}
                <section className="bg-white border border-violet-200 rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex items-center gap-2 text-violet-700 font-bold text-base mb-1">
                        <Sparkles size={18} />
                        <span>AI Article Generator</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        Buat draf artikel instan berbahasa Indonesia menggunakan OpenAI API.
                    </p>

                    <div className="grid md:grid-cols-[1fr_120px_auto] gap-3">
                        <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Topik artikel (contoh: Panduan Belajar React untuk Pemula)..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
                        />
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={aiCount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setAiCount(isNaN(val) ? 1 : Math.max(1, Math.min(5, val)));
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-center"
                            title="Jumlah artikel (1-5)"
                        />
                        <button
                            type="button"
                            onClick={handleGenerateAi}
                            disabled={aiGenerating || !aiPrompt.trim()}
                            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50 text-sm"
                        >
                            {aiGenerating ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    <span>Membuat...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Generate AI</span>
                                </>
                            )}
                        </button>
                    </div>

                    {aiError && (
                        <p className="text-rose-600 text-xs mt-3 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                            {aiError}
                        </p>
                    )}

                    {aiResults.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-violet-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Hasil Generate AI ({aiResults.length} artikel)
                                </h3>
                                <button
                                    onClick={handleSaveAiDrafts}
                                    disabled={aiSaving}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                                >
                                    {aiSaving ? (
                                        <>
                                            <LoaderCircle size={14} className="animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            <span>Simpan Semua Sebagai Draf</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid gap-3">
                                {aiResults.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                                                {item.category}
                                            </span>
                                            <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2">{item.excerpt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Excel Import / Export Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="/dashboard/posts/export"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition cursor-pointer"
                        >
                            <Download size={15} className="text-blue-600" />
                            <span>Ekspor Artikel ke Excel</span>
                        </a>

                        <form
                            action="/dashboard/posts/import"
                            method="post"
                            encType="multipart/form-data"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold shadow-sm"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={document.querySelector('meta[name=csrf-token]')?.content || ''}
                            />
                            <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                                <Upload size={15} className="text-blue-600" />
                                <span>Impor Excel:</span>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".xlsx,.xls"
                                    required
                                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 cursor-pointer"
                                />
                            </label>
                            <button
                                type="submit"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                                Unggah
                            </button>
                        </form>
                    </div>
                </div>

                {/* Article List View (Rapi, Ringkas, Responsif, List View - Bukan Card) */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible">
                    <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between">
                        <span>Daftar Artikel Saya</span>
                        <span className="text-xs text-slate-400 font-normal">
                            Menampilkan {posts.data?.length || 0} artikel
                        </span>
                    </div>

                    {!posts.data || posts.data.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">Belum ada artikel yang dibuat</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Klik tombol "Tulis Artikel Baru" di atas untuk mulai membuat postingan pertama Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                                >
                                    <div className="min-w-0 flex-1 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                                                <Link
                                                    href={`/dashboard/posts/${post.id}`}
                                                    className="hover:text-blue-600 transition"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {post.category}
                                                </span>
                                                <span className="text-slate-400">•</span>
                                                <span>
                                                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span className="text-slate-400">•</span>
                                                <span
                                                    className={`font-semibold ${
                                                        post.is_published ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}
                                                >
                                                    {post.is_published ? 'Dipublikasikan' : 'Draf'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Kebab Dropdown */}
                                    <div className="flex items-center gap-3">
                                        {/* Quick Toggle Status */}
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePublish(post)}
                                            className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                                                post.is_published
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                            }`}
                                            title="Ubah status publikasi"
                                        >
                                            {post.is_published ? 'Jadikan Draf' : 'Publikasikan'}
                                        </button>

                                        {/* Kebab Button & Dropdown */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveKebab(activeKebab === post.id ? null : post.id)
                                                }
                                                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                                title="Menu Tindakan"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeKebab === post.id && (
                                                <div className="absolute right-0 top-full mt-1 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 animate-fadeIn">
                                                    {/* Detail (ikon mata, warna teks primary) */}
                                                    <Link
                                                        href={`/dashboard/posts/${post.id}`}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        onClick={() => setActiveKebab(null)}
                                                    >
                                                        <Eye size={15} />
                                                        <span>Detail</span>
                                                    </Link>

                                                    {/* Ubah Edit (ikon pensil, warna teks primary) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveKebab(null);
                                                            setModalPost(post);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Edit3 size={15} />
                                                        <span>Ubah Edit</span>
                                                    </button>

                                                    {/* Toggle Publish Mobile */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveKebab(null);
                                                            handleTogglePublish(post);
                                                        }}
                                                        className="sm:hidden w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Clock size={15} />
                                                        <span>{post.is_published ? 'Jadikan Draf' : 'Publikasikan'}</span>
                                                    </button>

                                                    <div className="my-1 border-t border-slate-100" />

                                                    {/* Hapus (ikon tempat sampah, warna teks merah) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveKebab(null);
                                                            handleDeletePost(post);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Trash2 size={15} />
                                                        <span>Hapus</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex justify-center gap-1.5 flex-wrap">
                            {posts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
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

            {/* Full Screen Modal for Tambah & Ubah */}
            {modalPost !== null && (
                <ArticleModal
                    post={modalPost.id ? modalPost : null}
                    categories={categories}
                    onClose={() => setModalPost(null)}
                />
            )}
        </AppLayout>
    );
}
