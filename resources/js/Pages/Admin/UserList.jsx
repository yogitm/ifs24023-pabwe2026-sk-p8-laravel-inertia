import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Users, FileText, ArrowRight } from 'lucide-react';

export default function UserList({ users }) {
    return (
        <AppLayout>
            <Head title="Admin: Kelola Pengguna - BlogVerse Pro" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                            Panel Administrator
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                            Kelola Daftar Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau akun terdaftar, peran, serta produktivitas artikel pengguna
                        </p>
                    </div>

                    <Link
                        href="/admin/posts"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition cursor-pointer"
                    >
                        <FileText size={15} />
                        <span>Monitoring Seluruh Artikel</span>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between">
                        <span>Daftar Pengguna Sistem</span>
                        <span className="text-xs text-slate-400 font-normal">
                            Total {users.total || users.data?.length || 0} pengguna
                        </span>
                    </div>

                    {!users.data || users.data.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Users size={40} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">Belum ada pengguna terdaftar</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {users.data.map((user) => (
                                <div key={user.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h2 className="font-bold text-slate-900 text-base truncate">{user.name}</h2>
                                                <span
                                                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:inline-flex text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-lg">
                                            {user.posts_count ?? 0} Artikel
                                        </span>
                                        <Link
                                            href={`/admin/users/${user.id}/posts`}
                                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition flex items-center gap-1 shrink-0"
                                        >
                                            <span>Lihat Artikel</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex justify-center gap-1.5 flex-wrap">
                            {users.links.map((link, idx) => (
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
