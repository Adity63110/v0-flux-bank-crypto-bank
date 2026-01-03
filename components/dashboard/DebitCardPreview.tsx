"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Shield, Zap } from "lucide-react"
import Image from "next/image"

export function DebitCardPreview() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      className="perspective-1000 py-8 cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-[400px] aspect-[1.586/1] rounded-[20px] bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden mx-auto"
      >
        {/* Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Flux Accents */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-flux/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-flux/10 blur-[80px] rounded-full" />

        {/* Content */}
        <div className="relative h-full p-8 flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-flux/10 flex items-center justify-center border border-flux/20">
                <Image src="/fluxbank-logo.png" alt="Flux" width={24} height={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Flux</span>
            </div>
            <div className="h-10 w-14 rounded-md bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
               <div className="w-8 h-6 border border-yellow-500/40 rounded-sm" />
            </div>
          </div>

          <div className="space-y-4">
             <div className="text-xl font-mono tracking-[0.2em] text-white/90">
               ••••  ••••  ••••  4392
             </div>
             <div className="flex justify-between items-end">
               <div>
                 <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Card Holder</div>
                 <div className="text-sm font-medium tracking-wide text-white">USER NAME</div>
               </div>
               <div className="relative w-16 h-10">
                 <Image src="/visa-logo.png" alt="Visa" fill className="object-contain brightness-0 invert opacity-80" />
               </div>
             </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(80px)" }}>
           <motion.div 
             animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="px-6 py-2 rounded-full bg-flux/90 backdrop-blur-md text-black text-sm font-black tracking-widest border border-white/20 shadow-[0_0_20px_rgba(84,210,146,0.4)]"
           >
             COMING SOON
           </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
