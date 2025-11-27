import { MediaHarvesterForm } from '@/components/media-harvester-form';
import { Film } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Film className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
          <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Media Harvester
          </h1>
        </div>
        <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Pega una URL y extrae todas las imágenes y videos al instante. Funciona mejor en sitios con carga de contenido estática.
        </p>
      </header>
      <main className="w-full max-w-6xl flex-1">
        <MediaHarvesterForm />
      </main>
      <footer className="w-full max-w-5xl text-center mt-8 py-4">
        <p className="text-sm text-muted-foreground">
          Creado con ❤️ por un experto desarrollador Full Stack.
        </p>
      </footer>
    </div>
  );
}
