
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoDemoProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  description?: string;
  className?: string;
}

const VideoDemo = ({
  videoUrl,
  title,
  thumbnail,
  description,
  className = '',
}: VideoDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = 
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const percentage = clickPosition / progressBar.clientWidth;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Overlay controls */}
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 hover:opacity-100 transition-opacity">
          <div className="p-4">
            <h3 className="font-serif text-white text-lg drop-shadow-md">{title}</h3>
            {description && (
              <p className="text-white/80 text-sm mt-1 drop-shadow-md">{description}</p>
            )}
          </div>
          
          <div className="p-2">
            {/* Progress bar */}
            <div 
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleFullscreen}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Large play button in center when paused */}
        {!isPlaying && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-primary/80 text-primary-foreground hover:bg-primary/90"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8" />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default VideoDemo;
