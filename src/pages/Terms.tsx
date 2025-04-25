import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-estate-700">
          Know the Rules Before You List or Browse
        </h1>
        <div className="w-20 h-1 bg-estate-400 mx-auto mb-6"></div>
        <p className="text-muted-foreground text-lg">
          These Terms govern your access to and use of our real estate portal.
        </p>
      </div>

      <Card className="shadow-md mb-8">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-estate-600">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. User Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and honest property information</li>
                <li>Don't post illegal or misleading content</li>
                <li>Use the platform respectfully and legally</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">2. Listing Policies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Listings are subject to moderation and may be removed if they violate guidelines</li>
                <li>One property per listing is allowed</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">3. Content Ownership</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You retain rights to your posted content</li>
                <li>By uploading, you grant us non-exclusive rights to display your listings</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">4. Platform Liability</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We are not responsible for disputes between users</li>
                <li>We do not guarantee transaction success but provide a secure platform for communication</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">5. Termination</h3>
              <p className="text-muted-foreground">
                We reserve the right to suspend accounts violating terms without notice
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-semibold mb-3">6. Updates</h3>
              <p className="text-muted-foreground">
                Terms may change. We will notify users for significant updates.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-estate-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
        <p className="text-muted-foreground mb-4">
          By accessing or using our services, you agree to be bound by these Terms and Conditions. 
          If you do not agree to these Terms, you should not use our services.
        </p>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          If you have any questions about our Terms & Conditions, please <a href="/contact" className="text-estate-500 hover:underline">contact us</a>.
        </p>
      </div>
    </div>
  );
} 