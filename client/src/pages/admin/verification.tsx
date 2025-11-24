import { useState, useEffect } from "react";
import { documentAPI } from "@/lib/api";
import type { ProviderProfile } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileText, Clock, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerificationPage() {
  const [pendingProviders, setPendingProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProviderId, setExpandedProviderId] = useState<string | null>(null);
  const [providerDocuments, setProviderDocuments] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadPendingProviders();
  }, []);

  const loadPendingProviders = async () => {
    try {
      const providers = await documentAPI.getPendingProviders();
      setPendingProviders(providers);
    } catch (error) {
      toast({
        title: "Failed to load pending providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId: string) => {
    try {
      await documentAPI.approveProvider(providerId);
      toast({
        title: "Provider approved",
        description: "Provider has been approved and can now accept bookings",
      });
      loadPendingProviders();
    } catch (error) {
      toast({
        title: "Failed to approve provider",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (providerId: string) => {
    try {
      await documentAPI.rejectProvider(providerId);
      toast({
        title: "Provider rejected",
        description: "Provider has been rejected",
      });
      loadPendingProviders();
    } catch (error) {
      toast({
        title: "Failed to reject provider",
        variant: "destructive",
      });
    }
  };

  const loadProviderDocuments = async (providerId: string) => {
    try {
      const docs = await documentAPI.getByProviderId(providerId);
      setProviderDocuments(prev => ({ ...prev, [providerId]: docs }));
    } catch (error) {
      toast({
        title: "Failed to load documents",
        variant: "destructive",
      });
    }
  };

  const toggleExpandProvider = (providerId: string) => {
    if (expandedProviderId === providerId) {
      setExpandedProviderId(null);
    } else {
      setExpandedProviderId(providerId);
      if (!providerDocuments[providerId]) {
        loadProviderDocuments(providerId);
      }
    }
  };

  const downloadDocument = (doc: any) => {
    try {
      // The fileUrl is already base64 encoded
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Provider Verification</h1>
        <p className="text-muted-foreground mt-2">Review and approve pending provider profiles</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Loading pending providers...</p>
        </div>
      ) : pendingProviders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No pending providers to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingProviders.map((provider) => (
            <Card key={provider.id} data-testid={`provider-card-${provider.id}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{provider.businessName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{provider.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pending Review
                    </span>
                    {provider.documentCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpandProvider(provider.id)}
                        data-testid={`expand-docs-${provider.id}`}
                      >
                        {expandedProviderId === provider.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm"><strong>Description:</strong> {provider.description || "N/A"}</p>
                  <p className="text-sm"><strong>Phone:</strong> {provider.phone}</p>
                  <p className="text-sm"><strong>Categories:</strong> {provider.categories?.join(", ") || "N/A"}</p>
                  <p className="text-sm"><strong>Documents Submitted:</strong> {provider.documentCount} file{provider.documentCount !== 1 ? "s" : ""}</p>
                </div>

                {expandedProviderId === provider.id && provider.documentCount > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <h4 className="font-semibold text-sm">Uploaded Documents:</h4>
                    {providerDocuments[provider.id]?.length ? (
                      <div className="space-y-2">
                        {providerDocuments[provider.id].map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 flex-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.filename}</p>
                                <p className="text-xs text-muted-foreground capitalize">{doc.documentType}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(doc)}
                              data-testid={`download-doc-${doc.id}`}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading documents...</p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(provider.id)}
                    data-testid={`reject-button-${provider.id}`}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(provider.id)}
                    data-testid={`approve-button-${provider.id}`}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
