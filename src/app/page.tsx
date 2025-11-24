'use client';

import { useEffect } from "react";
import { seedDatabase } from "@/lib/db/seeder";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { FeaturesGrid } from "@/components/features/landing/FeaturesGrid";

export default function Home() {
  
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