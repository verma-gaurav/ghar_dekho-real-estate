import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent", {
        description: "We've received your message and will get back to you soon.",
      });
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  
  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-estate-700">
          We'd Love to Hear From You!
        </h1>
        <div className="w-20 h-1 bg-estate-400 mx-auto mb-6"></div>
        <p className="text-muted-foreground text-lg">
          Have questions, need support, or want to partner with us? Our team is here to help you with anything related to property buying, selling, or renting.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-5 w-5 text-estate-500" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+91-8824351636</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-estate-500" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">contact@propify.com</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 text-estate-500" />
              </div>
              <h3 className="font-semibold mb-2">Office</h3>
              <p className="text-muted-foreground">Pili kothi, Behind Utsav Hotel, Rani Bazar, Bikaner</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-5 gap-8">
        <Card className="md:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" placeholder="Your phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">Inquiry</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="listing">Listing Help</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Subject of your message" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} required />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              When you can reach us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-estate-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Working Hours</h4>
                  <p className="text-sm text-muted-foreground">Monday - Saturday</p>
                  <p className="text-sm text-muted-foreground">9:00 AM to 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-estate-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Closed On</h4>
                  <p className="text-sm text-muted-foreground">Sundays</p>
                  <p className="text-sm text-muted-foreground">Public Holidays</p>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t">
                <h4 className="font-medium mb-3">Connect With Us</h4>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 