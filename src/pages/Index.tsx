import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, Download, Shield, Zap, HardDrive, Users } from 'lucide-react';
import koalaHero from '@/assets/koala-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Share Files{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Without Limits
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Upload, store, and share your files with unlimited storage, 
                lightning-fast downloads, and zero ads. Completely free, forever.
              </p>
              <div className="flex gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <img
                src={koalaHero}
                alt="KoalaHub mascot"
                className="rounded-2xl shadow-glow w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Why Choose KoalaHub?</h2>
            <p className="text-xl text-muted-foreground">
              The smartest way to share files online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: HardDrive,
                title: 'Unlimited Storage',
                description: 'Upload as many files as you want. No size limits, no hidden fees.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Maximum download speeds for everyone. No throttling, no premium tiers.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your files are encrypted and protected. Only you have access.',
              },
              {
                icon: Download,
                title: 'Easy Sharing',
                description: 'Share files with anyone through simple, clean download links.',
              },
              {
                icon: Users,
                title: 'Always Free',
                description: 'No subscriptions, no ads, no catch. Free storage for everyone.',
              },
              {
                icon: Upload,
                title: 'Simple Interface',
                description: 'Drag, drop, done. The easiest way to share files online.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-card rounded-lg shadow-card-custom hover:shadow-elegant transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold">
              Ready to experience better file sharing?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who trust KoalaHub for their file sharing needs
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">Start Uploading Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 KoalaHub. Free file sharing for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
