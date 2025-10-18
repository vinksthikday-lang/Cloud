import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FileUploadProps {
  onUploadComplete: () => void;
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Optional - files can be uploaded anonymously

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Use user ID if logged in, otherwise use 'anonymous' folder
      const folder = user?.id || 'anonymous';
      const filePath = `${folder}/${crypto.randomUUID()}-${selectedFile.name}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user?.id || null, // null for anonymous uploads
          name: selectedFile.name,
          size: selectedFile.size,
          mime_type: selectedFile.type,
          storage_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success!',
        description: `${selectedFile.name} uploaded successfully`,
      });
      
      setSelectedFile(null);
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-glow'
            : 'border-border hover:border-primary/50 hover:shadow-card'
        }`}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-card opacity-50" />
        
        <div className="relative z-10">
          <div className={`mx-auto mb-6 p-6 rounded-full bg-gradient-hero w-fit transition-transform duration-300 ${
            isDragging ? 'scale-110 shadow-glow' : ''
          }`}>
            <Upload className="h-12 w-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
            {selectedFile ? selectedFile.name : 'Drop files here'}
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            {selectedFile 
              ? `Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
              : 'Support for any file type • Free unlimited storage'
            }
          </p>
          
          {selectedFile ? (
            <div className="flex gap-3 justify-center items-center flex-wrap">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                variant="hero"
                size="lg"
                className="shadow-glow"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload File'
                )}
              </Button>
              <Button
                onClick={() => setSelectedFile(null)}
                variant="outline"
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="hero" size="lg" className="shadow-glow" asChild>
              <label className="cursor-pointer">
                Select File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
