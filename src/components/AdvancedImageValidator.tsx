
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import OptimizedImage from '@/components/ui/optimized-image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateImagePath, checkPublicImage } from '@/lib/image/imageValidator';
import { processImageUrl } from '@/lib/image/imageUrlProcessor';

export default function AdvancedImageValidator() {
  const [imagePath, setImagePath] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message?: string;
    optimizedPath?: string;
  }>({ status: 'idle' });
  
  const validateImage = async () => {
    if (!imagePath) return;
    
    setIsValidating(true);
    setValidationResult({ status: 'validating' });
    
    try {
      // Test using require-style path if applicable
      let pathToTest = imagePath;
      
      // Handle if user entered a require syntax
      if (imagePath.includes('require(')) {
        const requireMatch = imagePath.match(/require\(['"](.+?)['"]\)/);
        if (requireMatch && requireMatch[1]) {
          pathToTest = requireMatch[1];
        }
      }
      
      // Handle if user entered import.meta.url syntax
      if (imagePath.includes('import.meta.url')) {
        const urlMatch = imagePath.match(/new URL\(['"](.+?)['"], import\.meta\.url\)/);
        if (urlMatch && urlMatch[1]) {
          pathToTest = urlMatch[1];
        }
      }
      
      // Check if it's in public directory
      const isPublic = pathToTest.startsWith('/') || pathToTest.startsWith('./');
      
      if (isPublic) {
        const exists = await checkPublicImage(pathToTest);
        if (exists) {
          const optimizedPath = await processImageUrl(pathToTest);
          setValidationResult({
            status: 'valid',
            message: 'Image exists in public directory',
            optimizedPath
          });
        } else {
          setValidationResult({
            status: 'invalid',
            message: 'Image not found in public directory'
          });
        }
      } else {
        // Handle remote URLs
        const isValid = await validateImagePath(pathToTest);
        if (isValid) {
          const optimizedPath = await processImageUrl(pathToTest);
          setValidationResult({
            status: 'valid',
            message: 'Remote image exists and is accessible',
            optimizedPath
          });
        } else {
          setValidationResult({
            status: 'invalid',
            message: 'Remote image is not accessible or does not exist'
          });
        }
      }
    } catch (error) {
      console.error('Image validation error:', error);
      setValidationResult({
        status: 'invalid',
        message: `Error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const examples = [
    "https://i.imgur.com/Py9i90Y.jpg",
    "/images/chanel-no5.jpg",
    "require('../public/images/chanel-no5.jpg')",
    "new URL('./images/dior.jpg', import.meta.url)"
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Image Validator</CardTitle>
        <CardDescription>
          Test image paths with support for require() and import.meta.url syntax
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="image-path" className="text-sm font-medium">
            Image Path or URL
          </label>
          <div className="flex space-x-2">
            <Input
              id="image-path"
              placeholder="Enter image path, URL, or require() syntax"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={validateImage} 
              disabled={isValidating || !imagePath}
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setImagePath(example)}
                >
                  {example.length > 30 ? example.substring(0, 30) + '...' : example}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {validationResult.status !== 'idle' && (
          <Alert variant={validationResult.status === 'valid' ? 'default' : validationResult.status === 'validating' ? 'default' : 'destructive'}>
            <AlertTitle>
              {validationResult.status === 'valid' 
                ? 'Image is Valid' 
                : validationResult.status === 'validating' 
                  ? 'Validating...' 
                  : 'Image is Invalid'}
            </AlertTitle>
            <AlertDescription>
              {validationResult.message}
            </AlertDescription>
          </Alert>
        )}
        
        {validationResult.status === 'valid' && validationResult.optimizedPath && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="aspect-square w-48 mx-auto">
                <OptimizedImage 
                  src={validationResult.optimizedPath} 
                  alt="Validated image preview"
                  width={192}
                  height={192}
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Optimized path: {validationResult.optimizedPath}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
