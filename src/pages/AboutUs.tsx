import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-estate-700">
          Empowering Real Estate Transactions, One Click at a Time
        </h1>
        <div className="w-20 h-1 bg-estate-400 mx-auto mb-8"></div>
      </div>

      <Card className="mb-8 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-estate-600">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            We are a passionate team dedicated to transforming how real estate works. With a modern, zero-brokerage platform, 
            we empower property owners, buyers, and renters to connect directly, transparently, and affordably.
          </p>
        </CardContent>
      </Card>

      <div className="prose prose-slate max-w-none mb-12">
        <p className="text-lg mb-6 leading-relaxed">
          Bikaner Property Club was born with the vision of making property discovery and listing easier for everyone. 
          Whether you're buying your dream home, renting a commercial space, or selling land — we offer a user-friendly, 
          secure, and comprehensive platform to serve your real estate needs.
        </p>

        <p className="text-lg mb-6 leading-relaxed">
          We cut out the middlemen and complex brokerage chains, giving you full control over your deals. 
          With advanced filters, smart dashboards, location-based search, and seamless chat systems, 
          we ensure that you spend less time searching and more time closing the right deal.
        </p>

        <p className="text-lg font-medium text-estate-600">
          We are not just a property platform — we are your digital partner in every real estate decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-estate-50 border-estate-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-estate-500"><path d="M2 22V8c0-1.1.9-2 2-2h2"></path><path d="M6 6V2c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4"></path><path d="M18 6h2c1.1 0 2 .9 2 2v14"></path><path d="M22 13h-2"></path><path d="M6 13H2"></path><path d="M10 2v4"></path><path d="M14 2v4"></path><path d="M18 6H6"></path><rect x="6" y="13" width="12" height="9" rx="2"></rect></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Zero Brokerage</h3>
              <p className="text-sm text-muted-foreground">
                Connect directly with owners or tenants without any commission fees.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-estate-50 border-estate-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-estate-500"><path d="M22 17a10 10 0 0 0-20 0"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">User-Centric</h3>
              <p className="text-sm text-muted-foreground">
                Built with real users in mind, focusing on simplicity and functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-estate-50 border-estate-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-estate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Expertise</h3>
              <p className="text-sm text-muted-foreground">
                Specialized knowledge of Bikaner's real estate market and neighborhoods.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 