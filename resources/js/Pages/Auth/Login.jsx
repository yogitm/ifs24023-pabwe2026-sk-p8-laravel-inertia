import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AppLayout publicPage={true}>
            <Head title="Masuk ke Akun - BlogVerse Pro" />
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-3 transition">
                            <ArrowLeft size={14} /> Kembali ke Beranda
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Selamat Datang Kembali</h1>
                        <p className="text-sm text-slate-500 mt-1">Masuk untuk mengelola dan mempublikasikan artikel Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="login-username">
                                Alamat Email
                            </label>
                            <input
                                id="login-username"
                                type="email"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.username ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                placeholder="nama@email.com"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="login-password">
                                Kata Sandi
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Ingat saya</span>
                            </label>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Masuk ke Akun</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
                        Belum memiliki akun penulis?{' '}
                        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700">
                            Daftar di sini
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
