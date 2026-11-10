import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { User, Save, ArrowLeft } from 'lucide-react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/profile');
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Profil - BlogVerse Pro" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <Link
                        href="/dashboard/posts"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                    >
                        <ArrowLeft size={14} /> Kembali ke Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 mt-2">Pengaturan Profil</h1>
                    <p className="text-sm text-slate-500">Perbarui informasi profil dan akun penulis Anda</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="profile-name">
                                Nama Lengkap
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                required
                            />
                            {errors.name && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="profile-email">
                                Alamat Email
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition`}
                                required
                            />
                            {errors.email && (
                                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-60 text-sm"
                            >
                                <Save size={16} />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
