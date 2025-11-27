
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, VideoIcon, X, ChevronLeft, ChevronRight, Download, CheckSquare, Square, Package, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type MediaGalleryProps = {
  images: string[];
  videos: string[];
};

const BATCH_SIZE = 20;

export function MediaGallery({ images, videos }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedForDownload, setSelectedForDownload] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [visibleImagesCount, setVisibleImagesCount] = useState(BATCH_SIZE);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleImages = images.slice(0, visibleImagesCount);

  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const defaultTab = hasImages ? "images" : "videos";
  
  const loadMoreImages = useCallback(() => {
    setVisibleImagesCount(prevCount => Math.min(prevCount + BATCH_SIZE, images.length));
  }, [images.length]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleImagesCount < images.length) {
        loadMoreImages();
      }
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreImages, visibleImagesCount, images.length]);


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
  
  const handleDownload = useCallback((url?: string) => {
    const downloadUrl = url || (selectedImage !== null ? images[selectedImage] : null);
    if (!downloadUrl) return;
    window.location.href = `/api/proxy-download?url=${encodeURIComponent(downloadUrl)}`;
  }, [selectedImage, images]);

  const toggleSelection = (url: string) => {
    setSelectedForDownload(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };
  
  const toggleSelectAll = () => {
    // Logic now applies to all images, not just visible ones
    if (selectedForDownload.length === images.length) {
      setSelectedForDownload([]);
    } else {
      setSelectedForDownload(images);
    }
  };

  const handleBulkDownload = async () => {
      if (selectedForDownload.length === 0) return;
      setIsDownloading(true);

      try {
          const response = await fetch('/api/download-zip', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ urls: selectedForDownload }),
          });

          if (!response.ok) {
              throw new Error('Error en la respuesta del servidor al crear el ZIP.');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'media_harvester_archive.zip';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          setSelectedForDownload([]);

      } catch (error) {
          console.error("Error al descargar el ZIP:", error);
      } finally {
          setIsDownloading(false);
      }
  };

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


  const renderMediaItem = (url: string, type: 'image' | 'video', index: number) => {
    const isSelected = type === 'image' && selectedForDownload.includes(url);
    
    return (
        <div
          key={`${type}-${url}-${index}`}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95",
            isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:scale-105 hover:shadow-xl",
          )}
          style={{ animationDelay: `${(index % BATCH_SIZE) * 25}ms` }}
        >
          <div className="absolute top-2 left-2 z-10">
             {type === 'image' && (
                <div 
                  className="w-6 h-6 bg-background/70 backdrop-blur-sm rounded-md flex items-center justify-center cursor-pointer"
                  onClick={() => toggleSelection(url)}
                >
                  <Checkbox 
                      checked={isSelected}
                      className="w-4 h-4"
                  />
                </div>
             )}
          </div>
          
          <div onClick={() => {
              if (type === 'image') {
                  const globalIndex = images.findIndex(imgUrl => imgUrl === url);
                  if (globalIndex !== -1) {
                      setSelectedImage(globalIndex);
                  }
              }
          }} className="w-full h-full cursor-pointer">
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

          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 z-10 h-8 w-8 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-110 hover:text-white opacity-0 group-hover:opacity-100"
            onClick={(e) => { e.stopPropagation(); handleDownload(url); }}
            aria-label="Download"
          >
            <Download className="h-4 w-4"/>
          </Button>
        </div>
      );
  }

  return (
    <>
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
            <div className="flex-1"/>
            <TabsList className="flex-shrink-0">
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
            <div className="flex-1 flex justify-end">
                {hasImages && (
                    <Button onClick={toggleSelectAll} variant="outline">
                        {selectedForDownload.length === images.length ? <CheckSquare className="mr-2" /> : <Square className="mr-2" />}
                        {selectedForDownload.length === images.length ? 'Deseleccionar' : 'Seleccionar Todo'}
                    </Button>
                )}
            </div>
        </div>

        {hasImages && (
          <TabsContent value="images">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {visibleImages.map((url, index) => renderMediaItem(url, 'image', index))}
              </div>
              <div ref={sentinelRef} className="h-10 w-full" />
               {visibleImagesCount < images.length && (
                 <div className="flex justify-center items-center py-4">
                    <LoaderCircle className="animate-spin text-primary" />
                 </div>
               )}
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

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              aria-label="Download image"
            >
              <Download className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X className="h-8 w-8" />
            </Button>
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                aria-label="Next image"
              >
                <ChevronRight className="h-10 w-10" />
              </Button>
            </>
          )}
        </div>
      )}

      {selectedForDownload.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-bottom-10">
          <Card className="shadow-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="font-medium text-sm">
                <span className="font-bold text-primary">{selectedForDownload.length}</span> imágenes seleccionadas
              </p>
              <Button onClick={handleBulkDownload} disabled={isDownloading}>
                {isDownloading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : (
                  <Package className="mr-2" />
                )}
                {isDownloading ? 'Comprimiendo...' : 'Descargar ZIP'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

