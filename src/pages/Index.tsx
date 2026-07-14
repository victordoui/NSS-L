import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Droplets,
  FileCheck2,
  Hammer,
  House,
  Route,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Seo from "@/components/Seo";
import crackWallHero from "@/assets/crack-wall-hero.jpg";
import engineeringHero from "@/assets/engineering-hero.jpg";
import laudosImage from "@/assets/services/laudos-tecnicos.jpg";
import estruturaImage from "@/assets/services/projeto-estrutura.jpg";
import reformasImage from "@/assets/services/obras-reformas.jpg";
import contencaoImage from "@/assets/services/obras-contencao.jpg";
import sondagemImage from "@/assets/services/sondagem-spt.jpg";
import construcaoImage from "@/assets/construcao-civil.jpg";
import "./Index.css";

const services = [
  {
    title: "Laudos e inspeções técnicas",
    description: "Diagnósticos claros para identificar causas, riscos e o melhor caminho de intervenção.",
    image: laudosImage,
    href: "/servicos/laudos-tecnicos",
  },
  {
    title: "Projetos estruturais",
    description: "Soluções seguras, viáveis e dimensionadas para o desempenho de cada edificação.",
    image: estruturaImage,
    href: "/servicos/projeto-estrutura",
  },
  {
    title: "Obras e recuperação",
    description: "Acompanhamento técnico para recuperar, reforçar e prolongar a vida útil da construção.",
    image: reformasImage,
    href: "/servicos/obras-reformas",
  },
];

const principles = [
  {
    number: "01",
    title: "Investigar",
    description: "Inspeções, ensaios e levantamentos que revelam a origem real do problema.",
  },
  {
    number: "02",
    title: "Diagnosticar",
    description: "Análise técnica fundamentada, documentação completa e comunicação acessível.",
  },
  {
    number: "03",
    title: "Solucionar",
    description: "Recomendações viáveis que equilibram segurança, durabilidade e investimento.",
  },
];

const diagnosticSignals = [
  {
    icon: TriangleAlert,
    title: "Fissuras, trincas ou deformações",
    description: "Sinais que surgiram recentemente, aumentaram ou aparecem em diferentes pontos da edificação.",
  },
  {
    icon: Droplets,
    title: "Infiltrações e umidade recorrente",
    description: "Manchas, bolor, eflorescências ou revestimentos que voltam a se deteriorar após reparos.",
  },
  {
    icon: Hammer,
    title: "Reforma, ampliação ou mudança de uso",
    description: "Intervenções que alteram cargas, ambientes ou elementos e precisam de orientação técnica prévia.",
  },
  {
    icon: House,
    title: "Compra, entrega ou conservação do imóvel",
    description: "Momentos em que uma leitura técnica ajuda a registrar condições e definir prioridades de cuidado.",
  },
];

const deliverables = [
  {
    icon: ClipboardCheck,
    number: "01",
    title: "Leitura técnica do cenário",
    description: "Inspeção e levantamento das evidências relevantes para compreender o caso.",
  },
  {
    icon: FileCheck2,
    number: "02",
    title: "Diagnóstico documentado",
    description: "Conclusões e registros compatíveis com o serviço e o escopo definidos na contratação.",
  },
  {
    icon: Route,
    number: "03",
    title: "Orientação para os próximos passos",
    description: "Prioridades e recomendações técnicas para apoiar uma decisão mais consciente.",
  },
];

