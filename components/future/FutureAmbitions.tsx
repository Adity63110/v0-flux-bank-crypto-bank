"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Smartphone, Globe, Zap, ArrowRight, Shield, Bell, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FutureAmbitionsProps {
  isOpen: boolean
  onClose: () => void
}

const VISION_BLOCKS = [
  {
    id: "mobile",
    icon: <Smartphone className="h-6 w-6" />,
    title: "FluxBank Mobile App",
    description: "Banking on the go with native iOS & Android apps.",
    features: [
      "Borrow and stake directly from your phone",
      "Real-time loan tracking and approvals",
      "Push notifications for price changes"
    ],
    preview: (
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="relative w-[240px] h-[480px] bg-zinc-900 rounded-[3rem] border-4 border-zinc-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 w-full h-6 bg-zinc-800 flex justify-center pt-1">
            <div className="w-16 h-1 bg-zinc-700 rounded-full" />
          </div>
          <div className="p-6 space-y-6 pt-10">
            <div className="h-8 w-24 bg-flux/20 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-20 w-full bg-zinc-800/50 rounded-xl border border-flux/10 p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-2 w-12 bg-zinc-600 rounded" />
                  <div className="h-2 w-8 bg-flux rounded" />
                </div>
                <div className="h-4 w-20 bg-zinc-500 rounded" />
              </div>
              <div className="h-32 w-full bg-zinc-800/50 rounded-xl border border-flux/10 p-4 space-y-3">
                <div className="h-2 w-16 bg-zinc-600 rounded" />
                <div className="flex gap-2">
                  <div className="h-10 w-full bg-flux/10 rounded-lg" />
                  <div className="h-10 w-full bg-zinc-700/50 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-zinc-700" />
        </div>
      </div>
    )
  },
  {
    id: "extension",
    icon: <Globe className="h-6 w-6" />,
    title: "Browser Extension",
    description: "Seamless lending layer for your favorite dApps.",
    features: [
      "Built-in borrowing and staking layer",
      "Borrow liquidity without leaving a website",
      "Native interaction with Web3 protocols"
    ],
    preview: (
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md aspect-video bg-zinc-900 rounded-xl border-2 border-zinc-800 shadow-2xl overflow-hidden relative">
          <div className="h-8 bg-zinc-800 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="h-4 w-48 bg-zinc-700/50 rounded mx-auto" />
          </div>
          <div className="p-6 relative">
             <div className="absolute top-4 right-4 w-48 h-64 bg-zinc-950 rounded-lg border border-flux/30 shadow-2xl p-4 space-y-4 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Image src="/fluxbank-logo.png" alt="Logo" width={20} height={20} />
                  <span className="text-xs font-bold text-flux">Flux Extension</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Available Credit</div>
                  <div className="text-lg font-bold text-white">$12,450.00</div>
                  <Button size="sm" className="w-full bg-flux text-black text-[10px] h-7">Borrow USDC</Button>
                </div>
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-[8px] text-zinc-500">
                    <span>LTV Ratio</span>
                    <span className="text-flux">24.5%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[24.5%] h-full bg-flux" />
                  </div>
                </div>
             </div>
             <div className="space-y-4">
                <div className="h-8 w-32 bg-zinc-800 rounded" />
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-24 bg-zinc-800/50 rounded-lg border border-zinc-700/50" />
                   <div className="h-24 bg-zinc-800/50 rounded-lg border border-zinc-700/50" />
                </div>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "twist",
    icon: <Zap className="h-6 w-6" />,
    title: "The Flux Twist",
    description: "Banking-grade UX powered by Web3 decentralization.",
    features: [
      "Loans + staking integrated at wallet level",
      "No need to sell assets to access liquidity",
      "Unified credit score across chains"
    ],
    preview: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-flux/20 rounded-full blur-[100px] animate-pulse" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-8">
              <div className="h-24 w-24 rounded-3xl bg-zinc-900 border-2 border-flux flex items-center justify-center shadow-[0_0_30px_rgba(84,210,146,0.2)]">
                <Shield className="h-10 w-10 text-flux" />
              </div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-flux to-transparent" />
              <div className="h-24 w-24 rounded-3xl bg-zinc-900 border-2 border-white/10 flex items-center justify-center opacity-40">
                <Layout className="h-10 w-10" />
              </div>
            </div>
            <div className="flex items-center gap-8 justify-end">
              <div className="h-24 w-24 rounded-3xl bg-zinc-900 border-2 border-white/10 flex items-center justify-center opacity-40">
                <Bell className="h-10 w-10" />
              </div>
              <div className="h-0.5 w-16 bg-gradient-to-l from-flux to-transparent" />
              <div className="h-24 w-24 rounded-3xl bg-zinc-900 border-2 border-flux/50 flex items-center justify-center shadow-[0_0_20px_rgba(84,210,146,0.1)]">
                <Image src="/fluxbank-logo.png" alt="Flux" width={48} height={48} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
]

export const FutureAmbitions: React.FC<FutureAmbitionsProps> = ({ isOpen, onClose }) => {
  const [activeId, setActiveId] = useState("mobile")

  const activeBlock = VISION_BLOCKS.find(b => b.id === activeId) || VISION_BLOCKS[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-black text-white overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-flux/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-flux/10 rounded-full blur-[150px]" />
          </div>

          <div className="relative h-full flex flex-col">
            {/* Header */}
            <header className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/fluxbank-logo.png" alt="Logo" width={32} height={32} />
                <span className="font-bold tracking-tight text-xl">Future Vision</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-full hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </Button>
            </header>

            <main className="flex-1 overflow-y-auto lg:overflow-hidden">
              <div className="container mx-auto h-full px-4 lg:px-8 py-12 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 h-full items-center">
                  
                  {/* Left Column */}
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 rounded-full bg-flux/10 border border-flux/20 text-flux text-xs font-bold tracking-widest uppercase"
                      >
                        Coming Soon
                      </motion.div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight"
                      >
                        The Future of <br />
                        <span className="text-flux">FluxBank</span>
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-400 max-w-lg leading-relaxed"
                      >
                        FluxBank is expanding beyond the web. Our goal is to bring lending and staking directly into everyday crypto workflows, without friction.
                      </motion.p>
                    </div>

                    <div className="space-y-4 max-w-md">
                      {VISION_BLOCKS.map((block, i) => (
                        <motion.button
                          key={block.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          onClick={() => setActiveId(block.id)}
                          className={`w-full p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${
                            activeId === block.id 
                              ? "bg-zinc-900 border-flux shadow-[0_0_30px_rgba(84,210,146,0.1)]" 
                              : "bg-transparent border-white/5 hover:border-white/20"
                          }`}
                        >
                          {activeId === block.id && (
                            <motion.div 
                              layoutId="active-pill"
                              className="absolute inset-0 bg-flux/5 pointer-events-none"
                            />
                          )}
                          <div className="flex gap-4 items-start relative z-10">
                            <div className={`p-3 rounded-xl transition-colors ${
                              activeId === block.id ? "bg-flux text-black" : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {block.icon}
                            </div>
                            <div className="space-y-1">
                              <h4 className={`font-bold text-lg ${activeId === block.id ? "text-flux" : "text-white"}`}>
                                {block.title}
                              </h4>
                              <p className="text-sm text-zinc-500 leading-snug">
                                {block.description}
                              </p>
                              <AnimatePresence>
                                {activeId === block.id && (
                                  <motion.ul 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 space-y-2 overflow-hidden"
                                  >
                                    {block.features.map((f, j) => (
                                      <li key={j} className="flex items-center gap-2 text-xs text-zinc-300">
                                        <div className="w-1 h-1 rounded-full bg-flux" />
                                        {f}
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="relative h-full min-h-[400px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeId}
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotateY: -20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="w-full h-full"
                      >
                        {activeBlock.preview}
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Watermark */}
                    <div className="absolute bottom-8 right-8 opacity-10 flex items-center gap-2 grayscale pointer-events-none">
                       <Image src="/fluxbank-logo.png" alt="Logo" width={40} height={40} />
                       <span className="font-bold text-2xl tracking-tighter">FLUXBANK</span>
                    </div>
                  </div>

                </div>
              </div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
