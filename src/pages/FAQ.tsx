import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-estate-700">
          Frequently Asked Questions
        </h1>
        <div className="w-20 h-1 bg-estate-400 mx-auto mb-6"></div>
        <p className="text-muted-foreground">
          Find answers to the most common questions about our platform.
        </p>
      </div>

      <Card className="shadow-md mb-8">
        <CardHeader>
          <CardTitle>General Questions</CardTitle>
          <CardDescription>
            Common questions about using our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I post a property?</AccordionTrigger>
              <AccordionContent>
                Just sign up, go to your dashboard, and click "Post a Property." Follow the 6-step wizard to complete your listing.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Is listing a property free?</AccordionTrigger>
              <AccordionContent>
                Yes, listing is currently free. Premium plans may be introduced later for featured visibility.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I list commercial properties?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We support both commercial and residential listings.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can buyers/renters contact me directly?</AccordionTrigger>
              <AccordionContent>
                Yes, interested users can send you queries or messages through the platform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account and Management</CardTitle>
          <CardDescription>
            Questions about managing your account and listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I remove or edit a listing?</AccordionTrigger>
              <AccordionContent>
                Go to "My Listings" in your dashboard. You can edit or delete any of your posts there.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>How is my data secured?</AccordionTrigger>
              <AccordionContent>
                We use modern security protocols and never sell your data.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>Can I save a property I like?</AccordionTrigger>
              <AccordionContent>
                Yes, simply click the "Save" icon on any listing and it will appear in your dashboard.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger>How do I report fake listings?</AccordionTrigger>
              <AccordionContent>
                Use the "Report" button on the listing or contact us at report@yourdomain.com
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="text-center mt-12 bg-estate-50 py-8 px-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          If you couldn't find the answer to your question, please contact our support team.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/contact" className="text-estate-500 hover:text-estate-600 transition-colors">
            Contact Us
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="mailto:support@propify.com" className="text-estate-500 hover:text-estate-600 transition-colors">
            support@propify.com
          </a>
        </div>
      </div>
    </div>
  );
} 