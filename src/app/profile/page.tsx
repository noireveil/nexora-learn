'use client';

import { DataSync } from '@/components/features/DataSync';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useProfile } from '@/hooks/useProfile';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { UserCircle, Trophy, Activity, Lock, Zap, Target, Award, Camera, Edit2, Check, X } from 'lucide-react';
import { BADGES, BadgeDef } from '@/lib/gamification/badges'; 
import { db } from '@/lib/db/schema';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const isAuthorized = useRouteProtection();
  const { user, stats, achievements, isLoading } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (user) setNewName(user.username);
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 2 * 1024 * 1024) { 
        toast.error("Ukuran foto maksimal 2MB");
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
        try {
            const base64 = ev.target?.result as string;
            await db.users.update(user.id!, { avatar: base64 });
            toast.success("Foto profil diperbarui! Refresh untuk melihat.");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error("Gagal menyimpan foto.");
        } finally {
            setIsUploading(false);
        }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = async () => {
      if (!newName.trim() || !user?.id) return;
      try {
          await db.users.update(user.id, { username: newName });
          toast.success("Nama berhasil diubah!");
          setIsEditingName(false);
          setTimeout(() => window.location.reload(), 500); 
      } catch (e) {
          toast.error("Gagal mengubah nama");
      }
  };

  if (!isAuthorized || isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return null;

  const unlockedIds = new Set(achievements.map(a => a.achievementId));

  const getBadgeStyle = (badge: BadgeDef, isUnlocked: boolean) => {
    if (!isUnlocked) return { bg: 'bg-slate-100', text: 'text-slate-400', border: 'border-slate-200' };
    switch(badge.tier) {
        case 'BRONZE': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
        case 'SILVER': return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' };
        case 'GOLD': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-300' };
        case 'PLATINUM': return { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-300' };
        default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  const getBadgeIcon = (type: string, size = 20) => {
      if (type === 'STREAK') return <Zap size={size} />;
      if (type === 'SOLVER') return <Target size={size} />;
      if (type === 'LEVEL') return <Award size={size} />;
      return <Trophy size={size} />;
  };

  return (
    <div className="container mx-auto px-6 py-10 space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        
        <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserCircle size={80} className="text-slate-300"/>
                )}
                
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={24} />
                    <span className="text-[10px] font-bold mt-1">Ubah</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading}/>
                </label>
            </div>
            
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                 <Badge variant="primary" className="bg-slate-900 text-white border-none shadow-md px-3 py-1">Lvl {stats.level}</Badge>
            </div>
        </div>
        
        <div className="text-center md:text-left flex-1 w-full">
            {isEditingName ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <input 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="text-3xl font-black text-slate-900 border-b-2 border-primary outline-none bg-transparent w-full max-w-[300px]"
                        autoFocus
                    />
                    <button onClick={handleSaveName} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><Check size={20}/></button>
                    <button onClick={() => setIsEditingName(false)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><X size={20}/></button>
                </div>
            ) : (
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2 group">
                    <h1 className="text-3xl font-black text-slate-900">{user.username}</h1>
                    
                    <button 
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        aria-label="Edit Name"
                        title="Ubah Nama"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>
            )}
            
            <p className="text-slate-500 text-sm mb-4">Bergabung sejak {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <div className="max-w-md mx-auto md:mx-0 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>{stats.xp} XP</span>
                    <span>Next: {stats.nextXp} XP</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: `${stats.progress}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 min-w-[120px]">
                    <p className="text-xs font-bold text-slate-400 uppercase">Rank</p>
                    <p className="text-lg font-bold text-primary">{stats.rank}</p>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 min-w-[120px]">
                    <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                    <p className="text-lg font-bold text-emerald-600">Active</p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500"/> Koleksi Badge
            </h2>
            
            {achievements.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Belum ada badge yang terbuka. Selesaikan soal pertamamu!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {BADGES.map((badge) => {
                        const isUnlocked = unlockedIds.has(badge.id);
                        const style = getBadgeStyle(badge, isUnlocked);
                        
                        return (
                            <Card 
                                key={badge.id} 
                                className={`p-4 flex flex-col items-center text-center gap-3 transition-all duration-300 border ${style.border} ${
                                    isUnlocked ? 'bg-white shadow-sm' : 'bg-slate-50/50 opacity-60 grayscale'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>
                                    {isUnlocked ? getBadgeIcon(badge.type, 24) : <Lock size={20}/>}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {badge.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">{badge.description}</p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>

        <div className="md:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-blue-500"/> Data & Settings
            </h2>
            <DataSync />
        </div>
      </div>
    </div>
  );
}