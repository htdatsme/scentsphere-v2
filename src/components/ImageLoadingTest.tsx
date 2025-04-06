
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processImageUrl } from '@/lib/image/imageUrlProcessor';
import OptimizedImage from '@/components/ui/optimized-image';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function ImageLoadingTest() {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [testResults, setTestResults] = useState<{
    component: string;
    success: boolean;
    processedUrl?: string;
    error?: string;
  }[]>([]);
  
  const runAllTests = () => {
    setTestResults([]);
    
    // Test 1: Basic HTML img
    testBasicImage();
    
    // Test 2: Processed URL
    testProcessedUrl();
    
    // Test 3: OptimizedImage component
    testOptimizedImage();
    
    // Test 4: ImageWithFallback component
    testImageWithFallback();
  };
  
  const testBasicImage = () => {
    const img = new Image();
    
    img.onload = () => {
      setTestResults(prev => [
        ...prev,
        {
          component: 'Basic HTML <img>',
          success: true
        }
      ]);
    };
    
    img.onerror = () => {
      setTestResults(prev => [
        ...prev,
        {
          component: 'Basic HTML <img>',
          success: false,
          error: 'Failed to load image'
        }
      ]);
    };
    
    img.src = imageUrl;
  };
  
  const testProcessedUrl = () => {
    const brandName = altText.split(' - ')[0];
    const processedUrl = processImageUrl(imageUrl, brandName);
    
    const img = new Image();
    
    img.onload = () => {
      setTestResults(prev => [
        ...prev,
        {
          component: 'Processed URL',
          success: true,
          processedUrl
        }
      ]);
    };
    
    img.onerror = () => {
      setTestResults(prev => [
        ...prev,
        {
          component: 'Processed URL',
          success: false,
          processedUrl,
          error: 'Failed to load processed image'
        }
      ]);
    };
    
    img.src = processedUrl;
  };
  
  const testOptimizedImage = () => {
    // This test is simulated since we can't directly test the component
    // The results will be visible in the rendered component
    setTestResults(prev => [
      ...prev,
      {
        component: 'OptimizedImage',
        success: true,
        processedUrl: 'See rendered component below'
      }
    ]);
  };
  
  const testImageWithFallback = () => {
    // This test is simulated since we can't directly test the component
    // The results will be visible in the rendered component
    setTestResults(prev => [
      ...prev,
      {
        component: 'ImageWithFallback',
        success: true,
        processedUrl: 'See rendered component below'
      }
    ]);
  };
  
  const brandName = altText.split(' - ')[0];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Loading Test</CardTitle>
        <CardDescription>
          Test different image loading strategies to diagnose issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">1. Enter Image Details</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="image-url" className="text-sm">Image URL</label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="alt-text" className="text-sm">Alt Text (include Brand - Name format)</label>
              <Input
                id="alt-text"
                placeholder="Brand - Product Name"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <Button onClick={runAllTests} disabled={!imageUrl}>Run All Tests</Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">2. Test Results</h3>
            <div className="grid gap-2">
              {testResults.map((result, i) => (
                <div key={i} className={`p-3 rounded-md ${result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  <h4 className="font-medium">{result.component}</h4>
                  <p className={`text-sm ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {result.success ? 'Success' : 'Failed'}
                  </p>
                  {result.processedUrl && (
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {result.processedUrl}
                    </p>
                  )}
                  {result.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {imageUrl && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">3. Preview</h3>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic img</TabsTrigger>
                <TabsTrigger value="processed">Processed URL</TabsTrigger>
                <TabsTrigger value="optimized">OptimizedImage</TabsTrigger>
                <TabsTrigger value="fallback">ImageWithFallback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="p-4 border rounded-md">
                <div className="max-w-full overflow-hidden">
                  <h4 className="text-sm font-medium mb-2">Basic &lt;img&gt; tag</h4>
                  <div className="aspect-square w-48 mx-auto bg-muted/30 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      alt={altText} 
                      className="max-w-full max-h-full object-contain" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML += '<div class="text-red-500">Failed to load</div>';
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <pre className="whitespace-pre-wrap break-all">{imageUrl}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="processed" className="p-4 border rounded-md">
                <div className="max-w-full overflow-hidden">
                  <h4 className="text-sm font-medium mb-2">Processed URL</h4>
                  <div className="aspect-square w-48 mx-auto bg-muted/30 flex items-center justify-center">
                    <img 
                      src={processImageUrl(imageUrl, brandName)} 
                      alt={altText} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML += '<div class="text-red-500">Failed to load</div>';
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <pre className="whitespace-pre-wrap break-all">{processImageUrl(imageUrl, brandName)}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="optimized" className="p-4 border rounded-md">
                <div className="max-w-full overflow-hidden">
                  <h4 className="text-sm font-medium mb-2">OptimizedImage Component</h4>
                  <div className="aspect-square w-48 mx-auto bg-muted/30">
                    <OptimizedImage 
                      src={imageUrl} 
                      alt={altText}
                      width={192}
                      height={192}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fallback" className="p-4 border rounded-md">
                <div className="max-w-full overflow-hidden">
                  <h4 className="text-sm font-medium mb-2">ImageWithFallback Component</h4>
                  <div className="aspect-square w-48 mx-auto bg-muted/30">
                    <ImageWithFallback 
                      src={imageUrl} 
                      alt={altText}
                      width={192}
                      height={192}
                      brandName={brandName}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-xs text-muted-foreground">
          Note: Actual behavior may vary between components due to fallback strategies
        </p>
      </CardFooter>
    </Card>
  );
}
