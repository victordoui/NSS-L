import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
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

const Index = () => {
  return (
    <div className="home-canvas">
      <div className="home-shell">
        <Header />

        <main className="home-editorial">
          <section className="editorial-hero" id="inicio">
            <img
              src={crackWallHero}
              alt="Fissura em parede analisada pela NSS Engenharia"
              className="editorial-hero__image"
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

          <section className="editorial-about">
            <div className="editorial-about__visual">
              <img src={engineeringHero} alt="Equipe técnica em obra de engenharia" />
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
                    <img src={service.image} alt={service.title} />
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

          <section className="editorial-portfolio">
            <div className="editorial-section-heading editorial-section-heading--compact">
              <span className="editorial-kicker">Atuação em campo</span>
              <h2>
                Engenharia aplicada a <em>desafios reais.</em>
              </h2>
            </div>
            <div className="editorial-portfolio__grid">
              <Link to="/obras-executadas" className="editorial-portfolio__item editorial-portfolio__item--tall">
                <img src={contencaoImage} alt="Obra de contenção" />
                <span>Contenção e estabilidade</span>
              </Link>
              <Link to="/obras-executadas" className="editorial-portfolio__item">
                <img src={sondagemImage} alt="Equipamento de sondagem" />
                <span>Ensaios e investigação</span>
              </Link>
              <Link to="/obras-executadas" className="editorial-portfolio__item">
                <img src={construcaoImage} alt="Estrutura em construção" />
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
