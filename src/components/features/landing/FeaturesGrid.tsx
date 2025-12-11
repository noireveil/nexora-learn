import { Card } from "@/components/ui/Card";
import { Wifi, Shield, Zap } from "lucide-react";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: <Zap className="w-10 h-10 text-primary mb-4" />,
      title: "Adaptive Learning",
      description: "Tingkat kesulitan soal menyesuaikan kemampuan Anda secara real-time menggunakan TensorFlow.js."
    },
    {
      icon: <Wifi className="w-10 h-10 text-secondary mb-4" />,
      title: "100% Offline",
      description: "Tidak ada internet? Tidak masalah. PWA kami menyimpan semua data dan model AI di perangkat Anda."
    },
    {
      icon: <Shield className="w-10 h-10 text-accent mb-4" />,
      title: "Anti-Paste Integrity",
      description: "Sistem mendeteksi anomali pengetikan. Copy-Paste dilarang untuk melatih Muscle Memory coding yang sesungguhnya."
    }
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6 mt-24 relative z-10">
      {features.map((feature, index) => (
        <Card key={index} glow className="bg-surface/30 hover:bg-surface/50 transition-colors">
          {feature.icon}
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-text-muted leading-relaxed">
            {feature.description}
          </p>
        </Card>
      ))}
    </section>
  );
};