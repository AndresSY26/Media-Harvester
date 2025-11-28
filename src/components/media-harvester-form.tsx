"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand, LoaderCircle, ImageOff } from "lucide-react";

import { ActionState, extractMedia } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaGallery } from "@/components/media-gallery";
import { Card, CardContent } from "./ui/card";

const FormSchema = z.object({
  url: z.string().trim().min(1, { message: 'La URL no puede estar vacía.' }).url({ message: "Por favor, introduce una URL válida." }),
});

const initialState: ActionState = {
  message: "",
};

export function MediaHarvesterForm() {
  const [state, formAction, isPending] = useActionState(extractMedia, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { url: "" },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error en la extracción",
        description: state.error,
      });
    }
  }, [state.error, state.timestamp, toast]);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (state.data) {
        if (!state.data.images?.length && !state.data.videos?.length && !state.data.audios?.length) {
            return (
                <Card className="mt-8">
                    <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                        <ImageOff className="w-16 h-16 text-muted-foreground mb-4"/>
                        <h3 className="text-xl font-semibold">No se encontraron medios</h3>
                        <p className="text-muted-foreground">No se pudo extraer ninguna imagen, video o audio de la URL proporcionada.</p>
                    </CardContent>
                </Card>
            )
        }
      return <MediaGallery images={state.data.images} videos={state.data.videos} audios={state.data.audios} />;
    }

    return (
        <Card className="mt-8 bg-card/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <Wand className="w-16 h-16 text-muted-foreground mb-4"/>
                <h3 className="text-xl font-semibold">Listo para la magia</h3>
                <p className="text-muted-foreground">Ingresa una URL para comenzar la extracción de medios.</p>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form action={formAction} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full">
                    <FormControl>
                      <Input
                        type="url"
                        name="url"
                        placeholder="https://ejemplo.com/manga/capitulo-1"
                        className="h-12 text-base"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                disabled={isPending}
                style={{backgroundColor: 'hsl(var(--primary))'}}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Wand className="mr-2" />
                )}
                Extraer Medios
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
}
