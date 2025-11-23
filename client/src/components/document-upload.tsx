import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { documentAPI } from "@/lib/api";
import type { Document } from "@shared/schema";

interface DocumentUploadProps {
  providerId: string;
  onDocumentsChange?: (documents: Document[]) => void;
}

export function DocumentUpload({ providerId, onDocumentsChange }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const fileData = event.target?.result as string;
            const doc = await documentAPI.upload({
              providerId,
              filename: file.name,
              documentType: file.name.includes("license") ? "license" : file.name.includes("insurance") ? "insurance" : file.name.includes("id") ? "id" : "other",
              fileUrl: fileData,
            });
            setDocuments([...documents, doc]);
            onDocumentsChange?.([...documents, doc]);
            toast({
              title: "Document uploaded successfully",
              description: `${file.name} has been uploaded`,
            });
          } catch (error) {
            toast({
              title: "Upload failed",
              description: error instanceof Error ? error.message : "Could not upload document",
              variant: "destructive",
            });
          }
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
      e.currentTarget.value = "";
    }
  };

  const loadDocuments = async () => {
    try {
      const docs = await documentAPI.getByProviderId(providerId);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  if (documents.length === 0 && !uploading) {
    loadDocuments();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Documents for Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Submit your business license, insurance, ID, and any other required documents for admin verification.
        </p>

        {/* Upload Area */}
        <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium text-sm">Click to upload documents</span>
          <span className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            data-testid="file-input"
          />
        </label>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Uploaded Documents ({documents.length})</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  data-testid={`document-${doc.id}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <strong>Status:</strong> {documents.length === 0 ? "Awaiting documents" : "Documents submitted - waiting for admin approval"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
