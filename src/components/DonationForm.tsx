import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const donationAmounts = [25, 50, 100, 250, 500];

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getCurrentAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount) || 0;
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getCurrentAmount();

    if (amount < 5) {
      toast({
        title: "Minimum Donation",
        description: "Please enter a minimum donation of $5.",
        variant: "destructive"
      });
      return;
    }

    if (!donorInfo.name || !donorInfo.email) {
      toast({
        title: "Required Information",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create order from Netlify function
      const orderResponse = await fetch("/.netlify/functions/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }) // Razorpay works in paise
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Unable to create order");
      }

      const { order } = orderData;

      // 2. Load Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key
        amount: order.amount,
        currency: order.currency,
        name: "Social Good Initiative",
        description: "Donation",
        order_id: order.id,
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
        },
        theme: { color: "#3399cc" },
        handler: async function (response: any) {
          toast({
            title: "Thank You!",
            description: `Your donation of $${amount} was successful!`,
          });

          // Reset form
          setSelectedAmount(null);
          setCustomAmount("");
          setDonorInfo({ name: "", email: "", message: "" });

          // Optionally call send-email
          await fetch("/.netlify/functions/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: donorInfo.name,
              email: donorInfo.email,
              message: donorInfo.message || `Thank you for donating $${amount}!`
            }),
          });
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Cancelled",
              description: "Donation process was cancelled.",
              variant: "destructive",
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Unable to process your donation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="donate" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Make Your Impact Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your donation directly supports community programs. 100% of your contribution 
              goes to the causes you care about.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-large border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="h-6 w-6 text-accent" />
                    Your Donation
                  </CardTitle>
                  <CardDescription>
                    Choose an amount and help us create positive change together.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-4 block">Select Amount</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount)}
                            className="h-14 text-lg font-semibold"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      
                      <div>
                        <Label htmlFor="custom-amount" className="text-sm text-muted-foreground">
                          Or enter custom amount
                        </Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            id="custom-amount"
                            type="number"
                            placeholder="0.00"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="pl-8 h-12 text-lg"
                            min="5"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Your Information</Label>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={donorInfo.name}
                            onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={donorInfo.email}
                            onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Optional Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Share why this cause matters to you..."
                          value={donorInfo.message}
                          onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                          className="mt-1 min-h-20"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="donate"
                      className="w-full h-14 text-xl"
                      disabled={isLoading || getCurrentAmount() < 5}
                    >
                      {isLoading ? (
                        "Processing..."
                      ) : (
                        `Donate $${getCurrentAmount() || "0"}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Trust & Security Info */}
            <div className="space-y-6">
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Shield className="h-5 w-5 text-success" />
                    Secure & Trusted
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">SSL</Badge>
                    <div>
                      <p className="font-medium">256-bit Encryption</p>
                      <p className="text-sm text-muted-foreground">Your payment is fully secured</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">501(c)(3)</Badge>
                    <div>
                      <p className="font-medium">Tax Deductible</p>
                      <p className="text-sm text-muted-foreground">Receive official receipt</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">100%</Badge>
                    <div>
                      <p className="font-medium">Direct Impact</p>
                      <p className="text-sm text-muted-foreground">Funds go directly to programs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Zap className="h-5 w-5 text-accent" />
                    Instant Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your donation immediately supports active programs in communities that need it most.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>To Programs:</span>
                      <span className="text-success">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationForm;
