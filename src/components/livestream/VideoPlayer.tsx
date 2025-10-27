import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Text, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface Overlay {
  id: string;
  type: string;
  content?: string;
  image_url?: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  font_size?: number;
  color?: string;
}

interface VideoPlayerProps {
  streamUrl: string;
  overlays: Overlay[];
}

export const VideoPlayer = ({ streamUrl, overlays }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 450,
      backgroundColor: "#000000",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#000000";

    overlays.forEach((overlay) => {
      if (overlay.type === "text" && overlay.content) {
        const text = new Text(overlay.content, {
          left: overlay.position_x,
          top: overlay.position_y,
          fontSize: overlay.font_size || 16,
          fill: overlay.color || "#ffffff",
        });
        fabricCanvas.add(text);
      } else if (overlay.type === "logo" || overlay.type === "image") {
        if (overlay.image_url) {
          FabricImage.fromURL(overlay.image_url).then((img) => {
            img.set({
              left: overlay.position_x,
              top: overlay.position_y,
              scaleX: overlay.width / (img.width || 1),
              scaleY: overlay.height / (img.height || 1),
            });
            fabricCanvas.add(img);
            fabricCanvas.renderAll();
          });
        }
      }
    });

    fabricCanvas.renderAll();
  }, [overlays, fabricCanvas]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        toast.error("Unable to play stream. Please check the RTSP URL.");
      });
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={streamUrl}
          onError={() => toast.error("Stream error. RTSP may need HLS conversion.")}
        >
          Your browser does not support the video tag.
        </video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleMuteToggle}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground p-4 bg-card rounded-lg">
        <p className="font-semibold mb-2">Note about RTSP streaming:</p>
        <p>
          RTSP streams need to be converted to HLS/DASH format for web playback. 
          For testing, you can use services like RTSP.me or convert your RTSP stream 
          using FFmpeg to HLS format.
        </p>
      </div>
    </div>
  );
};
