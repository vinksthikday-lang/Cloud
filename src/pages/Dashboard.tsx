import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Upload as UploadIcon } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // No redirect - anonymous users can also use the dashboard

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'See you next time!',
    });
    navigate('/');
  };

  // Allow immediate rendering for anonymous users too
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="glass border-b sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-gradient">
              KoalaHub
            </h1>
            {user ? (
              <Button variant="glass" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button variant="glass" onClick={() => navigate('/auth')} className="gap-2">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Upload Section */}
          <section className="animate-fade-in">
            <div className="glass rounded-2xl p-8 shadow-card-hover border">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                  <UploadIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {user ? 'Upload Files' : 'Upload Files - No Account Needed'}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {user ? 'Fast, free, and unlimited storage for everyone' : 'Start sharing files instantly - completely free'}
                  </p>
                </div>
              </div>
              <FileUpload onUploadComplete={() => setRefreshTrigger(prev => prev + 1)} />
            </div>
          </section>

          {/* Files Section */}
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-hero-reverse bg-clip-text text-transparent">
                {user ? 'Your Files' : 'All Uploaded Files'}
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                {user ? 'Manage and share your uploads' : 'View and manage uploaded files'}
              </p>
            </div>
            <FileList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
