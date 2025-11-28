
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, VideoIcon, X, ChevronLeft, ChevronRight, Download, CheckSquare, Square, Package, LoaderCircle, MusicIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type MediaItem = {
  type: 'image' | 'video' | 'audio';
  url: string;
};

type MediaGalleryProps = {
  images: string[];
  videos: string[];
  audios: string[];
};

const BATCH_SIZE = 20;

export function MediaGallery({ images, videos, audios }: MediaGalleryProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [selectedForDownload, setSelectedForDownload] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [visibleCount, setVisibleCount] = useState({ images: BATCH_SIZE, videos: BATCH_SIZE, audios: BATCH_SIZE });
  const [activeTab, setActiveTab] = useState<string>("images");

  const observers = useRef<Record<string, IntersectionObserver | null>>({}).current;
  const sentinels = useRef<Record<string, HTMLDivElement | null>>({}).current;

  const allMedia: MediaItem[] = useMemo(() => [
    ...(images ?? []).map(url => ({ type: 'image' as const, url })),
    ...(videos ?? []).map(url => ({ type: 'video' as const, url })),
    ...(audios ?? []).map(url => ({ type: 'audio' as const, url })),
  ], [images, videos, audios]);
  
  const visibleImages = (images ?? []).slice(0, visibleCount.images);
  const visibleVideos = (videos ?? []).slice(0, visibleCount.videos);
  const visibleAudios = (audios ?? []).slice(0, visibleCount.audios);

  const hasImages = images && images.length > 0;
  const hasVideos = videos && videos.length > 0;
  const hasAudios = audios && audios.length > 0;
  const defaultTab = hasImages ? "images" : hasVideos ? "videos" : "audios";

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const loadMore = useCallback((type: 'images' | 'videos' | 'audios') => {
    const mediaList = type === 'images' ? (images ?? []) : type === 'videos' ? (videos ?? []) : (audios ?? []);
    setVisibleCount(prev => ({
      ...prev,
      [type]: Math.min(prev[type] + BATCH_SIZE, mediaList.length)
    }));
  }, [images, videos, audios]);

  useEffect(() => {
    Object.keys(observers).forEach(key => observers[key]?.disconnect());

    const createObserver = (type: 'images' | 'videos' | 'audios') => {
      const mediaList = type === 'images' ? (images ?? []) : type === 'videos' ? (videos ?? []) : (audios ?? []);
      return new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && visibleCount[type] < mediaList.length) {
          loadMore(type);
        }
      });
    };

    if (hasImages) {
        observers.images = createObserver('images');
        if (sentinels.images) observers.images.observe(sentinels.images);
    }
    if (hasVideos) {
        observers.videos = createObserver('videos');
        if (sentinels.videos) observers.videos.observe(sentinels.videos);
    }
     if (hasAudios) {
        observers.audios = createObserver('audios');
        if (sentinels.audios) observers.audios.observe(sentinels.audios);
    }

    return () => {
      Object.keys(observers).forEach(key => observers[key]?.disconnect());
    };
  }, [loadMore, visibleCount, hasImages, hasVideos, hasAudios, sentinels, observers, images, videos, audios]);


  const closeModal = useCallback(() => {
    setSelectedMediaIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (selectedMediaIndex === null) return;
    setSelectedMediaIndex((prev) => (prev! + 1) % allMedia.length);
  }, [selectedMediaIndex, allMedia.length]);

  const showPrev = useCallback(() => {
    if (selectedMediaIndex === null) return;
    setSelectedMediaIndex((prev) => (prev! - 1 + allMedia.length) % allMedia.length);
  }, [selectedMediaIndex, allMedia.length]);
  
  const handleDownload = useCallback((url?: string) => {
    const downloadUrl = url || (selectedMediaIndex !== null ? allMedia[selectedMediaIndex].url : null);
    if (!downloadUrl) return;
    window.location.href = `/api/proxy-download?url=${encodeURIComponent(downloadUrl)}`;
  }, [selectedMediaIndex, allMedia]);

  const toggleSelection = (url: string) => {
    setSelectedForDownload(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };
  
  const toggleSelectAll = () => {
    const currentMediaUrls = activeTab === 'images' ? (images ?? []) : activeTab === 'videos' ? (videos ?? []) : (audios ?? []);
    
    const allSelectedInTab = currentMediaUrls.length > 0 && currentMediaUrls.every(url => selectedForDownload.includes(url));

    if (allSelectedInTab) {
      // Deselect all media of the current tab
      setSelectedForDownload(prev => prev.filter(url => !currentMediaUrls.includes(url)));
    } else {
      // Select all media of the current tab, preserving selections from other tabs
      const newSelection = [...new Set([...selectedForDownload, ...currentMediaUrls])];
      setSelectedForDownload(newSelection);
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
      if (selectedMediaIndex === null) return;

      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMediaIndex, closeModal, showNext, showPrev]);

  const openModal = (type: 'image' | 'video' | 'audio', url: string) => {
    const index = allMedia.findIndex(item => item.type === type && item.url === url);
    if (index !== -1) {
      setSelectedMediaIndex(index);
    }
  };

  const selectedMedia = selectedMediaIndex !== null ? allMedia[selectedMediaIndex] : null;

  const renderMediaItem = (url: string, type: 'image' | 'video' | 'audio', index: number) => {
    const isSelected = selectedForDownload.includes(url);
    
    if (type === 'audio') {
        return (
            <Card key={`audio-${url}-${index}`} className={cn("group w-full animate-in fade-in zoom-in-95", isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background")}>
                <CardContent className="p-4 flex items-center gap-4">
                     <div 
                        className="w-6 h-6 bg-background/70 backdrop-blur-sm rounded-md flex items-center justify-center cursor-pointer"
                        onClick={() => toggleSelection(url)}
                        >
                        <Checkbox checked={isSelected} className="w-4 h-4"/>
                    </div>
                    <audio src={url} controls className="w-full" />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-110 hover:text-white"
                        onClick={(e) => { e.stopPropagation(); handleDownload(url); }}
                        aria-label="Download"
                    >
                        <Download className="h-4 w-4"/>
                    </Button>
                </CardContent>
            </Card>
        )
    }
    
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
                <div 
                  className="w-6 h-6 bg-background/70 backdrop-blur-sm rounded-md flex items-center justify-center cursor-pointer"
                  onClick={() => toggleSelection(url)}
                >
                  <Checkbox 
                      checked={isSelected}
                      className="w-4 h-4"
                  />
                </div>
          </div>
          
          <div onClick={() => openModal(type, url)} className="w-full h-full cursor-pointer">
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
                muted
                loop
                playsInline
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
  
  const currentMediaUrls = activeTab === 'images' ? (images ?? []) : activeTab === 'videos' ? (videos ?? []) : (audios ?? []);
  const isAllSelected = currentMediaUrls.length > 0 && currentMediaUrls.every(url => selectedForDownload.includes(url));

  return (
    <>
      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex-1 flex justify-start">
               {(hasImages || hasVideos || hasAudios) && (
                 <Button onClick={toggleSelectAll} variant="outline" size="sm">
                    {isAllSelected ? <CheckSquare className="mr-2" /> : <Square className="mr-2" />}
                    {isAllSelected ? 'Deseleccionar' : 'Seleccionar Todo'}
                </Button>
               )}
            </div>
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
                {hasAudios && (
                    <TabsTrigger value="audios">
                        <MusicIcon className="mr-2 h-4 w-4" />
                        Audios
                        <Badge variant="secondary" className="ml-2">{audios.length}</Badge>
                    </TabsTrigger>
                )}
            </TabsList>
            <div className="flex-1" />
        </div>

        {hasImages && (
          <TabsContent value="images" forceMount={true} className={cn(activeTab !== "images" && "hidden")}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {visibleImages.map((url, index) => renderMediaItem(url, 'image', index))}
              </div>
              <div ref={(el) => sentinels.images = el} className="h-10 w-full" />
               {visibleCount.images < (images ?? []).length && (
                 <div className="flex justify-center items-center py-4">
                    <LoaderCircle className="animate-spin text-primary" />
                 </div>
               )}
          </TabsContent>
        )}

        {hasVideos && (
          <TabsContent value="videos" forceMount={true} className={cn(activeTab !== "videos" && "hidden")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleVideos.map((url, index) => renderMediaItem(url, 'video', index))}
              </div>
              <div ref={(el) => sentinels.videos = el} className="h-10 w-full" />
               {visibleCount.videos < (videos ?? []).length && (
                 <div className="flex justify-center items-center py-4">
                    <LoaderCircle className="animate-spin text-primary" />
                 </div>
               )}
          </TabsContent>
        )}

         {hasAudios && (
          <TabsContent value="audios" forceMount={true} className={cn(activeTab !== "audios" && "hidden")}>
              <div className="flex flex-col gap-4">
                  {visibleAudios.map((url, index) => renderMediaItem(url, 'audio', index))}
              </div>
               <div ref={(el) => sentinels.audios = el} className="h-10 w-full" />
               {visibleCount.audios < (audios ?? []).length && (
                 <div className="flex justify-center items-center py-4">
                    <LoaderCircle className="animate-spin text-primary" />
                 </div>
               )}
          </TabsContent>
        )}
      </Tabs>
      
      {selectedMedia !== null && (
        <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-in fade-in"
            onClick={closeModal}
        >
          <div className="relative w-full h-full p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
                <Image
                    src={selectedMedia.url}
                    alt={`Selected media ${selectedMediaIndex! + 1}`}
                    fill
                    className="object-contain"
                />
            ) : selectedMedia.type === 'video' ? (
                <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-h-full max-w-full m-auto"
                />
            ) : selectedMedia.type === 'audio' ? (
                 <div className="flex items-center justify-center w-full h-full">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 flex flex-col items-center gap-4">
                            <MusicIcon className="w-24 h-24 text-primary" />
                            <audio src={selectedMedia.url} controls autoPlay className="w-full" />
                        </CardContent>
                    </Card>
                 </div>
            ) : null}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              aria-label="Download media"
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

          {allMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous media"
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next media"
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
                <span className="font-bold text-primary">{selectedForDownload.length}</span> archivos seleccionados
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

    