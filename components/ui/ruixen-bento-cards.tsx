"use client"

import type React from "react"
import { cn } from "@/lib/utils"

const cardContents = [
  {
    title: "O que é BleYA?",
    description:
      "BleYA é uma assistente de IA criada para democratizar a programação. Nasceu como um projeto inicial para ajudar pessoas a aprenderem e desenvolverem código de forma intuitiva, transformando ideias em realidade através da inteligência artificial.",
  },
  {
    title: "Como ela age",
    description:
      "BleYA compreende suas necessidades em linguagem natural, sugere soluções de código, explica conceitos complexos de forma simples e aprende com cada interação para oferecer respostas cada vez mais personalizadas.",
  },
  {
    title: "Missão e Propósito",
    description:
      "Criada com o objetivo de tornar a programação acessível a todos, BleYA elimina barreiras técnicas e acelera o aprendizado. Seja você iniciante ou experiente, BleYA está aqui para auxiliar sua jornada de desenvolvimento, oferecendo suporte inteligente, exemplos práticos e orientação personalizada em cada etapa do seu projeto.",
  },
  {
    title: "Aprendizado Contínuo",
    description:
      "BleYA evolui constantemente, incorporando novas tecnologias e melhores práticas de programação para oferecer sempre as soluções mais atualizadas e eficientes.",
  },
  {
    title: "Suporte Multilinguagem",
    description:
      "Trabalha com diversas linguagens de programação e frameworks, adaptando-se às necessidades específicas de cada projeto e desenvolvedor.",
  },
]

const PlusCard: React.FC<{
  className?: string
  title: string
  description: string
}> = ({ className = "", title, description }) => {
  return (
    <div
      className={cn(
        // Fundo Branco, Bordas cinzas claras - Sem classes 'dark:'
        "relative border border-dashed border-zinc-400 rounded-lg p-6 bg-white min-h-[200px]",
        "flex flex-col justify-between",
        className,
      )}
    >
      <CornerPlusIcons />
      {/* Content */}
      <div className="relative z-10 space-y-2">
        {/* Título: Sempre Preto (gray-900) */}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {/* Descrição: Sempre Cinza Escuro (gray-700) */}
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  )
}

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-3 -left-3" />
    <PlusIcon className="absolute -top-3 -right-3" />
    <PlusIcon className="absolute -bottom-3 -left-3" />
    <PlusIcon className="absolute -bottom-3 -right-3" />
  </>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    strokeWidth="1"
    stroke="currentColor"
    // Ícone: Sempre Preto (text-black)
    className={`text-black size-6 ${className}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

export default function RuixenBentoCards() {
  return (
    // Fundo da seção: Branco, Borda Cinza Claro (gray-200) - Sem classes 'dark:'
    <section className="bg-white border border-gray-200">
      {/* Container: Garante a área central com a borda externa */}
      <div className="mx-auto container border border-gray-200 py-12 border-t-0 px-4">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4">
          <PlusCard {...cardContents[0]} className="lg:col-span-3 lg:row-span-2" />
          <PlusCard {...cardContents[1]} className="lg:col-span-2 lg:row-span-2" />
          <PlusCard {...cardContents[2]} className="lg:col-span-4 lg:row-span-1" />
          <PlusCard {...cardContents[3]} className="lg:col-span-2 lg:row-span-1" />
          <PlusCard {...cardContents[4]} className="lg:col-span-2 lg:row-span-1" />
        </div>

        {/* Call to Action Text */}
        <div className="max-w-2xl ml-auto text-right px-4 mt-6 lg:-mt-20">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
            Programar nunca foi tão acessível.
          </h2>
          <p className="text-gray-600 text-lg">
            BleYA transforma a complexidade da programação em simplicidade, oferecendo suporte inteligente para que você
            possa focar no que realmente importa: criar soluções incríveis.
          </p>
        </div>
      </div>
    </section>
  )
}
