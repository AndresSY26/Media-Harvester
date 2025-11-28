import Link from "next/link";
import { Film, Github, Linkedin, Twitter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950/50 border-t border-white/10 pt-16 pb-8 text-muted-foreground">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-xl text-white">Media Harvester</span>
          </Link>
          <p className="text-sm">
            La herramienta definitiva para extraer contenido multimedia de la web con facilidad y velocidad.
          </p>
        </div>

        {/* Links Columns */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold text-white mb-4">Producto</h3>
                <ul className="space-y-3">
                    <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                    <li><Link href="/tool" className="hover:text-primary transition-colors">Herramienta</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Precios</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-3">
                    <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Uso de Cookies</Link></li>
                </ul>
            </div>
        </div>

        {/* Newsletter Column */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-bold text-white mb-4">Suscríbete al Newsletter</h3>
          <p className="text-sm mb-4">Recibe noticias sobre nuevas funciones y actualizaciones.</p>
          <form className="flex gap-2">
            <Input type="email" placeholder="tu@email.com" className="bg-background/80" />
            <Button type="submit" variant="default">
              Suscribirse
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Media Harvester. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
          <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 hover:text-primary transition-colors" /></Link>
          <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 hover:text-primary transition-colors" /></Link>
        </div>
      </div>
    </footer>
  );
}
