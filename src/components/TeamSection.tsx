import { useState } from "react";
import josephImage from "@/assets/joseph.jpg";
import tobiasImage from "@/assets/tobias.jpg";
import ahmadImage from "@/assets/ahmad.jpg";
import bcgLogo from "@/assets/bcg-logo.png";
import bainLogo from "@/assets/bain-logo.webp";
import microsoftLogo from "@/assets/microsoft-logo.png";
import githubLogo from "@/assets/github-logo.png";
interface LogoImageProps {
  src: string;
  alt: string;
}
const LogoImage = ({
  src,
  alt
}: LogoImageProps) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return <span className="text-[8px] font-medium text-foreground/70">
        {alt.substring(0, 3)}
      </span>;
  }
  return <img src={src} alt={alt} className="h-full w-auto max-w-[190px] object-contain" onError={() => setHasError(true)} />;
};
const EricssonLogo = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 213.843 45.402" className="h-full w-auto max-w-[190px]" role="img" aria-label="Ericsson" preserveAspectRatio="xMidYMid meet">
    <title>Ericsson</title>
    <path fill="currentColor" d="M211.2 21.88c1.636-.813 2.713-2.416 2.64-4.32.073-2.537-2.024-4.634-4.56-4.56-.724-.074-1.364.068-1.92.24l-25.44 10.08c-1.696.81-2.876 2.475-2.88 4.32.004 2.682 2.102 4.78 4.8 4.8a4.763 4.763 0 0 0 1.92-.48l25.44-10.08zM0 15.16v22.8h16.8v-5.28H6.72v-3.6h9.6V23.8h-9.6v-3.36H16.8v-5.28zM43.44 15.16h6.48v22.8h-6.48zM37.2 26.44c1.455-1.233 2.347-2.974 2.4-5.04-.053-3.337-2.853-6.137-6.24-6.24H21.12v22.8h6.72V20.44h3.36c1.166-.072 2.086.817 2.16 1.92a2.304 2.304 0 0 1-2.16 2.16h-3.36v5.04h3.36l3.12 8.4h6.48l-3.6-9.84c-.063-.197-.156-.322-.24-.48-.291-.217-.49-.793.24-1.2zM135.12 15.16v22.8h6.72V25.72l7.2 12.24h7.2v-22.8h-6.48v12l-6.96-12zM121.68 19.48c2.588.111 4.646 3.198 4.56 6.96.086 3.853-1.972 6.939-4.56 6.96-2.489-.021-4.546-3.107-4.56-6.96.014-3.762 2.071-6.849 4.56-6.96v-5.04c-6.101.025-11.087 5.406-11.04 12-.047 6.684 4.939 12.066 11.04 12 6.2.066 11.187-5.316 11.28-12-.093-6.594-5.08-11.975-11.28-12v5.04zM52.32 26.2c.036 10.66 9.911 12.16 11.76 12.24 1.651-.08 4.276-.205 7.68-1.2v-5.28c-6.154 2.65-12.529 1.15-12.48-5.76-.049-6.84 6.701-8.84 12-5.04v-5.52c-2.924-1.405-5.674-1.155-7.44-1.2-1.734.045-11.484 1.17-11.52 11.76zM89.28 20.44v-4.56c-2.018-.957-5.175-1.02-6.96-.96-1.965-.06-6.839.69-7.92 4.32-.919 3.62.206 7.495 4.08 8.64 3.875 1.355 6.375 2.105 5.52 4.32-.645 2.035-5.77 1.41-8.88.24l-.72 4.8c4.08.995 8.205 1.245 11.28.48 3.175-.985 4.925-3.485 5.28-6 .395-2.735-.48-5.61-3.36-6.72-3.12-1.14-3.87-1.14-6-2.16-2.119-.98-1.369-3.605 1.92-3.6 1.835-.13 4.085.495 5.76 1.2zM211.2 8.92c1.636-.853 2.713-2.455 2.64-4.32.073-2.577-2.024-4.674-4.56-4.56-.724-.114-1.364.028-1.92.24l-25.44 10.08c-1.696.77-2.876 2.435-2.88 4.32.004 2.642 2.102 4.74 4.8 4.8a6.579 6.579 0 0 0 1.92-.48L211.2 8.92zM108 20.44v-4.56c-2.114-.957-5.27-1.02-7.2-.96-1.82-.06-6.695.69-7.68 4.32-1.015 3.62.11 7.495 4.08 8.64 3.78 1.355 6.28 2.105 5.52 4.32-.74 2.035-5.865 1.41-8.88.24l-.72 4.8c3.985.995 8.11 1.245 11.28.48 3.08-.985 4.83-3.485 5.28-6 .3-2.735-.575-5.61-3.6-6.72-2.975-1.14-3.725-1.14-5.76-2.16-2.215-.98-1.465-3.605 1.92-3.6 1.74-.13 3.99.495 5.76 1.2zM211.2 34.84c1.636-.773 2.713-2.376 2.64-4.32.073-2.497-2.024-4.594-4.56-4.56-.724-.034-1.364.107-1.92.48l-25.44 10.08c-1.696.61-2.876 2.274-2.88 4.32.004 2.482 2.102 4.579 4.8 4.56.662.019 1.392-.168 1.92-.48l25.44-10.08z" />
  </svg>;
