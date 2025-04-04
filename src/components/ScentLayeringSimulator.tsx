
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Download, Layers } from 'lucide-react';
import OptimizedImage from './ui/optimized-image';

type ScentLayer = {
  id: string;
  name: string;
  imageUrl: string;
  intensity: number;
  notes: string[];
};

interface ScentLayeringSimulatorProps {
  availableScents: {
    id: string;
    name: string;
    imageUrl: string;
    notes: string[];
  }[];
}

const ScentLayeringSimulator = ({ availableScents }: ScentLayeringSimulatorProps) => {
  const [layers, setLayers] = useState<ScentLayer[]>([]);
  const [combinationName, setCombinationName] = useState('My Scent Combination');

  // Add a scent to the layering combination
  const addLayer = (scentId: string) => {
    const scent = availableScents.find(s => s.id === scentId);
    if (!scent) return;
    
    const newLayer: ScentLayer = {
      id: `${scent.id}-${Date.now()}`,
      name: scent.name,
      imageUrl: scent.imageUrl,
      intensity: 50, // Default intensity
      notes: scent.notes
    };
    
    setLayers([...layers, newLayer]);
  };

  // Remove a layer by its ID
  const removeLayer = (layerId: string) => {
    setLayers(layers.filter(layer => layer.id !== layerId));
  };

  // Update a layer's intensity
  const updateLayerIntensity = (layerId: string, intensity: number) => {
    setLayers(
      layers.map(layer => 
        layer.id === layerId ? { ...layer, intensity } : layer
      )
    );
  };

  // Calculate combined notes profile based on layers and their intensities
  const getCombinedProfile = () => {
    // In a real app, this would use a more sophisticated algorithm
    const notesProfile: Record<string, number> = {};
    
    layers.forEach(layer => {
      const intensityFactor = layer.intensity / 100;
      
      layer.notes.forEach(note => {
        if (!notesProfile[note]) {
          notesProfile[note] = 0;
        }
        notesProfile[note] += intensityFactor;
      });
    });
    
    // Normalize values to be between 0 and 1
    const maxValue = Math.max(...Object.values(notesProfile), 1);
    Object.keys(notesProfile).forEach(note => {
      notesProfile[note] = notesProfile[note] / maxValue;
    });
    
    return notesProfile;
  };

  const combinedProfile = getCombinedProfile();
  const topNotes = Object.entries(combinedProfile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Save the combination (in a real app would save to DB)
  const saveCombination = () => {
    // This would connect to backend in a real app
    console.log('Saving combination:', {
      name: combinationName,
      layers,
      profile: combinedProfile
    });
    
    // For now just show an alert
    alert(`Combination "${combinationName}" saved!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Scent Layering Studio</CardTitle>
          <CardDescription>
            Create unique fragrance combinations by layering different scents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="combination-name" className="block text-sm font-medium mb-1">
              Combination Name
            </label>
            <Input
              id="combination-name"
              value={combinationName}
              onChange={(e) => setCombinationName(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Scents</h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {availableScents.map(scent => (
                  <Card key={scent.id} className="overflow-hidden">
                    <OptimizedImage
                      src={scent.imageUrl}
                      alt={scent.name}
                      width={200}
                      height={200}
                      className="w-full h-24 object-cover"
                    />
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate">{scent.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scent.notes.slice(0, 2).map(note => (
                          <span
                            key={note}
                            className="text-xs px-1.5 py-0.5 bg-secondary rounded-full"
                          >
                            {note}
                          </span>
                        ))}
                        {scent.notes.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{scent.notes.length - 2} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => addLayer(scent.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Combination</h3>
              {layers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg border-muted p-4 text-center">
                  <Layers className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Add scents to create your custom fragrance combination
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {layers.map((layer, index) => (
                    <Card key={layer.id}>
                      <div className="flex items-center p-3">
                        <OptimizedImage
                          src={layer.imageUrl}
                          alt={layer.name}
                          width={60}
                          height={60}
                          className="rounded-md mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{layer.name}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => removeLayer(layer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-muted-foreground w-16">
                              Intensity: {layer.intensity}%
                            </p>
                            <Slider
                              value={[layer.intensity]}
                              min={10}
                              max={100}
                              step={5}
                              onValueChange={([value]) => updateLayerIntensity(layer.id, value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {layers.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Resulting Profile</h4>
                  <div className="space-y-2">
                    {topNotes.map(([note, strength]) => (
                      <div key={note} className="flex items-center justify-between">
                        <span className="text-sm">{note}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${strength * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button variant="outline" disabled={layers.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button disabled={layers.length === 0} onClick={saveCombination}>
            Save Combination
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScentLayeringSimulator;
