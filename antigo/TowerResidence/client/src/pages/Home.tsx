import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building2, 
  Waves, 
  Dumbbell, 
  UtensilsCrossed, 
  Trees, 
  Sun, 
  Home as HomeIcon,
  Gamepad2,
  ShoppingCart,
  Coffee,
  Music,
  PawPrint,
  Car,
  Baby,
  PhoneCall
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import logoPath from "@assets/logotipo_1761647562256.jpg";
import fachadaPath from "@assets/fachada_do_empeendimento_1761647562253.jpg";
import piscinaPath from "@assets/piscina_1761647562249.jpg";
import academiaPath from "@assets/academia_1761647562248.jpg";
import vistaPath from "@assets/vista_do_empreendimento_1761647562254.jpg";
import planta41m2Path from "@assets/planta_final_1_2_12_13_41m2_1761647562246.jpg";
import planta40m2Path from "@assets/planta_final_3_4_5_6_8_9_10_11_`40m2_1761647562244.jpg";
import planta46m2Path from "@assets/planta_final_7_46m2_1761647562240.jpg";
import { useState } from "react";

const WHATSAPP_NUMBER = "5511970988512";
const WHATSAPP_MESSAGE = encodeURIComponent("Olá Gostaria de informações sobre o Tower");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const amenities = [
  { icon: Waves, label: "Piscina" },
  { icon: Dumbbell, label: "Academia" },
  { icon: UtensilsCrossed, label: "Salão de Festas" },
  { icon: HomeIcon, label: "Home Office" },
  { icon: Baby, label: "Playground" },
  { icon: Sun, label: "Deck Solar" },
  { icon: UtensilsCrossed, label: "Churrasqueira" },
  { icon: Trees, label: "Fitness Externo" },
  { icon: Gamepad2, label: "Sala de Jogos" },
  { icon: ShoppingCart, label: "Mini Mercado" },
  { icon: Trees, label: "Redário" },
  { icon: Baby, label: "Brinquedoteca" },
  { icon: Coffee, label: "Lounge Caffe" },
  { icon: Music, label: "Estúdio Música" },
  { icon: PawPrint, label: "Pet Place" }
];

const floorPlans = [
  {
    id: 1,
    title: "Plantas 1, 2, 12 e 13",
    area: "41m²",
    rooms: "2 Dormitórios",
    image: planta41m2Path
  },
  {
    id: 2,
    title: "Plantas 3, 4, 5, 6, 8, 9, 10, 11",
    area: "40m²",
    rooms: "2 Dormitórios",
    image: planta40m2Path
  },
  {
    id: 3,
    title: "Planta 7",
    area: "46m²",
    rooms: "2 Dormitórios",
    image: planta46m2Path
  }
];

