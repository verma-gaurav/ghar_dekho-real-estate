import { Building, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Building className="h-6 w-6 text-estate-400" />
              <span className="text-xl font-bold text-estate-700">Propify</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Your trusted partner in finding the perfect property for your needs. We connect property owners, builders, and agents with potential buyers and tenants.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-estate-100 hover:bg-estate-200">
                <Facebook className="h-5 w-5 text-estate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-estate-100 hover:bg-estate-200">
                <Instagram className="h-5 w-5 text-estate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-estate-100 hover:bg-estate-200">
                <Twitter className="h-5 w-5 text-estate-600" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/buy" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Buy
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Rent
                </Link>
              </li>
              <li>
                <Link to="/pg" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  PG/Co-living
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/list-property" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-estate-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for updates on new listings and real estate news.
            </p>
            <div className="flex gap-2 mb-6">
              <Input placeholder="Enter your email" type="email" className="bg-white" />
              <Button>Subscribe</Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-estate-400" />
                <span>contact@propify.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-estate-400" />
                <span>+91-8824351636</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-estate-400" />
                <span>Pili kothi, Behind Utsav Hotel, Rani Bazar, Bikaner</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Propify. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-estate-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-estate-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-estate-500 transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
