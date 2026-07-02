/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ClipboardCheck, Menu, Ruler, ShieldCheck, Users, Wrench, X, Zap } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import { Artist } from './types';

const SERVICES: Artist[] = [
  {
    id: '1',
    name: 'Laudo de Inspeção Predial',
    genre: 'Diagnóstico técnico',
    day: 'LAUDOS',
    image: 'https://yznrtdzxtbbmfsqlkwds.supabase.co/storage/v1/object/public/service-images/services/service-1763658373246.jpg',
    description: 'Laudos completos com análise técnica do imóvel, identificação de anomalias, avaliação de riscos e recomendações para preservação da edificação.'
  },
  {
    id: '2',
    name: 'Projeto de Estrutura',
    genre: 'Concreto, aço e madeira',
    day: 'PROJETOS',
    image: 'https://yznrtdzxtbbmfsqlkwds.supabase.co/storage/v1/object/public/service-images/services/service-1763658935951.jpg',
    description: 'Projetos estruturais completos em concreto, aço e madeira, desenvolvidos com foco em segurança, desempenho, viabilidade e durabilidade.'
  },
  {
    id: '3',
    name: 'Projeto de Drenagem',
    genre: 'Águas pluviais',
    day: 'PROJETOS',
    image: 'https://nssnovo.netlify.app/assets/services/projeto-drenagem.jpg',
    description: 'Sistemas de drenagem urbana e controle de águas pluviais para reduzir riscos, organizar fluxos e melhorar o desempenho das áreas atendidas.'
  },
  {
    id: '4',
    name: 'Projetos de Terraplanagem',
    genre: 'Cortes e aterros',
    day: 'OBRAS',
    image: 'https://nssnovo.netlify.app/assets/services/projetos-terraplanagem.jpg',
    description: 'Planejamento técnico de movimentação de terra, cortes e aterros especializados para preparar terrenos com precisão e segurança.'
  },
  {
    id: '5',
    name: 'Projetos de Acessibilidade',
    genre: 'Acesso universal',
    day: 'PROJETOS',
    image: 'https://nssnovo.netlify.app/assets/services/projetos-acessibilidade.jpg',
    description: 'Projetos de acessibilidade universal para edificações, com soluções que promovem inclusão, funcionalidade e conformidade técnica.'
  },
  {
    id: '6',
    name: 'Obras de Contenção',
    genre: 'Estabilização',
    day: 'OBRAS',
    image: 'https://nssnovo.netlify.app/assets/services/obras-contencao.jpg',
    description: 'Muros de arrimo, cortinas e estabilização de encostas com recomendações técnicas voltadas à segurança e à durabilidade.'
  },
  {
    id: '7',
    name: 'Obras de Reformas',
    genre: 'Adequações',
    day: 'OBRAS',
    image: 'https://nssnovo.netlify.app/assets/services/obras-reformas.jpg',
    description: 'Reformas e adequações de edificações existentes, conduzidas com planejamento, responsabilidade técnica e controle de qualidade.'
  },
  {
    id: '8',
    name: 'Sondagem SPT',
    genre: 'Investigação geotécnica',
    day: 'ENSAIOS',
    image: 'https://nssnovo.netlify.app/assets/services/sondagem-spt.jpg',
    description: 'Investigação geotécnica por sondagem SPT para compreensão das características do solo e apoio às decisões de projeto.'
  },
  {
    id: '9',
    name: 'Sondagem Rotativa',
    genre: 'Solos e rochas',
    day: 'ENSAIOS',
    image: 'https://nssnovo.netlify.app/assets/services/sondagem-rotativa.jpg',
    description: 'Sondagem rotativa para análise detalhada de solos e rochas, indicada para avaliações técnicas que exigem maior profundidade de investigação.'
  },
  {
    id: '10',
    name: 'Laudos Técnicos',
    genre: 'Avaliações estruturais',
    day: 'LAUDOS',
    image: 'https://nssnovo.netlify.app/assets/services/laudos-tecnicos.jpg',
    description: 'Laudos técnicos especializados e avaliações estruturais com documentação clara, fundamentação normativa e recomendações objetivas.'
  },
];

