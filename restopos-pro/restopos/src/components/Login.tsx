import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
            
            // Data save karein
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Axios header update karein for immediate future calls
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            // Full page reload taake App.tsx ka state update ho jaye
            window.location.reload(); 
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <form onSubmit={handleLogin} className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="size-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">RestoPOS Pro</h1>
                    <p className="text-slate-500 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl pl-12 py-4 transition-all outline-none" 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl pl-12 py-4 transition-all outline-none" 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        disabled={loading} 
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </div>
            </form>
        </div>
    );
}