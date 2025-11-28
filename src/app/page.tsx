import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DownloadCloud, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 text-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Extract Media From Any Web in Seconds
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Our powerful scraping engine allows you to instantly download all images, videos, and audio from any URL. Simple, fast, and efficient.
              </p>
              <div>
                <Link href="/tool">
                  <Button size="lg" className="font-bold text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Launch App
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-background/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Zap className="w-8 h-8 text-primary" />
                  <CardTitle className="font-headline">Ultra Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our optimized engine scrapes pages in seconds by ignoring heavy assets, saving you time and bandwidth.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <DownloadCloud className="w-8 h-8 text-primary" />
                   <CardTitle className="font-headline">Universal Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Extract images, videos, and audio files. Download media individually or get everything in a single ZIP file.
                  </p>
                </CardContent>
              </Card>
               <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                   <CardTitle className="font-headline">Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All processing happens on our secure backend. We don't store your URLs or the extracted media.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container flex items-center justify-center px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Media Harvester. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
