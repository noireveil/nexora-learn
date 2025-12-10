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
        
        {/* Traingin Placeholder (Apus aja kalo udah) */}
        {/* <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-bold">Nexora AI Admin</h1>
          <button 
            onClick={() => trainAndSaveModel()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Latih & Download Model AI
          </button>

          <p className="text-sm text-gray-500">
            Klik tombol di atas, tunggu console log selesai, lalu file akan terdownload otomatis.
          </p>
        </div> */}

        <div className="p-10 space-y-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold">🛠️ ML Logic Tester</h1>
          
          <div className="p-4 bg-gray-100 rounded border">
            <p className="font-mono whitespace-pre-wrap">{result}</p>
          </div>

          <div className="grid gap-2">
            <p className="text-sm text-gray-500">Klik tombol untuk tes:</p>
            
            <button 
              onClick={() => testAI("User Baru (Cold Start)")}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              Tes 1: Prediksi User Baru
            </button>

            {/* Note: Tes 2 & 3 sebenarnya butuh data submission real di DB.
                Tapi minimal tombol 1 bisa membuktikan kalau MODEL.JSON berhasil di-load 
                dan tidak crash. */}
          </div>
          
          <p className="text-xs text-red-500 mt-4">
            *Catatan: Karena logic kita mengambil data dari DB (Dexie), 
            hasil prediksi akan selalu sama (Medium/Easy) sampai ada data submission asli.
            Tapi kalau muncul tulisan "Easy/Medium/Hard", berarti AI BERFUNGSI!
          </p>
        </div>
    </main>
  );
}