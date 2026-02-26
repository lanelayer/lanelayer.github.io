import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroLaneLayer from '../components/HeroLaneLayer'
import BuildFirstLane from './BuildFirstLane'
import WhatIsLaneLayer from '../components/WhatIsLaneLayer'
import HowItWorksTeaser from '../components/HowItWorksTeaser'
import UseWhenYouNeedThis from '../components/UseWhenYouNeedThis'
import FAQ from '../components/FAQ'
import BuilderCTA from '../components/BuilderCTA'

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash === '#build-first-lane') {
      // Small delay so the section is in the DOM when navigating from another page
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById('build-first-lane')
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
      return () => cancelAnimationFrame(t)
    }
  }, [hash])

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