const DIRECTIVES = [
  { icon: ClipboardCheck, title: 'Rigor no Diagnóstico', desc: 'Análises técnicas detalhadas e fundamentadas para identificar com precisão as causas das patologias e orientar cada caso com segurança.' },
  { icon: Wrench, title: 'Soluções Técnicas com Viabilidade', desc: 'Propostas de intervenção que unem eficiência, economia e segurança, buscando a melhor relação entre custo, desempenho e durabilidade.' },
  { icon: Ruler, title: 'Qualidade em Todo o Processo', desc: 'Excelência em inspeções, ensaios, laudos e perícias, mantendo padrão elevado da primeira avaliação até a entrega final.' },
  { icon: ShieldCheck, title: 'Segurança e Responsabilidade', desc: 'Atuação comprometida com a integridade das edificações, baseada em normas, boas práticas e responsabilidade profissional.' },
  { icon: Zap, title: 'Equipe Especializada e Equipamentos Modernos', desc: 'Profissionais qualificados e tecnologia atualizada para ensaios não destrutivos, medições e levantamentos completos.' },
  { icon: Users, title: 'Transparência e Relacionamento', desc: 'Comunicação clara, documentação completa e relacionamento baseado em confiança em cada etapa do diagnóstico e da solução.' },
];

const ARTICLES = [
  {
    title: 'Geotecnia: A Engenharia que Sustenta o Futuro',
    category: 'Geotecnia',
    image: 'https://yznrtdzxtbbmfsqlkwds.supabase.co/storage/v1/object/public/service-images/articles/d7wqjjv44r-1759351043293.webp',
    description: 'A geotecnia estuda o comportamento dos solos e rochas, aplicando esse conhecimento para projetar e construir obras seguras, econômicas e sustentáveis.'
  },
  {
    title: 'Engenharia Civil: Construindo o Futuro das Cidades',
    category: 'Engenharia Civil',
    image: 'https://yznrtdzxtbbmfsqlkwds.supabase.co/storage/v1/object/public/service-images/articles/6tx4np7y972-1759351213626.png',
    description: 'A engenharia civil planeja, projeta, executa e mantém construções e infraestruturas que dão forma à vida urbana e ao desenvolvimento da sociedade.'
  },
];

