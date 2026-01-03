"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Coins, 
  TrendingUp, 
  Repeat, 
  ShieldCheck, 
  BarChart3, 
  Lock, 
  PieChart,
  Layers,
  Zap,
  ChevronRight
} from 'lucide-react'
import { Reveal } from '@/components/animations/Reveal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const TokenomicsPage = () => {
  const utilityCards = [
    {
      title: "Borrowing Collateral",
      description: "Flux can be used as collateral to borrow multiple cryptocurrencies. Higher Flux holdings unlock better borrow limits.",
      icon: <ShieldCheck className="w-6 h-6 text-[#54d292]" />
    },
    {
      title: "Staking & Yield",
      description: "Stake Flux to earn protocol rewards. Rewards scale with platform usage and lock duration.",
      icon: <TrendingUp className="w-6 h-6 text-[#54d292]" />
    },
    {
      title: "Fee Recycling",
      description: "Creator fees collected from borrowing and staking are recycled back into the ecosystem through buybacks.",
      icon: <Repeat className="w-6 h-6 text-[#54d292]" />
    },
    {
      title: "Governance",
      description: "Flux holders influence protocol decisions. Voting power scales with stake and participation history.",
      icon: <Layers className="w-6 h-6 text-[#54d292]" />
    }
  ]

  const stats = [
    { label: "Total Supply", value: "1,000,000,000", sub: "FLUX" }
  ]

  const distribution = [
    { category: "Community & Rewards", percentage: 40, color: "#54d292" },
    { category: "Ecosystem Growth", percentage: 25, color: "#3da675" },
    { category: "Team & Advisors", percentage: 15, color: "#2d7a56" },
    { category: "Treasury", percentage: 12, color: "#1d523a" },
    { category: "Liquidity", percentage: 8, color: "#0e291d" }
  ]

  const flywheelSteps = [
    {
      title: "User Activity",
      desc: "Borrowing, staking, and protocol usage generate creator fees",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Creator Fee Collection",
      desc: "Fees accumulate in the FluxBank treasury transparently",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: "Automated Buybacks",
      desc: "A portion of fees is used to buy Flux from the open market",
      icon: <Coins className="w-5 h-5" />
    },
    {
      title: "User Rewards",
      desc: "Bought-back Flux is distributed to stakers and active users",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "Increased Participation",
      desc: "Rewards encourage more usage, restarting the cycle",
      icon: <Repeat className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-[#54d292] bg-clip-text text-transparent">
              Flux Tokenomics
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-gray-400 max-w-2xl">
              The Engine Behind Borrowing, Staking, and Rewards. Flux powers the entire FluxBank ecosystem, creating a sustainable value loop.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-12">
            <section>
              <Reveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-8 bg-[#54d292] rounded-full" />
                  <h2 className="text-2xl font-bold">Utility & Value Capture</h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {utilityCards.map((card, idx) => (
                  <Reveal key={idx} delay={0.1 * idx}>
                    <motion.div
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="h-full"
                    >
                      <Card className="bg-[#111] border-white/5 h-full hover:border-[#54d292]/30 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="mb-3">{card.icon}</div>
                          <CardTitle className="text-lg text-white">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-400">
                            {card.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section className="p-8 rounded-2xl bg-gradient-to-br from-[#111] to-black border border-white/5">
              <Reveal>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-[#54d292]" />
                  User Benefit Highlights
                </h3>
              </Reveal>
              <div className="space-y-4">
                {[
                  "Fees work for users, not against them",
                  "Platform growth directly benefits Flux holders",
                  "Sustainable rewards backed by real activity"
                ].map((text, i) => (
                  <Reveal key={i} delay={0.4 + (i * 0.1)}>
                    <div className="flex items-center gap-3 text-gray-300">
                      <ChevronRight className="w-4 h-4 text-[#54d292]" />
                      <span>{text}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-12">
            <section>
              <Reveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-8 bg-[#54d292] rounded-full" />
                  <h2 className="text-2xl font-bold">Token Supply & Distribution</h2>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <Reveal key={idx} delay={0.1 * idx}>
                    <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">{stat.value}</span>
                        <span className="text-xs text-[#54d292]">{stat.sub}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <Card className="bg-[#111] border-white/5 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-[#54d292]" />
                      Allocation Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {distribution.map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{item.category}</span>
                            <span className="text-white font-medium">{item.percentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            </section>

            <section className="relative">
               <Reveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-8 bg-[#54d292] rounded-full" />
                  <h2 className="text-2xl font-bold">Fee Buyback Flywheel</h2>
                </div>
              </Reveal>

              <div className="relative p-6 rounded-2xl bg-[#0a0a0a] border border-[#54d292]/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#54d292]/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="relative space-y-6">
                  {flywheelSteps.map((step, idx) => (
                    <Reveal key={idx} delay={0.2 * idx}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#111] border border-[#54d292]/30 flex items-center justify-center text-[#54d292]">
                            {step.icon}
                          </div>
                          {idx !== flywheelSteps.length - 1 && (
                            <div className="w-px h-full bg-gradient-to-b from-[#54d292]/30 to-transparent my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <h4 className="font-bold text-white mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* Animated visual element */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Repeat className="w-24 h-24 text-[#54d292]" />
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <Reveal delay={1}>
          <div className="mt-20 p-6 rounded-xl border border-white/5 bg-[#050505] text-center max-w-3xl mx-auto">
            <p className="text-gray-500 text-sm">
              <span className="text-[#54d292] font-semibold">Transparency & Trust:</span> Creator fees are transparently tracked and used to strengthen the Flux ecosystem through buybacks and rewards.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default TokenomicsPage
