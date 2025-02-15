"use client"
import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Button } from "../../ui/button";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Changed to false
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="group relative aspect-video w-full rounded-xl bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src="/devxp.mp4"
        muted
        loop
        playsInline
        className="h-full w-full rounded-xl object-cover"
      />

      {/* Overlay for better button visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
            <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>
        </div>

        {/* Right controls */}
        <div>
          <Button
            onClick={replayVideo}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 text-white" />
            <span className="sr-only">Replay</span>
          </Button>
        </div>
      </div>
    </div>
  );
}