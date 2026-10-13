import { About } from "@/components/sections/about"
import { Clients } from "@/components/sections/clients"
import { Contact } from "@/components/sections/contact"
import { Hero } from "@/components/sections/hero"
import { Method } from "@/components/sections/method"
import { Model } from "@/components/sections/model"
import { Services } from "@/components/sections/services"
import { Values } from "@/components/sections/values"
import { VisionMission } from "@/components/sections/vision-mission"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Method />
      <VisionMission />
      <Values />
      <Model />
      <Clients />
      <Contact />
    </>
  )
}
