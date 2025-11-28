import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-40 lg:py-48 text-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
             <div className="absolute inset-0 bg-radial-gradient"></div>
           </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl font-bold tracking-tighter font-headline sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Descarga Multimedia de Cualquier Web
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Nuestro potente motor de scraping te permite descargar al instante todas las imágenes y vídeos de cualquier URL. Simple, rápido y eficiente.
              </p>
              <div>
                <Link href="/tool">
                  <Button size="lg" className="font-bold text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                    Lanzar App
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-1">
              <Card className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Zap className="w-8 h-8 text-primary" />
                  <CardTitle className="font-headline text-2xl">Ultra Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nuestro motor optimizado extrae contenido en segundos, ignorando assets pesados para ahorrarte tiempo y ancho de banda.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <DownloadCloud className="w-8 h-8 text-primary" />
                   <CardTitle className="font-headline text-2xl">Soporte Universal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Extrae imágenes, vídeos y audios. Descarga medios individualmente o todo en un único archivo ZIP.
                  </p>
                </CardContent>
              </Card>
               <Card className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                   <CardTitle className="font-headline text-2xl">Privacidad Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    El procesamiento se realiza en nuestro backend seguro. No almacenamos tus URLs ni los medios extraídos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
