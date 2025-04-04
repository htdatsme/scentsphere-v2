
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Rotate3D, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ProductViewer3DProps {
  modelPath: string;
  fallbackImageUrl: string;
  alt: string;
  className?: string;
}

const ProductViewer3D = ({ 
  modelPath, 
  fallbackImageUrl, 
  alt, 
  className = '' 
}: ProductViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [is3DSupported, setIs3DSupported] = useState(false);

  // Check if browser supports 3D rendering
  useEffect(() => {
    // This is a very basic check - in a real app, you'd check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIs3DSupported(!!gl);
  }, []);

  // Handle mouse/touch events for 3D manipulation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    
    setRotation({
      x: rotation.x + dy * 0.5,
      y: rotation.y + dx * 0.5
    });
    
    setStartPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // For now, we'll display a placeholder and controls - in a real app you would
  // integrate with Three.js or a similar 3D library
  return (
    <div 
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden bg-muted ${className}`}
      style={{ 
        perspective: '1200px' 
      }}
    >
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing"
      >
        {is3DSupported ? (
          <div 
            className="w-full h-full transition-transform duration-300"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`
            }}
          >
            {/* This is where a real 3D model would be rendered */}
            <img 
              src={fallbackImageUrl} 
              alt={alt} 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="bg-background/80 p-2 rounded-md text-sm">
                3D viewer placeholder (would use Three.js in production)
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={fallbackImageUrl} 
              alt={alt} 
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground bg-background/80 py-1">
              3D viewing not supported in your browser
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => setRotation({ x: 0, y: 0 })}
          title="Reset view"
        >
          <Rotate3D className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handleZoomIn}
          title="Zoom in"
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handleZoomOut}
          title="Zoom out"
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductViewer3D;
