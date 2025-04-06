
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { processImageUrl, processImageUrlSync } from '@/lib/image/imageUrlProcessor';
import { brandFallbacks, genericFallbacks } from '@/lib/image/fallbackStrategy';
import { extractBrandName } from '@/lib/image/fallbackStrategy';
import { useToast } from '@/hooks/use-toast';

interface ImageDiagnosticsLogEntry {
  originalSrc: string;
  processedSrc: string;
  alt: string;
  brandName?: string;
  loaded: boolean;
  fallbacksAttempted: string[];
  loadTime?: number;
  timestamp: number;
}

interface ImageDiagnosticsProps {
  onClose?: () => void;
}

export default function ImageDiagnostics({ onClose }: ImageDiagnosticsProps) {
  const [logEntries, setLogEntries] = useState<ImageDiagnosticsLogEntry[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activeTestUrl, setActiveTestUrl] = useState<string>('');
  const [testResults, setTestResults] = useState<{
    url: string;
    success: boolean;
    time?: number;
  }[]>([]);
  const { toast } = useToast();
  
  const logRef = useRef<ImageDiagnosticsLogEntry[]>([]);
  
  useEffect(() => {
    // Start collecting logs by intercepting image loading
    const originalFetch = window.fetch;
    const originalCreateElement = document.createElement;
    const uniqueImageUrls = new Set<string>();
    
    // Collect image URLs from DOM
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.startsWith('data:')) {
        uniqueImageUrls.add(img.src);
      }
    });
    
    // Collect from CSS background images
    Array.from(document.styleSheets).forEach(styleSheet => {
      try {
        Array.from(styleSheet.cssRules).forEach(rule => {
          const cssText = rule.cssText;
          const urlMatch = cssText.match(/url\(['"]?([^'"]+)['"]?\)/g);
          if (urlMatch) {
            urlMatch.forEach(match => {
              const url = match.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
              if (!url.startsWith('data:')) {
                uniqueImageUrls.add(url);
              }
            });
          }
        });
      } catch (e) {
        // Ignore CORS errors for external stylesheets
      }
    });
    
    setImageUrls(Array.from(uniqueImageUrls));
    
    // Monitor image loading
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG') {
            const img = node as HTMLImageElement;
            const startTime = performance.now();
            const brandName = extractBrandName(img.alt);
            
            // Use sync version to avoid Promise issues
            const processedSrc = processImageUrlSync(img.src, brandName);
            
            const entry: ImageDiagnosticsLogEntry = {
              originalSrc: img.src,
              processedSrc: processedSrc,
              alt: img.alt,
              brandName,
              loaded: false,
              fallbacksAttempted: [],
              timestamp: Date.now()
            };
            
            const entryIndex = logRef.current.length;
            logRef.current.push(entry);
            setLogEntries([...logRef.current]);
            
            img.addEventListener('load', () => {
              const loadTime = performance.now() - startTime;
              logRef.current[entryIndex].loaded = true;
              logRef.current[entryIndex].loadTime = loadTime;
              setLogEntries([...logRef.current]);
            });
            
            img.addEventListener('error', () => {
              if (!logRef.current[entryIndex].fallbacksAttempted) {
                logRef.current[entryIndex].fallbacksAttempted = [];
              }
              
              // Record fallback attempt
              const newSrc = img.src;
              logRef.current[entryIndex].fallbacksAttempted.push(newSrc);
              setLogEntries([...logRef.current]);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      observer.disconnect();
      window.fetch = originalFetch;
      document.createElement = originalCreateElement;
    };
  }, []);
  
  const testImageUrl = (url: string) => {
    setActiveTestUrl(url);
    const img = new Image();
    const startTime = performance.now();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setTestResults(prev => [
        ...prev, 
        { url, success: true, time: loadTime }
      ]);
      setActiveTestUrl('');
    };
    
    img.onerror = () => {
      setTestResults(prev => [
        ...prev, 
        { url, success: false }
      ]);
      setActiveTestUrl('');
    };
    
    img.src = url;
  };
  
  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalImages: logEntries.length,
        loadedSuccessfully: logEntries.filter(entry => entry.loaded).length,
        failedToLoad: logEntries.filter(entry => !entry.loaded).length,
        averageLoadTime: logEntries.reduce((acc, entry) => acc + (entry.loadTime || 0), 0) / logEntries.filter(entry => entry.loadTime).length
      },
      imageDetails: logEntries,
      fallbacksConfig: {
        brandFallbacks: Object.keys(brandFallbacks).length,
        genericFallbacks: genericFallbacks.length
      },
      testResults
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-diagnostics-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Diagnostics Report Generated",
      description: "The image diagnostics report has been downloaded to your device."
    });
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Image Loading Diagnostics</CardTitle>
        <CardDescription>
          Analyze and troubleshoot image loading issues across the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Total Images</p>
              <p className="text-2xl font-bold">{logEntries.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Loaded Successfully</p>
              <p className="text-2xl font-bold text-green-500">{logEntries.filter(entry => entry.loaded).length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Failed to Load</p>
              <p className="text-2xl font-bold text-red-500">{logEntries.filter(entry => !entry.loaded).length}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Test Image Loading</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter image URL to test" 
              value={activeTestUrl}
              onChange={e => setActiveTestUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && testImageUrl(activeTestUrl)}
            />
            <Button onClick={() => testImageUrl(activeTestUrl)} disabled={!activeTestUrl}>
              Test
            </Button>
          </div>
          
          {testResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Test Results</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {testResults.map((result, i) => (
                  <div key={i} className={`p-2 rounded-md ${result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    <p className="text-sm truncate">{result.url}</p>
                    <div className="flex justify-between">
                      <span className={`text-xs ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {result.success ? 'Loaded' : 'Failed'}
                      </span>
                      {result.time && (
                        <span className="text-xs text-muted-foreground">
                          {result.time.toFixed(0)}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Detected Images</h3>
          <div className="max-h-40 overflow-y-auto">
            <ul className="space-y-1">
              {imageUrls.map((url, i) => (
                <li key={i} className="text-xs truncate hover:text-clip hover:whitespace-normal">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 mr-2"
                    onClick={() => testImageUrl(url)}
                  >
                    Test
                  </Button>
                  {url}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Image Loading Log</h3>
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-xs">Image</th>
                  <th className="text-left p-2 text-xs">Alt</th>
                  <th className="text-left p-2 text-xs">Brand</th>
                  <th className="text-left p-2 text-xs">Status</th>
                  <th className="text-left p-2 text-xs">Load Time</th>
                </tr>
              </thead>
              <tbody>
                {logEntries.map((entry, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-2 bg-muted relative overflow-hidden">
                          {entry.loaded ? (
                            <img 
                              src={entry.processedSrc} 
                              alt={entry.alt} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">✕</div>
                          )}
                        </div>
                        <span className="truncate max-w-[150px]" title={entry.originalSrc}>
                          {entry.originalSrc}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-xs truncate max-w-[100px]" title={entry.alt}>
                      {entry.alt || <span className="text-muted-foreground italic">No alt text</span>}
                    </td>
                    <td className="p-2 text-xs">
                      {entry.brandName || <span className="text-muted-foreground italic">Unknown</span>}
                    </td>
                    <td className="p-2 text-xs">
                      <span className={`px-2 py-1 rounded-full text-xs ${entry.loaded ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {entry.loaded ? 'Loaded' : 'Failed'}
                      </span>
                    </td>
                    <td className="p-2 text-xs">
                      {entry.loadTime ? `${entry.loadTime.toFixed(0)}ms` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={generateReport}>Generate Report</Button>
      </CardFooter>
    </Card>
  );
}