const Index = () => {
  return (
    <div className="home-canvas">
      <Seo
        title="NSS Engenharia - Engenharia Diagnóstica"
        description="Inspeções, laudos, perícias e soluções para patologia das construções com diagnóstico preciso e segurança técnica."
      />
      <div className="home-shell">
        <Header />

        <main id="main-content" tabIndex={-1} className="home-editorial">
          <section className="editorial-hero" id="inicio">
            <img
              src={crackWallHero}
              alt="Fissura em parede analisada pela NSS Engenharia"
              className="editorial-hero__image"
              loading="eager"
              decoding="async"
            />
            <div className="editorial-hero__veil" />
            <div className="editorial-hero__content">
              <span className="editorial-kicker editorial-kicker--light">
                Engenharia diagnóstica · Patologia das construções
              </span>
              <h1>
                Diagnóstico preciso.
                <em> Estruturas mais seguras.</em>
              </h1>
              <p>
                Investigamos manifestações patológicas, identificamos suas causas e indicamos
                soluções técnicas para preservar o valor e a segurança da sua edificação.
              </p>
              <div className="editorial-actions">
                <Link to="/contato" className="editorial-button editorial-button--light">
                  Solicitar avaliação <ArrowRight size={16} />
                </Link>
                <Link to="/nss-engenharia" className="editorial-text-link editorial-text-link--light">
                  Conheça a NSS
                </Link>
              </div>
            </div>
            <a href="#apresentacao" className="editorial-scroll" aria-label="Ir para a próxima seção">
              <span>Descubra</span>
              <ChevronDown size={18} />
            </a>
          </section>

          <section className="editorial-intro" id="apresentacao">
            <div className="editorial-intro__lead">
              <span className="editorial-kicker">Engenharia que orienta decisões</span>
              <h2>
                Entenda o problema antes de <em>investir na solução.</em>
              </h2>
            </div>
            <div className="editorial-intro__copy">
              <p>
                Uma fissura, infiltração ou deformação pode ser apenas o sintoma. A NSS Engenharia
                combina conhecimento técnico, equipamentos modernos e uma leitura cuidadosa de cada
                contexto para entregar respostas confiáveis.
              </p>
              <div className="editorial-signals" aria-label="Áreas de atuação">
                <span>Inspeções</span>
                <span>Laudos</span>
                <span>Perícias</span>
                <span>Projetos</span>
              </div>
            </div>
          </section>

          <section className="editorial-diagnostics" aria-labelledby="diagnostics-title">
            <div className="editorial-diagnostics__heading">
              <span className="editorial-kicker">Quando procurar uma avaliação</span>
              <h2 id="diagnostics-title">
                Alguns sinais pedem uma <em>leitura técnica.</em>
              </h2>
              <p>
                Nem todo sinal indica o mesmo problema. Avaliar o contexto antes de executar um
                reparo ajuda a escolher uma intervenção coerente com a causa observada.
              </p>
            </div>
            <div className="editorial-diagnostics__grid">
              {diagnosticSignals.map(({ icon: Icon, title, description }) => (
                <article key={title}>
                  <span className="editorial-diagnostics__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <div className="editorial-diagnostics__action">
              <p>Você não precisa identificar o problema sozinho. Comece contando o que observou.</p>
              <Link to="/contato" className="editorial-button editorial-button--dark">
                Descrever meu caso <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          <section className="editorial-about">
            <div className="editorial-about__visual">
              <img src={engineeringHero} alt="Equipe técnica em obra de engenharia" loading="lazy" decoding="async" />
              <div className="editorial-about__stamp">
                <span>NSS</span>
                <small>Engenharia &amp; diagnóstico</small>
              </div>
            </div>
            <div className="editorial-about__content">
              <span className="editorial-kicker editorial-kicker--light">Nossa abordagem</span>
              <h2>
                Técnica, clareza e cuidado em <em>cada detalhe.</em>
              </h2>
              <p>
                Do primeiro contato à entrega do parecer, conduzimos cada etapa com transparência.
                Você entende o que está acontecendo, quais são os riscos e o que precisa ser feito.
              </p>
              <ul>
                <li><Check size={17} /> Diagnóstico fundamentado em normas e boas práticas</li>
                <li><Check size={17} /> Recomendações proporcionais à realidade da obra</li>
                <li><Check size={17} /> Comunicação direta e documentação completa</li>
              </ul>
              <Link to="/nss-engenharia" className="editorial-button editorial-button--ghost">
                Conheça nossa história <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          <section className="editorial-services" id="servicos">
            <div className="editorial-section-heading">
              <span className="editorial-kicker">Como podemos ajudar</span>
              <h2>
                Soluções para diagnosticar, projetar e <em>recuperar.</em>
              </h2>
              <p>
                Uma atuação integrada para reduzir incertezas e dar segurança às decisões técnicas.
              </p>
            </div>

            <div className="editorial-service-grid">
              {services.map((service, index) => (
                <article className="editorial-service-card" key={service.title}>
                  <Link to={service.href} className="editorial-service-card__image">
                    <img src={service.image} alt={service.title} loading="lazy" decoding="async" />
                    <span>0{index + 1}</span>
                  </Link>
                  <div className="editorial-service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Link to={service.href} className="editorial-text-link">
                      Saiba mais <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <Link to="/servicos" className="editorial-button editorial-button--dark">
              Ver todos os serviços <ArrowRight size={16} />
            </Link>
          </section>

          <section className="editorial-method">
            <div className="editorial-method__intro">
              <span className="editorial-kicker editorial-kicker--light">Nosso método</span>
              <h2>
                Da evidência à <em>decisão técnica.</em>
              </h2>
              <p>
                Cada recomendação nasce de um processo objetivo, documentado e pensado para a
                realidade da edificação.
              </p>
            </div>
            <div className="editorial-method__steps">
              {principles.map((principle) => (
                <article key={principle.number}>
                  <span>{principle.number}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="editorial-deliverables" aria-labelledby="deliverables-title">
            <div className="editorial-section-heading editorial-section-heading--compact">
              <span className="editorial-kicker">O que você recebe</span>
              <h2 id="deliverables-title">
                Informação técnica para <em>decidir com clareza.</em>
              </h2>
              <p>
                Cada atendimento é dimensionado conforme a necessidade identificada e o escopo
                contratado, com uma condução clara do início às recomendações finais.
              </p>
            </div>
            <div className="editorial-deliverables__grid">
              {deliverables.map(({ icon: Icon, number, title, description }) => (
                <article key={number}>
                  <div className="editorial-deliverables__meta">
                    <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                    <span>{number}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <Link to="/servicos" className="editorial-text-link editorial-deliverables__link">
              Conheça os serviços da NSS <ArrowRight size={14} />
            </Link>
          </section>

          <section className="editorial-portfolio">
            <div className="editorial-section-heading editorial-section-heading--compact">
              <span className="editorial-kicker">Atuação em campo</span>
              <h2>
                Engenharia aplicada a <em>desafios reais.</em>
              </h2>
            </div>
            <div className="editorial-portfolio__grid">
              <Link to="/obras-executadas" className="editorial-portfolio__item editorial-portfolio__item--tall">
                <img src={contencaoImage} alt="Obra de contenção" loading="lazy" decoding="async" />
                <span>Contenção e estabilidade</span>
              </Link>
              <Link to="/obras-executadas" className="editorial-portfolio__item">
                <img src={sondagemImage} alt="Equipamento de sondagem" loading="lazy" decoding="async" />
                <span>Ensaios e investigação</span>
              </Link>
              <Link to="/obras-executadas" className="editorial-portfolio__item">
                <img src={construcaoImage} alt="Estrutura em construção" loading="lazy" decoding="async" />
                <span>Estruturas e obras</span>
              </Link>
            </div>
          </section>

          <section className="editorial-manifesto">
            <span className="editorial-manifesto__mark">“</span>
            <blockquote>
              Segurança começa com um diagnóstico bem feito. Nosso trabalho é transformar sinais
              técnicos em um caminho claro para cuidar da sua edificação.
            </blockquote>
            <p>NSS Engenharia · Precisão para decidir</p>
          </section>

          <section className="editorial-cta">
            <div className="editorial-cta__card">
              <span className="editorial-kicker">Vamos analisar o seu caso?</span>
              <h2>
                Dê o próximo passo com <em>segurança.</em>
              </h2>
              <p>
                Conte o que está acontecendo. Nossa equipe avalia a necessidade e orienta o melhor
                caminho para começar.
              </p>
              <Link to="/contato" className="editorial-button editorial-button--dark">
                Falar com um especialista <ArrowRight size={16} />
              </Link>
              <small className="editorial-cta__note">
                Não sabe qual serviço solicitar? Descreva os sinais observados e o contexto do imóvel.
              </small>
            </div>
          </section>
        </main>

        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default Index;
