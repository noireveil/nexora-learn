'use client';

import { useState } from 'react';
import { useEffect } from "react";
import { seedDatabase } from "@/lib/db/seeder";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { FeaturesGrid } from "@/components/features/landing/FeaturesGrid";

import { trainAndSaveModel } from '@/ml/train';
import { predictNextDifficulty } from '@/ml/services/difficultyPredictor';

export default function Home() {
  const [result, setResult] = useState<string>("Belum ada prediksi");
  const [loading, setLoading] = useState(false);

  // Fungsi untuk simulasi user
  const testAI = async (scenario: string) => {
    setLoading(true);
    setResult("Sedang mikir...");
    
    // Kita perlu userId dummy untuk memanggil fungsi
    // (Pastikan di DB ada data dummy atau extractor menangani null dengan baik)
    const userId = "test-user"; 
    
    // Panggil fungsi prediksi
    try {
      const prediction = await predictNextDifficulty(userId);
      setResult(`Skenario: ${scenario} \n➡️ AI Menyarankan: ${prediction}`);
    } catch (e) {
      setResult("Error: " + e);
    }
    setLoading(false);
  };

  // Initialization logic
  useEffect(() => {
    const initApp = async () => {
      await seedDatabase();
      // Future: Add other init logic here (Service Worker reg, etc)
    };
    initApp();
  }, []);

  return (
    <main className="container mx-auto px-6 py-20 relative overflow-hidden">
        <HeroSection />
        <FeaturesGrid />        
    </main>
  );
}