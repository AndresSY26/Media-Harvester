"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MediaGalleryProps = {
  images: string[];
  videos: string[];
};

export function MediaGallery({ images, videos }: MediaGalleryProps) {
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const defaultTab = hasImages ? "images" : "videos";

  const renderMediaItem = (url: string, type: 'image' | 'video', index: number) => (
    <div
      key={`${type}-${index}`}
      className="group relative aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in zoom-in-95"
      style={{ animationDelay: `${index * 25}ms` }}
    >
      {type === 'image' ? (
        <Image
          src={url}
          alt={`Imagen extraída ${index + 1}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      ) : (
        <video
          src={url}
          controls
          className="h-full w-full object-cover bg-black"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList>
            {hasImages && (
                <TabsTrigger value="images">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Imágenes
                    <Badge variant="secondary" className="ml-2">{images.length}</Badge>
                </TabsTrigger>
            )}
            {hasVideos && (
                <TabsTrigger value="videos">
                    <VideoIcon className="mr-2 h-4 w-4" />
                    Videos
                    <Badge variant="secondary" className="ml-2">{videos.length}</Badge>
                </TabsTrigger>
            )}
        </TabsList>
      </div>

      {hasImages && (
        <TabsContent value="images">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {images.map((url, index) => renderMediaItem(url, 'image', index))}
            </div>
        </TabsContent>
      )}

      {hasVideos && (
        <TabsContent value="videos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((url, index) => renderMediaItem(url, 'video', index))}
            </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
