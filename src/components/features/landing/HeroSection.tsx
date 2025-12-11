'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const HeroSection = () => {
  return (
    <section className="relative z-10 text-center max-w-4xl mx-auto space-y-8 pt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <Badge variant="primary" className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
        v1.0.0 Public Beta • Offline Ready
      </Badge>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-in fade-in zoom-in duration-1000">
          Master Coding with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Adaptive Intelligence
          </span>
      </h1>
      
      <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Platform belajar coding pertama di Indonesia yang 100% Offline, Gratis, dan dipersonalisasi oleh AI langsung di browser Anda.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
              <Button className="h-12 px-8 text-lg shadow-lg shadow-primary/25 w-full sm:w-auto">
                  Mulai Belajar Sekarang <ArrowRight className="ml-2 w-5 h-5"/>
              </Button>
          </Link>
          <Link href="/demo">
            <Button variant="ghost" className="h-12 px-8 text-lg w-full sm:w-auto">
                Lihat Demo
            </Button>
          </Link>
      </div>
    </section>
  );
};