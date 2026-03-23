import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroLaneLayer from '../components/HeroLaneLayer'
import BuildFirstLane from './BuildFirstLane'
import WhatIsLaneLayer from '../components/WhatIsLaneLayer'
import HowItWorksTeaser from '../components/HowItWorksTeaser'
import UseWhenYouNeedThis from '../components/UseWhenYouNeedThis'
import FAQ from '../components/FAQ'
import BuilderCTA from '../components/BuilderCTA'

export default function Home({ scrollTo }) {
  const { pathname } = useLocation()
  const shouldScroll = scrollTo === 'build-first-lane' || pathname === '/build-first-lane'
  useEffect(() => {
    if (shouldScroll) {
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById('build-first-lane')
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
      return () => cancelAnimationFrame(t)
    }
  }, [shouldScroll])

  return (
    <>
      <HeroLaneLayer />
      <BuildFirstLane />
      <WhatIsLaneLayer />
      <HowItWorksTeaser />
      <UseWhenYouNeedThis />
      <FAQ />
      <BuilderCTA />
    </>
  )
}
