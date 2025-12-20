import { FileSearch, Presentation, Table } from "lucide-react";

// Custom Chess Knight SVG component
const ChessKnight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 482.011 482.011" 
    fill="currentColor"
    className={className}
  >
    <path d="M367.549,434.234h-6.409c-1.072-5.303-2.053-11.634-2.922-18.399H93.277c-0.529,5.964-0.964,12.061-1.228,18.399h-0.436 c-13.188,0-23.889,10.693-23.889,23.889s10.701,23.889,23.889,23.889h275.936c13.188,0,23.889-10.693,23.889-23.889 S380.737,434.234,367.549,434.234z" />
    <path d="M111.396,202.132c1.85,2.621,4.682,4.402,7.855,4.947c3.157,0.545,6.423-0.194,9.051-2.053l43.361-30.702 c5.35-3.794,12.644-3.313,17.466,1.159c11.804,10.933,28.43,14.993,43.936,10.739c11.929-3.266,21.82-11.143,27.885-21.586 c2.271,17.504-6.283,44.589-58.633,78.673c-48.479,31.564-78.961,64.365-95.4,108.822h251.036 c2.892-25.515,9.626-53.796,23.625-83.285c29.254-47.576,62.116-134.095-14.698-214.269 C302.771-12.331,245.741-4.344,213.763,9.358c-15.552,6.655-22.94,24.3-17.092,40.023l-35.865-33.22 c-2.005-1.858-5.007-2.169-7.371-0.763c-2.349,1.416-3.485,4.216-2.784,6.867l11.835,44.978c-4.324,3.569-8.29,7.574-11.37,12.395 l-55.569,87.026c-2.644,4.16-2.52,9.503,0.326,13.531L111.396,202.132z" />
    <path d="M87.18,399.908h280.368c8.802,0,15.926-7.132,15.926-15.926c0-8.794-7.124-15.926-15.926-15.926H87.18 c-8.802,0-15.926,7.132-15.926,15.926C71.255,392.777,78.378,399.908,87.18,399.908z" />
  </svg>
);

const services = [
  {
    icon: ChessKnight,
    title: "Develop national strategies",
    description: "Draft national strategies in the public sector (including framework identification, benchmark research, initiative development, KPI selection and governance recommendations) along with suggested storyline and slide titles",
    badge: "Beta version",
    isActive: true
  },
  {
    icon: FileSearch,
    title: "Review national strategies",
    description: "Stress test national strategies in the public sector, identify areas of improvements and develop both recommendations and content to bridge identified gaps",
    badge: "Under construction",
    isActive: false
  },
  {
    icon: Presentation,
    title: "Create PowerPoint presentations",
    description: "Develop tailored PowerPoint presentations at strategy consulting level that are simple to use, follow specific templates, and easily editable",
    badge: "Under construction",
    isActive: false
  },
  {
    icon: Table,
    title: "Build Excel models",
    description: "Develop specific models to support calculations in national strategies",
    badge: "Under construction",
    isActive: false
  }
];

const WhatWeDo = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden z-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              AI native strategy consulting services across the public sector
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`group relative p-6 md:p-8 rounded-lg bg-card border border-border shadow-card transition-all duration-500 animate-fade-in overflow-hidden ${
                    service.isActive 
                      ? 'hover:shadow-elevated hover:-translate-y-3 hover:scale-105 cursor-pointer' 
                      : 'opacity-60 grayscale-[30%]'
                  }`}
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? 'bg-teal/20 text-teal' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {service.badge}
                  </div>

                  {/* Animated background gradient */}
                  {service.isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* Icon with background - centered and bigger */}
                  <div className="flex justify-center mb-6">
                    <div className={`relative w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      service.isActive 
                        ? 'bg-accent/15 group-hover:bg-accent/25' 
                        : 'bg-muted/50'
                    }`}>
                      <Icon 
                        className={`w-10 h-10 transition-transform duration-300 ${
                          service.isActive 
                            ? 'text-accent group-hover:scale-110' 
                            : 'text-muted-foreground'
                        }`} 
                        strokeWidth={1.5} 
                      />
                      {service.isActive && (
                        <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className={`text-xl font-semibold mb-3 leading-tight transition-colors duration-300 ${
                      service.isActive 
                        ? 'text-foreground group-hover:text-accent' 
                        : 'text-muted-foreground'
                    }`}>
                      {service.title}
                    </h3>
                    <p className={`leading-relaxed text-sm ${
                      service.isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {service.description}
                    </p>
                  </div>

                  {/* Animated accent border - only for active */}
                  {service.isActive && (
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-accent group-hover:w-full transition-all duration-500 rounded-b-lg" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;