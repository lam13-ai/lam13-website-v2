import { FileSearch } from "lucide-react";

// Custom Excel SVG component
const ExcelIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>file_type_excel2</title>
    <path
      d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <rect x="22.487" y="7.439" width="4.323" height="2.2" fill="currentColor" />
    <rect x="22.487" y="10.94" width="4.323" height="2.2" fill="currentColor" />
    <rect x="22.487" y="14.441" width="4.323" height="2.2" fill="currentColor" />
    <rect x="22.487" y="17.942" width="4.323" height="2.2" fill="currentColor" />
    <rect x="22.487" y="21.443" width="4.323" height="2.2" fill="currentColor" />
    <polygon
      points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673"
      fill="hsl(0 0% 100%)"
      fillRule="evenodd"
    />
  </svg>
);

// Custom PowerPoint SVG component
const PowerPointIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    className={className}
  >
    <path d="M18.536,2.321V5.184c3.4.019,7.357-.035,10.754.016.642,0,.67.568.678,1.064.054,5.942-.013,12.055.032,18-.012.234-.006,1.1-.013,1.346-.022.823-.434.859-1.257.884-.132,0-.52.006-.648.012-3.181-.016-6.362-.009-9.546-.009v3.182L2,27.134Q2,16,2,4.873L18.536,2.322" style={{fill: 'currentColor'}} />
    <path d="M18.536,6.138h10.5v19.4h-10.5V23H26.17V21.725H18.536V20.135H26.17V18.863H18.539c0-.624,0-1.247-.006-1.87a4.467,4.467,0,0,0,3.82-.375,4.352,4.352,0,0,0,1.959-3.474c-1.4-.01-2.793-.006-4.186-.006,0-1.384.016-2.767-.029-4.148-.522.1-1.043.21-1.562.321V6.139" style={{fill: '#fff'}} />
    <path d="M20.766,8.324a4.476,4.476,0,0,1,4.186,4.167c-1.4.016-2.793.01-4.189.01,0-1.393,0-2.787,0-4.177" style={{fill: 'currentColor'}} />
    <path d="M7.1,10.726c1.727.083,3.82-.684,5.252.611,1.371,1.664,1.008,4.724-1.024,5.719A4.7,4.7,0,0,1,9,17.348c0,1.244-.006,2.488,0,3.731-.63-.054-1.263-.108-1.893-.159-.029-3.4-.035-6.8,0-10.2" style={{fill: '#fff'}} />
    <path d="M8.993,12.446c.627-.029,1.4-.143,1.826.445a2.308,2.308,0,0,1,.041,2.087c-.363.655-1.183.592-1.816.668-.067-1.066-.06-2.131-.051-3.2" style={{fill: 'currentColor'}} />
  </svg>
);

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
    icon: PowerPointIcon,
    title: "Create PowerPoint presentations",
    description: "Develop tailored PowerPoint presentations at strategy consulting level that are simple to use, follow specific templates, and easily editable",
    badge: "Under construction",
    isActive: false
  },
  {
    icon: ExcelIcon,
    title: "Build Excel models",
    description: "Develop specific models to support calculations in national strategies",
    badge: "Under construction",
    isActive: false
  }
];

const WhatWeDo = () => {
  return (
    <section className="py-10 md:pt-0 md:pb-20 bg-background relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              AI native strategy consulting services across the public sector
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-20 mt-10 md:mt-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`group relative pt-12 pb-6 px-6 md:pt-14 md:pb-8 md:px-8 rounded-lg bg-card border border-border shadow-card transition-all duration-500 animate-fade-in ${
                    service.isActive 
                      ? 'hover:shadow-elevated hover:-translate-y-3 hover:scale-105 cursor-pointer' 
                      : 'opacity-60 grayscale-[30%]'
                  }`}
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {/* Animated background gradient */}
                  {service.isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                  )}

                  {/* Icon container - breaking out of frame */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:-top-12 flex flex-col items-center">
                    {/* Icon with badge inside */}
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl flex flex-col items-center justify-center gap-1 py-2 transition-all duration-300 border-2 ${
                      service.isActive 
                        ? 'bg-card border-accent/30 group-hover:border-accent/50 shadow-lg' 
                        : 'bg-card border-border shadow-md'
                    }`}>
                      <Icon 
                        className={`w-7 h-7 md:w-9 md:h-9 transition-transform duration-300 ${
                          service.isActive 
                            ? 'text-accent group-hover:scale-110' 
                            : 'text-muted-foreground'
                        }`} 
                        strokeWidth={1.5} 
                      />
                      {/* Badge under icon */}
                      <div className={`text-[9px] md:text-[10px] font-medium text-center leading-tight ${
                        service.isActive 
                          ? 'text-teal' 
                          : 'text-muted-foreground'
                      }`}>
                        {service.badge}
                      </div>
                      {service.isActive && (
                        <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className={`text-xl font-semibold mb-3 mt-4 leading-tight transition-colors duration-300 ${
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