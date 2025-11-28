import { MediaHarvesterForm } from '@/components/media-harvester-form';

export default function ToolPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
       <header className="w-full max-w-5xl text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight">
          Media Harvester Tool
        </h1>
        <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Pega una URL y extrae todas las imágenes, videos y audios al instante. Funciona mejor en sitios con carga de contenido estática.
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