const TeamSection = () => {
  const teamMembers = [{
    name: "Joseph Boutros",
    role: "Founder & CEO",
    description: "Shaping our pathway towards AI native strategy consulting. Brings deep top-tier market experience and thought leader of our agentic AI patent.",
    image: josephImage,
    linkedIn: "https://www.linkedin.com/in/josephboutros/",
    previousWorkLogos: [{
      name: "BCG",
      logo: bcgLogo
    }, {
      name: "Bain",
      logo: bainLogo
    }]
  }, {
    name: "Tobias Tschuemperlin",
    role: "Co-founder & CTO",
    description: "Architecturing our AI structure with a focus on scalability, cost effectiveness, and government compliance.",
    image: tobiasImage,
    linkedIn: "https://www.linkedin.com/in/tobias-tsch%C3%BCmperlin-692b04a4/",
    previousWorkLogos: [{
      name: "Microsoft",
      logo: microsoftLogo
    }, {
      name: "GitHub",
      logo: githubLogo
    }]
  }, {
    name: "Ahmad Masri",
    role: "Sr. Data Engineer",
    description: "Building our patented agentic AI approach with a strong focus on data security and data residency.",
    image: ahmadImage,
    linkedIn: "https://www.linkedin.com/in/ahmad-masri-12b7ba8/",
    previousWorkLogos: [{
      name: "Ericsson",
      logo: ""
    }]
  }];
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent pb-2">
              Who We Are
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              A focused group of strategists, technologists and data experts united by a vision for AI native strategy consulting
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member, index) => <a key={index} href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="group relative block cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-teal/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 group-hover:border-accent/30 transition-all duration-500 h-full overflow-hidden">
                  <div className="p-6">
                    {/* Profile Image */}
                    {member.image && <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 border-2 border-accent/30">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>}
                    {/* Name & Role */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {member.name}
                      </h3>
                      <span className="text-sm font-medium text-accent">{member.role}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.description}
                    </p>
                    
                    {/* Previous Work Logos */}
                    <div>
                      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">Previously at</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {member.previousWorkLogos.map((work, i) => <div key={i} className="h-10 min-w-[88px] rounded-md bg-logo-surface px-3 py-1.5 flex items-center justify-center shadow-sm border border-border/30 text-foreground" title={work.name}>
                            {work.name === "Ericsson" ? <EricssonLogo /> : <LogoImage src={work.logo} alt={work.name} />}
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </a>)}
          </div>
        </div>
      </div>
    </section>;
};
export default TeamSection;