import HeroLaneLayer from '../components/HeroLaneLayer'
import WhatIsLaneLayer from '../components/WhatIsLaneLayer'
import HowItWorksTeaser from '../components/HowItWorksTeaser'
import UseWhenYouNeedThis from '../components/UseWhenYouNeedThis'
import FAQ from '../components/FAQ'
import BuilderCTA from '../components/BuilderCTA'

export default function Home() {
  return (
    <>
      <HeroLaneLayer />
      <WhatIsLaneLayer />
      <HowItWorksTeaser />
      <UseWhenYouNeedThis />
      <FAQ />
      <BuilderCTA />
    </>
  )
}
