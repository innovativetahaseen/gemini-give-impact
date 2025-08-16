import Hero from "@/components/Hero";
import CausesSection from "@/components/CausesSection";
import DonationForm from "@/components/DonationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CausesSection />
      <DonationForm />
      <Footer />
    </div>
  );
};

export default Index;
