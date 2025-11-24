import { Card } from "@/components/ui/Card";
import { Flame, Trophy, Target } from "lucide-react";

interface StatsProps {
  streak: number;
  xp: number;
  accuracy: number;
}

export const StatsOverview = ({ streak, xp, accuracy }: StatsProps) => {
  const stats = [
    {
      label: "Daily Streak",
      value: `${streak} Days`,
      icon: <Flame size={24} />,
      color: "text-orange-500",
      bg: "bg-orange-500/20"
    },
    {
      label: "Total XP",
      value: xp.toLocaleString(),
      icon: <Trophy size={24} />,
      color: "text-yellow-500",
      bg: "bg-yellow-500/20"
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: <Target size={24} />,
      color: "text-purple-500",
      bg: "bg-purple-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, idx) => (
        <Card key={idx} className="flex items-center gap-4 bg-surfaceHighlight/50 border-white/5">
          <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-text-muted text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};