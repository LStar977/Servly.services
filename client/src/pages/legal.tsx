import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Legal() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Legal Center</h1>
      
      <Tabs defaultValue="terms">
        <TabsList className="mb-8">
          <TabsTrigger value="terms">Terms of Use</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="provider">Provider Agreement</TabsTrigger>
          <TabsTrigger value="cancellation">Cancellation Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Terms of Use</h2>
          <p>Welcome to Servly. By using our platform, you agree to these terms...</p>
          <p>[Placeholder for full legal terms]</p>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Privacy Policy</h2>
          <p>Your privacy is important to us. This policy explains how we handle your data...</p>
          <p>[Placeholder for privacy policy]</p>
        </TabsContent>

        <TabsContent value="provider" className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Provider Agreement</h2>
          <p>Rules and expectations for businesses operating on the Servly platform...</p>
          <p>[Placeholder for provider agreement]</p>
        </TabsContent>

        <TabsContent value="cancellation" className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Cancellation Policy</h2>
          <p>Information about cancelling bookings and applicable fees...</p>
          <p>[Placeholder for cancellation policy]</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
