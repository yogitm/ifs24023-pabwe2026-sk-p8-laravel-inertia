import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AppLayout publicPage={true}>
            <Head title="Daftar Akun Penulis - BlogVerse Pro" />
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-3 transition">
                            <ArrowLeft size={14} /> Kembali ke Beranda
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Daftar Penulis Baru</h1>
                        <p className="text-sm text-slate-500 mt-1">Mulai bagikan tulisan dan ide inspiratif Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="register-name">
                                Nama Lengkap
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                placeholder="Nama Anda"
                                required
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="register-email">
                                Alamat Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                placeholder="nama@email.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="register-password">
                                Kata Sandi
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                placeholder="Minimal 8 karakter"
                                required
                            />
                            {errors.password && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="register-password-confirm">
                                Konfirmasi Kata Sandi
                            </label>
                            <input
                                id="register-password-confirm"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition"
                                placeholder="Ulangi kata sandi"
                                required
                            />
                        </div>

                        <button
                            id="register-submit"
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
                                    <span>Mendaftarkan...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Daftar Sekarang</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
