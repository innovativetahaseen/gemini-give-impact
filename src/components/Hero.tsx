import { Button } from "@/components/ui/button";
import { Heart, Users, Globe } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const Hero = () => {
  const scrollToDonate = () => {
    const donateSection = document.getElementById('donate');
    donateSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Community members working together for positive social impact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Users className="h-5 w-5 text-accent" />
              <span className="text-white font-semibold">10,000+ Lives Impacted</span>
            </div>
            <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Globe className="h-5 w-5 text-accent" />
              <span className="text-white font-semibold">25 Communities Served</span>
            </div>
            <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Heart className="h-5 w-5 text-accent" />
              <span className="text-white font-semibold">$500K+ Donated</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Together We
            <span className="block text-accent"> Create Change</span>
          </h1>
          
          {/* Mission Statement */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Join our community-driven mission to create lasting positive impact. 
            Every donation directly supports local initiatives that transform lives 
            and build stronger, more resilient communities.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg"
              onClick={scrollToDonate}
              className="text-lg px-8 py-4"
            >
              Start Making Impact
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;