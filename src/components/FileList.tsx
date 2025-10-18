import { useState, useEffect } from 'react';
import { Download, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FileData {
  id: string;
  name: string;
  size: number;
  storage_path: string;
  created_at: string;
  download_count: number;
}

interface FileListProps {
  refreshTrigger: number;
}

export const FileList = ({ refreshTrigger }: FileListProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFiles = async () => {
    try {
      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is logged in, show only their files, otherwise show all files
      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user, refreshTrigger]);

  const handleDownload = async (file: FileData) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(file.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', file.id);

      fetchFiles();
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'There was an error downloading your file',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (file: FileData) => {
    if (!confirm(`Delete ${file.name}?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast({
        title: 'File deleted',
        description: `${file.name} has been removed`,
      });

      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting your file',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading files...</div>;
  }

  if (files.length === 0) {
    return (
      <div className="glass rounded-2xl p-16 text-center shadow-card">
        <div className="mx-auto w-fit p-6 bg-gradient-hero rounded-full mb-6 shadow-glow">
          <File className="h-16 w-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No files yet</h3>
        <p className="text-muted-foreground text-lg">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {files.map((file, index) => (
        <Card
          key={file.id}
          className="group glass glass-hover p-6 border-2 transition-all duration-300 animate-fade-in hover:scale-[1.02]"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-3 bg-gradient-hero rounded-xl shadow-glow group-hover:shadow-glow-strong transition-all">
                <File className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate text-lg" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 px-1">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span className="font-medium">{file.download_count}</span>
            </div>
            <span className="font-medium">{new Date(file.created_at).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 shadow-sm hover:shadow-md"
              onClick={() => handleDownload(file)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(file)}
              className="shadow-sm hover:shadow-md"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
