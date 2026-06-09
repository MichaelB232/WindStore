"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    brand: "ASUS ROG",
    title: "Built for Battlefields",
    subtitle: "Experience desktop-grade performance in a portable chassis.",
    image:
      "https://images.unsplash.com/photo-1698512475067-74ed7c956c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3VzJTIwcm9nJTIwbGFwdG9wJTIwZ2FtaW5nfGVufDF8fHx8MTc4MDcxNjIxMnww&ixlib=rb-4.1.0&q=80&w=1920",
  },
  {
    id: 2,
    brand: "Dell XPS",
    title: "Precision Meets Elegance",
    subtitle: "Stunning displays, premium materials, uncompromised power.",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxsJTIweHBzJTIwbGFwdG9wfGVufDF8fHx8MTc4MDcxNjIxMnww&ixlib=rb-4.1.0&q=80&w=1920",
  },
  {
    id: 3,
    brand: "Microsoft Surface",
    title: "Create Without Limits",
    subtitle: "Versatile, lightweight, and powerful enough for any task.",
    image:
      "https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3NvZnQlMjBzdXJmYWNlJTIwbGFwdG9wfGVufDF8fHx8MTc4MDcxNjIxMnww&ixlib=rb-4.1.0&q=80&w=1920",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#0A0F1E] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="w-full h-full object-cover opacity-60"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#0A0F1E] via-[#0A0F1E]/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0A0F1E] to-transparent opacity-80" />
            {/* Custom pattern overlays */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute inset-0 bg-noise" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 xl:px-20 relative z-10">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-accent" />

                  <h2 className="text-accent font-medium tracking-wider uppercase">
                    {slides[currentSlide].brand}
                  </h2>
                </div>

                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-inverse mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>

                <button className="bg-accent hover:bg-accent-hover text-text-inverse font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-focus">
                  Explore Now
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 w-full z-20">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 flex justify-between items-center">
          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-10 bg-accent"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:text-accent-hover hover:border-[#00D4FF]/50 transition-colors group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:text-accent-hover hover:border-[#00D4FF]/50 transition-colors group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
