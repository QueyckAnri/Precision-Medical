import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SURGEONS } from '../data/surgeonsData.js';

// Specialty to Material Symbol Icon mapper
const SPECIALTY_ICONS = {
  'NEURO-ONCOLOGY': 'biotech',
  'VASCULAR NEUROSURGERY': 'architecture',
  'SPINAL NEUROSURGERY': 'reorder',
  'PEDIATRIC NEUROSURGERY': 'child_care',
  'FUNCTIONAL NEUROSURGERY': 'psychology',
};

// Difficulty color mapping rules (Neon styled colors)
const DIFFICULTY_COLOR_CLASSES = {
  EXTREME: 'text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  HIGH: 'text-orange-500 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  STANDARD: 'text-green-500 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
};

export default function SurgeonsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSurgeon, setSelectedSurgeon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const heightScaleFactor = viewportHeight < 768 ? 0.72 : (viewportHeight < 900 ? 0.85 : 1.0);

  const rotationValue = useMotionValue(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const dragStartRot = useRef(0);
  const clickedCardIndex = useRef(null);
  const autoRotateControls = useRef(null);
  const wheelSnapTimeout = useRef(null);
  const touchStartX = useRef(0);
  const touchStartRot = useRef(0);
  const touchStartTime = useRef(0);

  // Synchronize MotionValue to React State for 3D card layout calculations
  useEffect(() => {
    const unsub = rotationValue.on('change', (v) => {
      setCurrentRotation(v);
      const normalized = ((v % 5) + 5) % 5;
      setActiveIndex(Math.round(normalized) % 5);
    });
    return unsub;
  }, [rotationValue]);

  // Smooth auto-rotation using Framer Motion linear repeat animation (60fps/120fps)
  useEffect(() => {
    if (isHovering || isSearching || isDragging) {
      if (autoRotateControls.current) {
        autoRotateControls.current.stop();
        autoRotateControls.current = null;
      }
      return;
    }

    const currentVal = rotationValue.get();
    // Rotate 1 full rotation (5 units) in 25 seconds
    autoRotateControls.current = animate(rotationValue, currentVal + 5, {
      duration: 25,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });

    return () => {
      if (autoRotateControls.current) {
        autoRotateControls.current.stop();
        autoRotateControls.current = null;
      }
    };
  }, [isHovering, isSearching, isDragging, rotationValue]);

  // Search filter and fast rotate transition
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const q = searchQuery.toLowerCase();
    const matchIdx = SURGEONS.findIndex(
      (s) => s.name.toLowerCase().includes(q) || s.specialty.toLowerCase().includes(q)
    );

    if (matchIdx !== -1) {
      const currentVal = rotationValue.get();
      const currentRound = Math.round(currentVal);
      let diff = ((matchIdx - currentRound) % 5 + 5) % 5;
      if (diff > 2.5) diff -= 5;
      const targetVal = currentVal + (currentRound - currentVal) + diff;

      // Rotate fast and snap to the matched doctor card
      animate(rotationValue, targetVal, {
        type: 'spring',
        stiffness: 350,
        damping: 28,
        mass: 1,
      });
    }
  }, [searchQuery, rotationValue]);

  // Hover Snapping: Snap to the nearest card
  const handleMouseEnter = () => {
    setIsHovering(true);
    const currentVal = rotationValue.get();
    animate(rotationValue, Math.round(currentVal), {
      type: 'spring',
      stiffness: 150,
      damping: 22,
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Native Wheel Listener with passive: false to strictly allow preventDefault()
  // and stop the viewport page from scrolling while manually rotating the carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e) => {
      e.preventDefault(); // Stop main page scrolling

      clearTimeout(wheelSnapTimeout.current);

      const delta = e.deltaY * 0.002;
      rotationValue.set(rotationValue.get() + delta);

      wheelSnapTimeout.current = setTimeout(() => {
        const currentVal = rotationValue.get();
        animate(rotationValue, Math.round(currentVal), {
          type: 'spring',
          stiffness: 150,
          damping: 22,
        });
      }, 200);
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelNative);
    };
  }, [rotationValue]);

  // Drag & Click Handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragStartTime.current = Date.now();
    dragStartRot.current = rotationValue.get();

    // Identify which card was targeted (if any)
    const targetCard = e.target.closest('[data-card-index]');
    clickedCardIndex.current = targetCard ? parseInt(targetCard.getAttribute('data-card-index'), 10) : null;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    const dRot = -dx / 320; // Drag sensitivity
    rotationValue.set(dragStartRot.current + dRot);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    const duration = Date.now() - dragStartTime.current;

    // Click threshold check (less than 6 pixels of movement and completed in under 300ms)
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && duration < 300 && clickedCardIndex.current !== null) {
      handleCardClick(clickedCardIndex.current);
      return;
    }

    // Otherwise, snap to nearest card
    const currentVal = rotationValue.get();
    animate(rotationValue, Math.round(currentVal), {
      type: 'spring',
      stiffness: 150,
      damping: 22,
    });
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      setSelectedSurgeon(SURGEONS[index]);
    } else {
      // Rotate to clicked card
      const currentVal = rotationValue.get();
      const currentRound = Math.round(currentVal);
      let diff = ((index - currentRound) % 5 + 5) % 5;
      if (diff > 2.5) diff -= 5;
      const targetVal = currentVal + (currentRound - currentVal) + diff;

      animate(rotationValue, targetVal, {
        type: 'spring',
        stiffness: 150,
        damping: 22,
      });
    }
  };

  // Touch handlers (separate from pointer events for smooth mobile carousel)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartRot.current = rotationValue.get();
    touchStartTime.current = Date.now();
    setIsDragging(true);
    if (autoRotateControls.current) {
      autoRotateControls.current.stop();
      autoRotateControls.current = null;
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent page scroll while rotating carousel
    const dx = e.touches[0].clientX - touchStartX.current;
    const dRot = -dx / 280;
    rotationValue.set(touchStartRot.current + dRot);
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    const duration = Date.now() - touchStartTime.current;

    // Tap detection: tiny movement, fast
    if (Math.abs(dx) < 8 && duration < 300) {
      const currentVal = rotationValue.get();
      animate(rotationValue, Math.round(currentVal), { type: 'spring', stiffness: 150, damping: 22 });
      return;
    }

    // Momentum snap
    const currentVal = rotationValue.get();
    animate(rotationValue, Math.round(currentVal), { type: 'spring', stiffness: 150, damping: 22 });
  };

  return (
    <section className="relative w-full h-full flex flex-col justify-between items-center py-4 overflow-hidden bg-[#F9F9F9]" style={{ touchAction: 'none' }}>
      {/* Background stretched "OUR SURGEONS" text (using fluid responsive clamp sizing) */}
      <div
        className="absolute left-[50px] right-[50px] top-[clamp(40px,7vh,70px)] -z-10 pointer-events-none select-none opacity-[0.06] flex justify-between uppercase"
        style={{
          fontFamily: 'Tiposka, sans-serif',
          fontSize: 'clamp(80px, 12vw, 170px)',
          lineHeight: '1',
        }}
      >
        {"OUR SURGEONS".split("").map((char, idx) => (
          <span key={idx} style={{ display: 'inline-block' }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      {/* Search Bar Section */}
      <div className="relative w-full max-w-2xl px-6 mb-4 mt-2 z-20">
        <div className="relative flex items-center">
          <span
            className="material-symbols-outlined absolute left-5 text-[#F55F24]"
            style={{ fontSize: '20px' }}
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Do you know your doctor's name? Start typing here..."
            className="w-full h-14 pl-14 pr-6 rounded-full bg-[#262323] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#F55F24] placeholder:text-white/40 transition-all font-sans"
            style={{ fontSize: 'clamp(14px, 2.5vw, 20px)' }}
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 min-h-[300px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'none' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full transform-style-3d perspective-1500 font-sans">
          {SURGEONS.map((surgeon, index) => {
            const angle = ((index - currentRotation) / 5) * 360;
            let normalizedAngle = ((angle + 180) % 360 + 360) % 360 - 180;
            const rad = (normalizedAngle * Math.PI) / 180;

            const RADIUS = 600 * Math.max(0.85, heightScaleFactor); // Adjust spacing dynamically with height scale
            const x = Math.sin(rad) * RADIUS;
            const z = Math.cos(rad) * RADIUS - RADIUS;

            const isActive = index === activeIndex;

            // Highlight & scale conditions:
            // - Active card only scales up to 1.12 and gets border if paused (isHovering is true) AND cursor is over it (hoveredCardIndex === index).
            // - While spinning (isHovering is false), center card stays at 1.0 (no enlarge) with default border.
            const isCenterHovered = isActive && isHovering && hoveredCardIndex === index;
            const baseScale = isCenterHovered ? 1.12 : (isActive ? 1.0 : 0.82);
            const scale = baseScale * heightScaleFactor;
            const showBorder = isCenterHovered;

            // Discrete opacities (1.0 for active, 0.5 for inactive) allow a gorgeous CSS fade transition
            const opacity = isActive ? 1.0 : 0.5;
            const zIndex = isActive ? 50 : Math.round(10 + Math.cos(rad) * 10);
            const blur = isActive ? 0 : Math.min(3, Math.abs(normalizedAngle) / 25);

            return (
              <div
                key={surgeon.id}
                data-card-index={index}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px)`,
                  zIndex: zIndex,
                  cursor: 'pointer',
                }}
              >
                {/* Nested card element to separate high-frequency 3D translation from CSS transitions (prevents lag and jerky jumps) */}
                <div
                  className={`w-[340px] bg-white rounded-3xl overflow-hidden border ${
                    showBorder ? 'border-[#F55F24] shadow-lg' : 'border-black/5'
                  }`}
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : 'none',
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s ease, filter 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                >
                  {/* Photo container */}
                  <div className="w-full h-[320px] overflow-hidden bg-black/5 relative">
                    <img
                      src={surgeon.photo}
                      alt={surgeon.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isActive ? 'grayscale-0' : 'grayscale'
                      }`}
                      draggable="false"
                    />
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex flex-col justify-between" style={{ height: '180px' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h3
                          className="font-bold text-[#262323] uppercase leading-tight tracking-tight font-serif"
                          style={{ fontSize: '20px' }}
                        >
                          {surgeon.name}
                        </h3>
                        <p className="text-black/55 uppercase font-medium mt-1 font-sans" style={{ fontSize: '16px' }}>
                          {surgeon.specialty}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex gap-0.5 text-[#F55F24]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.floor(surgeon.rating) ? '#F55F24' : 'none'}
                              color="#F55F24"
                            />
                          ))}
                        </div>
                        <span className="text-black/40 uppercase font-semibold mt-1 font-sans" style={{ fontSize: '16px' }}>
                          {surgeon.rating} Rating
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-black/10">
                      <span className="font-semibold text-black/60 font-sans" style={{ fontSize: '16px' }}>
                        Experience: {surgeon.experience} yrs
                      </span>
                      <span className="material-symbols-outlined text-[#262323]/50">
                        {SPECIALTY_ICONS[surgeon.specialty] || 'psychology'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Futuristic Doctor Overlay Card Modal */}
      <AnimatePresence>
        {selectedSurgeon && (
          <DoctorModal
            surgeon={selectedSurgeon}
            onClose={() => setSelectedSurgeon(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Advanced Before / After Scanner Slider Component ──────────────── */
function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1 || e.type === 'touchmove') {
      handleMove(e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240px] bg-[#111111] border border-black/10 rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseDown={(e) => handleMove(e.clientX)}
    >
      {/* Grid Pattern definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mri-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245, 95, 36, 0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
      </svg>

      {/* Before scan (Underneath layer - Tumor visible) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#mri-grid)" />
          {/* Stylized Brain Scan outline */}
          <path d="M200 20 C110 20, 60 70, 75 125 C90 170, 135 180, 200 180 C265 180, 310 170, 325 125 C340 70, 290 20, 200 20 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <path d="M200 20 C200 50, 195 90, 190 110 C185 130, 185 160, 200 180" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Tumor Highlight (Red glowing spot on the left brain slice hemisphere) */}
          <circle cx="150" cy="95" r="26" fill="#EF4444" opacity="0.4" filter="blur(8px)" />
          <circle cx="150" cy="95" r="14" fill="#F87171" opacity="0.65" filter="blur(3px)" />
          <circle cx="150" cy="95" r="5" fill="#FFFFFF" opacity="0.9" />

          <text x="24" y="32" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace" letterSpacing="1">SCAN // BEFORE_OP (TUMOR DETECTED)</text>
        </svg>
      </div>

      {/* After scan (Clipped overlay layer - Tumor removed) */}
      <div
        className="absolute inset-0 h-full flex items-center justify-center bg-[#111111]"
        style={{
          width: `${sliderPos}%`,
          overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 w-full h-full flex items-center justify-center" style={{ width: containerRef.current ? containerRef.current.offsetWidth : 500 }}>
          <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#mri-grid)" />
            {/* Stylized Brain Scan outline */}
            <path d="M200 20 C110 20, 60 70, 75 125 C90 170, 135 180, 200 180 C265 180, 310 170, 325 125 C340 70, 290 20, 200 20 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <path d="M200 20 C200 50, 195 90, 190 110 C185 130, 185 160, 200 180" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Tumor absent - completely healthy brain tissue representation */}
            <text x="24" y="32" fill="#22C55E" fontSize="9" fontFamily="monospace" letterSpacing="1">SCAN // AFTER_OP [100% RECTIFIED / RADICAL RESECTION]</text>
          </svg>
        </div>
      </div>

      {/* Custom sliding handle bar */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#F55F24] shadow-[0_0_8px_#F55F24]"
        style={{
          left: `${sliderPos}%`,
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#262323] border border-[#F55F24] shadow-[0_0_8px_rgba(245,95,36,0.4)] flex items-center justify-center text-[10px] text-white font-mono pointer-events-none">
          ↔
        </div>
      </div>
    </div>
  );
}

/* ─── Doctor Modal Component (Futuristic Detailed Two-Column Overlay) ── */
function DoctorModal({ surgeon, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const handleBooking = () => {
    // Redirect to preselected doctor consult booking route
    window.location.href = `/consult.html?surgeon=${surgeon.id}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Split surgeon's bio into biography paragraph and fellowships/milestones
  const biographyText = surgeon.bio
    .slice(0, 2)
    .map((b) => `${b.year} - ${b.text}`)
    .join('. ');

  const fellowships = surgeon.bio.slice(2);

  // UX Filter: Display reviews matching primary specialty
  const specialtyMatchingReviews = surgeon.reviews;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-[#262323]/10 backdrop-blur-[12px] flex items-center justify-center z-[1000] p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-5xl max-h-[90vh] bg-[#F9F9F9] rounded-3xl overflow-y-auto shadow-2xl relative border border-black/5 font-sans"
      >
        {/* Minimal High-Tech Close Button [✕] in top-right with neon hover state */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#262323] hover:text-[#F55F24] hover:border-[#F55F24] hover:shadow-[0_0_10px_#F55F24] transition-all duration-300 z-50 font-bold"
          title="Close (ESC)"
        >
          ✕
        </button>

        {/* Two-column grid: stacks on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[330px_1fr]">
        <div className="border-b md:border-b-0 md:border-r border-black/5 p-6 flex flex-col gap-4 bg-white shrink-0">
          {/* Static premium portrait container */}
          <div className="w-full h-[200px] md:h-[220px] rounded-2xl overflow-hidden border-2 border-dashed border-[#F55F24]/30 bg-black/5 relative shrink-0">
            <img
              src={surgeon.photo}
              alt={surgeon.name}
              className="w-full h-full object-cover grayscale contrast-[1.05]"
            />
          </div>

          {/* High-Tech Badges Stack: vertical stack with glowing border styling */}
          <div className="flex flex-col gap-2.5">
            {[
              ['Experience', `${surgeon.experience} Years`],
              ['Operations', `${surgeon.surgeries}+`],
              ['Rating', `${surgeon.rating} / 5.0`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-center px-4 py-2.5 border border-[#F55F24]/20 bg-white/80 rounded-xl font-mono text-[12px] shadow-[0_0_8px_rgba(245,95,36,0.03)]"
              >
                <span className="text-[#262323]/50 uppercase tracking-wider text-[11px]">{label}:</span>
                <span className="font-bold text-[#F55F24]">{value}</span>
              </div>
            ))}
          </div>

          {/* Prominent neon-accented CTA Button (shrunk to fit within border perfectly) */}
          <button
            onClick={handleBooking}
            className="w-full py-3 bg-[#F55F24] hover:bg-[#e04e14] text-white rounded-full font-bold tracking-wider uppercase text-[11px] font-mono transition-all duration-300 shadow-[0_4px_12px_rgba(245,95,36,0.15)] hover:shadow-[0_4px_20px_rgba(245,95,36,0.3)] active:scale-[0.99] shrink-0"
          >
            Select This Specialist
          </button>
        </div>

        {/* ➡️ RIGHT COLUMN: Dynamic Interactive Content */}
        <div className="flex flex-col overflow-hidden bg-white/60">
          {/* Profile Basic Title */}
          <div className="p-8 pb-4 border-b border-black/5">
            <span className="text-[11px] font-bold text-[#F55F24] tracking-widest uppercase font-mono">
              {surgeon.specialtyFull}
            </span>
            <h2 className="text-[28px] font-bold text-[#262323] uppercase tracking-tight mt-1 font-serif">
              {surgeon.name}
            </h2>
          </div>

          {/* Futuristic Tab Switcher */}
          <div className="flex border-b border-black/5 px-6 bg-black/[0.01]">
            {[
              ['01 / Expertise', 0],
              ['02 / Latest Case', 1],
              ['03 / Reviews', 2],
            ].map(([lbl, tabIdx]) => (
              <button
                key={lbl}
                onClick={() => setActiveTab(tabIdx)}
                className={`py-4 px-5 font-bold text-[11px] tracking-widest uppercase font-mono border-b-2 transition-all duration-300 ${
                  activeTab === tabIdx
                    ? 'border-[#F55F24] text-[#F55F24]'
                    : 'border-transparent text-[#262323]/40 hover:text-[#262323]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Content Panel (Scrolls independently!) */}
          <div className="p-8 flex-1 overflow-y-auto bg-white/20">
            <AnimatePresence mode="wait">
              {/* TAB 1: Expertise */}
              {activeTab === 0 && (
                <motion.div
                  key="expertise-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Inspirational Credo Quote */}
                  <div className="border-l-4 border-[#F55F24] bg-[#F55F24]/5 p-6 rounded-r-2xl shadow-[inset_0_0_12px_rgba(245,95,36,0.02)]">
                    <span className="text-[10px] font-bold text-[#F55F24] tracking-widest uppercase font-mono block mb-2">
                      Credo // Prostymi slovami
                    </span>
                    <p className="text-[17px] text-[#262323] italic font-sans leading-relaxed">
                      "{surgeon.quote}"
                    </p>
                  </div>

                  {/* Biography */}
                  <div>
                    <span className="text-[11px] font-bold text-[#262323]/40 tracking-wider uppercase font-mono block mb-3">
                      Academic Biography
                    </span>
                    <p className="text-[#262323] text-[15px] leading-relaxed font-sans bg-white/40 p-4 border border-black/5 rounded-xl">
                      {biographyText}
                    </p>
                  </div>

                  {/* Global Fellowships */}
                  <div>
                    <span className="text-[11px] font-bold text-[#262323]/40 tracking-wider uppercase font-mono block mb-3">
                      Global Fellowships & Training
                    </span>
                    <div className="flex flex-col gap-3">
                      {fellowships.map((f, i) => (
                        <div key={i} className="flex gap-4 items-start py-2.5 border-t border-black/5">
                          <span className="font-mono text-[12px] font-bold text-[#F55F24] w-12 shrink-0">
                            {f.year}
                          </span>
                          <span className="text-[#262323] text-[14px] leading-relaxed font-sans">
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Latest Case */}
              {activeTab === 1 && (
                <motion.div
                  key="latestcase-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Case Headers */}
                  <div className="bg-white/40 border border-black/5 p-6 rounded-2xl flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-black/30 tracking-widest uppercase font-mono">PRIMARY DIAGNOSIS</span>
                      <h4 className="text-[18px] font-bold text-[#262323] uppercase tracking-tight mt-1 font-serif">
                        {surgeon.lastCase.diagnosis}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center mt-1">
                      {/* Complexity graphic text label with explicit neon color coding rules */}
                      <span
                        className={`text-[11px] font-bold tracking-widest uppercase border px-3 py-1 rounded font-mono ${
                          DIFFICULTY_COLOR_CLASSES[surgeon.lastCase.difficulty] || 'text-[#262323] border-black/10'
                        }`}
                      >
                        Difficulty Level: [{surgeon.lastCase.difficulty}]
                      </span>

                      {/* Success Rate outcome metric */}
                      <span className="text-[11px] font-bold text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.15)] px-3 py-1 rounded tracking-widest uppercase font-mono">
                        Success Rate: [{surgeon.lastCase.successBadge}]
                      </span>
                    </div>
                  </div>

                  {/* Interactive Surgery Timeline */}
                  <div>
                    <span className="text-[11px] font-bold text-[#262323]/40 tracking-wider uppercase font-mono block mb-4">
                      Interactive Surgery Timeline
                    </span>
                    <div className="flex flex-col gap-4 pl-2">
                      {surgeon.lastCase.timeline.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="flex flex-col items-center mt-1">
                            <div className="w-3 h-3 rounded-full bg-[#F55F24] shadow-[0_0_8px_#F55F24] shrink-0" />
                            {i < surgeon.lastCase.timeline.length - 1 && (
                              <div className="w-[1px] h-12 bg-black/10 mt-1" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-[#F55F24] font-mono text-[12px] tracking-wide block">
                              {step.time}
                            </span>
                            <p className="text-[#262323] text-[14.5px] mt-1 leading-relaxed font-sans">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Before / After Split Slider Section */}
                  <div>
                    <span className="text-[11px] font-bold text-[#262323]/40 tracking-wider uppercase font-mono block mb-3">
                      Scan Verification // Before / After Split Slider
                    </span>
                    <BeforeAfterSlider />
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Reviews */}
              {activeTab === 2 && (
                <motion.div
                  key="reviews-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#262323]/40 tracking-wider uppercase font-mono block">
                      Patient Gratitude Stories
                    </span>
                    {/* UX Filter Indicator */}
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/5 border border-green-500/20 px-2 py-0.5 rounded uppercase font-mono">
                      UX Filter Active: Matching Specialization
                    </span>
                  </div>

                  {specialtyMatchingReviews.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {/* Highlighted matched diagnosis review card */}
                      <div className="border border-black/5 bg-white/60 p-6 rounded-2xl relative shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-0.5 text-[#F55F24]">
                            {Array.from({ length: specialtyMatchingReviews[reviewIndex].stars }).map((_, i) => (
                              <Star key={i} size={14} fill="#F55F24" color="#F55F24" />
                            ))}
                          </div>
                          <span className="text-[9.5px] font-bold text-[#F55F24] border border-[#F55F24]/20 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                            Matching Diagnosis // {surgeon.specialty}
                          </span>
                        </div>

                        <p className="text-[#262323] text-[15px] italic leading-relaxed font-sans mb-4">
                          "{specialtyMatchingReviews[reviewIndex].text}"
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center bg-black/5 font-mono font-bold text-[11px] text-[#262323]/40 select-none">
                            VP
                          </div>
                          <div>
                            <span className="font-bold text-[#262323] text-[12px] block font-mono">
                              {specialtyMatchingReviews[reviewIndex].author}
                            </span>
                            <span className="text-black/40 text-[9px] font-bold tracking-wider uppercase block font-mono">
                              Verified Patient
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pagination Controls */}
                      {specialtyMatchingReviews.length > 1 && (
                        <div className="flex items-center gap-3 self-start mt-2">
                          <button
                            onClick={() => setReviewIndex((i) => (i - 1 + specialtyMatchingReviews.length) % specialtyMatchingReviews.length)}
                            className="w-9 h-9 border border-black/10 rounded-xl flex items-center justify-center text-[#262323] hover:bg-black/5 transition-colors"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="font-mono text-[13px] text-black/50">
                            {reviewIndex + 1} / {specialtyMatchingReviews.length}
                          </span>
                          <button
                            onClick={() => setReviewIndex((i) => (i + 1) % specialtyMatchingReviews.length)}
                            className="w-9 h-9 border border-black/10 rounded-xl flex items-center justify-center text-[#262323] hover:bg-black/5 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>{/* end grid */}
      </motion.div>
    </motion.div>
  );
}
