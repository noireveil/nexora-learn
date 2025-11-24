'use client';

import { DataSync } from '@/components/features/DataSync';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useProfile } from '@/hooks/useProfile';
import { UserCircle, Trophy, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user, stats, achievements, isLoading } = useProfile();

  if (isLoading) return <div className="p-20 text-center text-text-muted">Loading Profile...</div>;
  if (!user) return <div className="p-20 text-center">Please login first.</div>;

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-surfaceHighlight border-2 border-primary flex items-center justify-center">
            <UserCircle size={48} className="text-text-muted"/>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-3 mt-2">
                <Badge variant="primary">{stats.rank}</Badge>
                <span className="text-text-muted text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Stats & Data */}
        <div className="md:col-span-2 space-y-6">
            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-white/5 bg-surface/50">
                    <div className="flex items-center gap-3">
                        <Star className="text-yellow-500" />
                        <div>
                            <p className="text-xs text-text-muted uppercase">Level {stats.level}</p>
                            <p className="text-xl font-bold">{stats.xp} XP</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-white/5 bg-surface/50">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-purple-500" />
                        <div>
                            <p className="text-xs text-text-muted uppercase">Achievements</p>
                            <p className="text-xl font-bold">{achievements.length} Unlocked</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* Widget Sync Data */}
            <DataSync />
        </div>

        {/* Kolom Kanan: Achievement List */}
        <div className="md:col-span-1">
            <Card className="h-full p-6 border-white/5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500"/> Recent Achievements
                </h3>
                {achievements.length === 0 ? (
                    <p className="text-text-muted text-sm italic">Belum ada achievement yang terbuka. Teruslah belajar!</p>
                ) : (
                    <ul className="space-y-3">
                        {achievements.map((ach) => (
                            <li key={ach.id} className="text-sm p-2 bg-white/5 rounded flex justify-between">
                                <span>{ach.achievementId}</span>
                                <span className="text-xs text-text-muted">{new Date(ach.unlockedAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
}