const MENU_ITEMS = [
  { label: 'Serviços', id: 'services' },
  { label: 'Diretrizes', id: 'directives' },
  { label: 'Informativo', id: 'articles' },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Artist | null>(null);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;

    const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  const navigateService = (direction: 'next' | 'prev') => {
    if (!selectedService) return;

    const currentIndex = SERVICES.findIndex((service) => service.id === selectedService.id);
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % SERVICES.length
      : (currentIndex - 1 + SERVICES.length) % SERVICES.length;
    setSelectedService(SERVICES[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedService) return;
      if (e.key === 'ArrowLeft') navigateService('prev');
      if (e.key === 'ArrowRight') navigateService('next');
      if (e.key === 'Escape') setSelectedService(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService]);

  return (
    <div className="relative min-h-screen text-white selection:bg-[#c8a2ff] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />

      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">NSS</div>

        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-[#c8a2ff] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollToSection('services')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Conheça os Serviços
        </button>

        <button
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#2d1b4e]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-4xl font-heading font-bold text-white hover:text-[#c8a2ff] transition-colors uppercase bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative h-[100svh] min-h-[720px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div style={{ y, opacity }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-[#c8a2ff] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>NSS Engenharia</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#a78bfa] rounded-full animate-pulse" />
            <span>Diagnóstico técnico</span>
          </motion.div>

          <div className="relative w-full flex justify-center items-center">
            <GradientText text="NSS" as="h1" className="text-[18vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center" />
            <motion.div
              className="absolute -z-20 w-[50vw] h-[50vw] bg-white/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ transform: 'translateZ(0)' }}
            />
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'circOut' }}
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-4xl mx-auto text-white/90 drop-shadow-lg px-4"
          >
            <h2 className="text-xl md:text-4xl font-heading font-bold uppercase leading-tight mb-6">
              Engenharia Diagnóstica e Patologia das Construções
            </h2>
            <p className="text-sm md:text-lg font-light leading-relaxed">
              Com mais de dois anos de experiência, a NSS Engenharia é referência em Patologia das Construções, oferecendo inspeções, laudos, perícias, identificação de causas, avaliação de riscos e propostas de intervenção com métodos confiáveis e atualizados.
            </p>
            <p className="text-sm md:text-lg font-light leading-relaxed mt-4 hidden md:block">
              Nossa equipe especializada utiliza equipamentos modernos para medições e ensaios com precisão, entregando diagnósticos claros, atendimento ágil e recomendações técnicas que garantem segurança, economia e tranquilidade.
            </p>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <motion.div className="flex w-fit will-change-transform" animate={{ x: '-50%' }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    NSS ENGENHARIA <span className="text-black text-2xl md:text-4xl">●</span>
                    PATOLOGIA DAS CONSTRUÇÕES <span className="text-black text-2xl md:text-4xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      <section id="services" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4 gap-6">
            <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg break-words w-full md:w-auto">
              Serviços <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a2ff] to-[#8b5cf6]">Técnicos</span>
            </h2>
            <p className="text-gray-200 max-w-xl text-base md:text-lg leading-relaxed">
              Soluções completas em engenharia com foco em qualidade, eficiência e responsabilidade técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {SERVICES.map((service) => (
              <ArtistCard key={service.id} artist={service} onClick={() => setSelectedService(service)} />
            ))}
          </div>
        </div>
      </section>

      <section id="directives" className="relative z-10 py-20 md:py-32 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#a78bfa]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Diretrizes <br /> <GradientText text="TÉCNICAS" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-md">
                Parâmetros que garantem clareza, precisão técnica e segurança em cada diagnóstico e solução.
              </p>

              <div className="space-y-6 md:space-y-8">
                {DIRECTIVES.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#c8a2ff] rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src="https://yznrtdzxtbbmfsqlkwds.supabase.co/storage/v1/object/public/service-images/services/service-1763658373246.jpg"
                  alt="Inspeção técnica em edificação"
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    06
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    Diretrizes de atuação
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="articles" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white">
              INFORMATIVO
            </h2>
            <p className="text-[#c8a2ff] font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
              Dicas práticas e publicações técnicas sobre engenharia geotécnica e civil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.map((article, index) => (
              <motion.article
                key={article.title}
                whileHover={{ y: -20 }}
                className="relative border border-white/10 backdrop-blur-md min-h-[520px] overflow-hidden bg-white/5 will-change-transform group"
                data-hover="true"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 h-full min-h-[520px] p-8 md:p-10 flex flex-col justify-end">
                  <span className="w-fit text-xs font-mono border border-white/30 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest text-[#c8a2ff] mb-6">
                    {article.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-heading font-bold mb-6 text-white uppercase leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                    {article.description}
                  </p>
                  <div className="mt-8 text-xs font-mono uppercase tracking-[0.3em] text-white/50">
                    Publicação 0{index + 1}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">NSS ENGENHARIA</div>
            <div className="flex gap-2 text-xs font-mono text-gray-400">
              <span>Engenharia Diagnóstica e Patologia das Construções</span>
            </div>
          </div>

          <div className="flex gap-6 md:gap-8 flex-wrap">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer bg-transparent border-none"
                data-hover="true"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#211336] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#a78bfa]/10 group/modal"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateService('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm"
                data-hover="true"
                aria-label="Serviço anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateService('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8"
                data-hover="true"
                aria-label="Próximo serviço"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedService.id}
                    src={selectedService.image}
                    alt={selectedService.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#a78bfa] mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="font-mono text-sm tracking-widest uppercase">{selectedService.day}</span>
                  </div>

                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-2 text-white">
                    {selectedService.name}
                  </h3>

                  <p className="text-lg text-[#c8a2ff] font-medium tracking-widest uppercase mb-6">
                    {selectedService.genre}
                  </p>

                  <div className="h-px w-20 bg-white/20 mb-6" />

                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">
                    {selectedService.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
