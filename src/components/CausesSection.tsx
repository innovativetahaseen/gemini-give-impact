import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Utensils, Home, Heart } from "lucide-react";

const causes = [
  {
    id: 1,
    title: "Education for All",
    description: "Providing school supplies, books, and educational resources to underserved communities.",
    icon: GraduationCap,
    raised: 15420,
    goal: 25000,
    supporters: 156,
    color: "text-blue-600"
  },
  {
    id: 2,
    title: "Community Food Programs",
    description: "Supporting local food banks and community kitchens to fight hunger.",
    icon: Utensils,
    raised: 8750,
    goal: 15000,
    supporters: 89,
    color: "text-green-600"
  },
  {
    id: 3,
    title: "Safe Housing Initiative",
    description: "Helping families find stable, affordable housing in safe neighborhoods.",
    icon: Home,
    raised: 22100,
    goal: 40000,
    supporters: 203,
    color: "text-purple-600"
  },
  {
    id: 4,
    title: "Healthcare Access",
    description: "Providing essential medical care and mental health support to those in need.",
    icon: Heart,
    raised: 12890,
    goal: 20000,
    supporters: 127,
    color: "text-red-600"
  }
];

const CausesSection = () => {
  const scrollToDonate = () => {
    const donateSection = document.getElementById('donate');
    donateSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Where Your Impact Goes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every donation is transparently allocated to these vital community programs. 
            See exactly how your contribution creates meaningful change.
          </p>
        </div>

        {/* Causes Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {causes.map((cause) => {
            const progressPercentage = (cause.raised / cause.goal) * 100;
            const Icon = cause.icon;
            
            return (
              <Card key={cause.id} className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Icon className={`h-8 w-8 ${cause.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">{cause.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{cause.supporters} supporters</span>
                        <span>•</span>
                        <span>{Math.round(progressPercentage)}% funded</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {cause.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">
                        ${cause.raised.toLocaleString()} of ${cause.goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={scrollToDonate}
                  >
                    Support This Cause
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of changemakers creating positive impact in communities worldwide.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={scrollToDonate}
              className="bg-accent hover:bg-accent-dark"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CausesSection;