const galleryImages = [
  { src: piscinaPath, alt: "Piscina com deck molhado do Abiatar Residence Tower" },
  { src: academiaPath, alt: "Academia completa e moderna do Abiatar Residence Tower" },
  { src: vistaPath, alt: "Vista panorâmica do empreendimento Abiatar Residence Tower" }
];

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const scrollToPlants = () => {
    document.getElementById('plantas')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src={logoPath} 
            alt="Abiatar Residence Tower Logo" 
            className="h-10 md:h-12 object-contain"
            data-testid="img-logo"
          />
          <Button 
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 min-h-[44px] min-w-[44px]"
            asChild
            data-testid="button-whatsapp-header"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <SiWhatsapp className="h-5 w-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={fachadaPath} 
            alt="Fachada do Abiatar Residence Tower" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
          <Badge 
            className="mb-4 md:mb-6 bg-primary/20 backdrop-blur-sm border-primary/30 text-primary-foreground hover:bg-primary/30"
            data-testid="badge-lancamento"
          >
            Lançamento
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Viva o Extraordinário no<br />
            <span className="text-primary">Abiatar Residence Tower</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Apartamentos de 1 e 2 dormitórios com lazer completo no coração de Taboão da Serra
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-base md:text-lg px-8 py-6 border-0 min-h-[44px]"
              asChild
              data-testid="button-whatsapp-hero"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <SiWhatsapp className="h-5 w-5" />
                Fale Conosco
              </a>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-base md:text-lg px-8 py-6 min-h-[44px]"
              onClick={scrollToPlants}
              data-testid="button-ver-plantas"
            >
              Ver Plantas
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section - Critical Priority */}
      <section className="py-12 md:py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Localização Privilegiada
            </h2>
            <div className="flex items-center justify-center gap-2 text-primary mb-6">
              <MapPin className="h-5 w-5 md:h-6 md:w-6" />
              <p className="text-lg md:text-xl font-semibold">
                Centro de Taboão da Serra
              </p>
            </div>
          </div>

          <Card className="p-8 md:p-12 text-center hover-elevate max-w-2xl mx-auto" data-testid="card-localizacao-principal">
            <Building2 className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-4">
              Entre a Kalunga e o Banco do Brasil
            </h3>
            <p className="text-base md:text-lg text-muted-foreground">
              No coração de Taboão da Serra, com comércio e serviços ao seu alcance
            </p>
          </Card>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Lazer Completo
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Uma infraestrutura pensada para o seu bem-estar e conforto
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Card 
                  key={index} 
                  className="p-4 md:p-6 flex flex-col items-center justify-center gap-3 hover-elevate transition-all"
                  data-testid={`card-amenity-${index}`}
                >
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  <p className="text-xs md:text-sm font-medium text-center text-card-foreground leading-tight">
                    {amenity.label}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Conheça o Empreendimento
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Espaços projetados para proporcionar qualidade de vida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-lg group aspect-[4/3]"
                data-testid={`img-gallery-${index}`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Plans Section */}
      <section id="plantas" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Opções de Plantas
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Apartamentos de 1 e 2 dormitórios com varanda integrada
            </p>
          </div>

          {/* Plan Selector Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-12 max-w-md mx-auto sm:max-w-none">
            {floorPlans.map((plan, index) => (
              <Button
                key={plan.id}
                variant={selectedPlan === index ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedPlan(index)}
                className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px] min-h-[44px]"
                data-testid={`button-plan-${index}`}
              >
                {plan.area}
              </Button>
            ))}
          </div>

          {/* Selected Plan Display */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8" data-testid="card-selected-plan">
              <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3">
                    {floorPlans[selectedPlan].title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm md:text-base">
                        {floorPlans[selectedPlan].area}
                      </Badge>
                      <Badge variant="secondary" className="text-sm md:text-base">
                        {floorPlans[selectedPlan].rooms}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 min-h-[44px]"
                    size="lg"
                    asChild
                    data-testid="button-whatsapp-plan"
                  >
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <SiWhatsapp className="h-5 w-5" />
                      Saiba Mais Sobre Esta Planta
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden bg-muted/30 p-2">
                <img 
                  src={floorPlans[selectedPlan].image} 
                  alt={`Planta de ${floorPlans[selectedPlan].area}`}
                  className="w-full h-auto"
                  data-testid="img-floor-plan"
                  loading="lazy"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge 
            className="mb-4 md:mb-6 bg-primary-foreground/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground"
            data-testid="badge-lancamento-footer"
          >
            Lançamento
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Não Perca Esta Oportunidade
          </h2>
          <p className="text-base md:text-lg mb-8 md:mb-10 opacity-90">
            Entre em contato conosco e descubra como realizar o sonho do seu apartamento próprio no Centro de Taboão da Serra
          </p>

          <Button 
            size="lg"
            className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 text-base md:text-lg px-12 py-6 border-0 min-h-[44px]"
            asChild
            data-testid="button-whatsapp-final"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <SiWhatsapp className="h-5 w-5" />
              Fale Conosco pelo WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img 
            src={logoPath} 
            alt="Abiatar Residence Tower" 
            className="h-10 mx-auto mb-4 object-contain"
          />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Abiatar Residence Tower. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 animate-pulse"
        aria-label="Fale conosco no WhatsApp"
        data-testid="button-whatsapp-floating"
      >
        <SiWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}
