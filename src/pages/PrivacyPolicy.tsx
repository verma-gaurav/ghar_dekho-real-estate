import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-estate-700">
          Your Privacy, Our Priority
        </h1>
        <div className="w-20 h-1 bg-estate-400 mx-auto mb-6"></div>
        <p className="text-muted-foreground text-lg">
          We respect your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
        </p>
      </div>

      <Card className="shadow-md mb-8">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-estate-600">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Data We Collect</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name, email, phone number during sign-up</li>
                <li>Property details you upload</li>
                <li>Your usage patterns (for analytics & improvement)</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To create and manage your account</li>
                <li>To show your listings to potential buyers/renters</li>
                <li>To send service-related emails or notifications</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">3. Data Sharing</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We never sell your data.</li>
                <li>We may share data with service providers (e.g., Google Maps, payment gateways) only as needed.</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">4. Security</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We use encryption, authentication, and secure servers.</li>
                <li>Your data is protected under industry-standard practices.</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">5. Cookies</h3>
              <p className="text-muted-foreground">
                We use cookies to improve user experience. You can opt out anytime via browser settings.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>View, update, or delete your data</li>
                <li>Contact us at privacy@yourdomain.com</li>
              </ul>
            </section>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-estate-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Privacy Policy Updates</h2>
        <p className="text-muted-foreground mb-4">
          We may update this privacy policy from time to time. Significant changes will be notified to you via email 
          or through a notification on our website. We encourage you to periodically review this page for the latest information.
        </p>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          If you have any questions about our Privacy Policy, please <a href="/contact" className="text-estate-500 hover:underline">contact us</a>.
        </p>
      </div>
    </div>
  );
} 