import unigLogo from "@/assets/partners/unig-logo.webp";
import uniabeuLogo from "@/assets/partners/uniabeu-logo.jpg";
import petrobrasLogo from "@/assets/partners/petrobras-logo.png";
import casashoppingLogo from "@/assets/partners/casashopping-logo.jpg";
import geoinfraLogo from "@/assets/partners/geoinfra-logo.png";
import guapimirimLogo from "@/assets/partners/guapimirim-logo.png";
import onuHabitatLogo from "@/assets/partners/onu-habitat-logo.png";
import dudaPortoLogo from "@/assets/partners/duda-porto-logo-new.png";
import wavetechLogo from "@/assets/partners/wavetech-logo.jpg";

const PartnersSection = () => {
  const partners = [
    { name: "UNIG - Universidade Iguaçu", logo: unigLogo },
    { name: "Uniabeu", logo: uniabeuLogo },
    { name: "Petrobras", logo: petrobrasLogo },
    { name: "Casa Shopping", logo: casashoppingLogo },
    { name: "GEOINFRA", logo: geoinfraLogo },
    { name: "Prefeitura de Guapimirim", logo: guapimirimLogo },
    { name: "ONU Habitat", logo: onuHabitatLogo },
    { name: "Duda Porto", logo: dudaPortoLogo },
    { name: "Wave Tech", logo: wavetechLogo },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl">
        <div className="text-center mb-12">
          <h2 
            className="section-title mb-6 font-heading font-normal text-primary"
            style={{letterSpacing: '0.05em'}}
          >
            EMPRESAS QUE CONFIARAM EM NÓS
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto font-heading font-normal"
            style={{letterSpacing: '0.05em'}}
          >
            Orgulhamo-nos de trabalhar com empresas e instituições renomadas, 
            entregando soluções de engenharia de excelência.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-24"
            >
              <img 
                src={partner.logo} 
                alt={`Logo ${partner.name}`}
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;