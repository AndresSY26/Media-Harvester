
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, VideoIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MediaGalleryProps = {
  images: string[];
  videos: string[];
};

export function MediaGallery({ images, videos }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const defaultTab = hasImages ? "images" : "videos";

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const showNextImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev! + 1) % images.length);
  }, [selectedImage, images.length]);

  const showPrevImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedImage, images.length]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, closeModal, showNextImage, showPrevImage]);


  const renderMediaItem = (url: string, type: 'image' | 'video', index: number) => (
    <div
      key={`${type}-${index}`}
      className="group relative aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in zoom-in-95 cursor-pointer"
      style={{ animationDelay: `${index * 25}ms` }}
      onClick={() => type === 'image' && setSelectedImage(index)}
    >
      {type === 'image' ? (
        <Image
          src={url}
          alt={`Extracted image ${index + 1}`}
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
    <>
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
      
      {selectedImage !== null && (
        <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-in fade-in"
            onClick={closeModal}
        >
          <div className="relative w-full h-full p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
            <Image
                src={images[selectedImage]}
                alt={`Selected image ${selectedImage + 1}`}
                fill
                className="object-contain"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10"
            onClick={closeModal}
          >
            <X className="h-8 w-8" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showNextImage(); }}
              >
                <ChevronRight className="h-10 w-10" />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}

