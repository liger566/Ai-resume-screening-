import { FileUp, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { extractText } from "../lib/parsers";
import { toast } from "sonner";

interface ResumeUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
}

export function ResumeUpload({ onTextExtracted }: ResumeUploadProps) {
  const [isExtracting, setIsExtracting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const text = await extractText(file);
      if (!text || text.trim().length < 50) {
        toast.error("Could not extract enough text from the file. Please try another one.");
        return;
      }
      onTextExtracted(text, file.name);
      toast.success("Resume uploaded and text extracted!");
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Failed to parse the file. Please ensure it's a valid PDF, DOCX, or TXT file.");
    } finally {
      setIsExtracting(false);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  } as any);

  return (
    <Card className="w-full border-2 border-dashed border-border bg-[#F9FAFB] hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center h-[120px] text-center p-4"
        >
          <input {...getInputProps()} />
          {isExtracting ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Extracting text...</p>
            </div>
          ) : (
            <>
              <span className="text-2xl mb-2">📄</span>
              {isDragActive ? (
                <p className="text-sm font-semibold text-primary">Drop the resume here...</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Click or drag resume here</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">PDF, DOCX, or TXT (Max 5MB)</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
