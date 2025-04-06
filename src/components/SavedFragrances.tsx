
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Fragrance } from "@/lib/store";

export function SavedFragrances() {
  const { savedFragrances, loading, removeFragrance } = useUserProfile();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-800"></div>
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (savedFragrances.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">No saved fragrances yet</h3>
              <p className="text-muted-foreground mt-1">
                Your saved fragrances will appear here
              </p>
            </div>
            <Button asChild>
              <Link to="/results">Browse fragrances</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedFragrances.map((fragrance) => (
        <FragranceCard
          key={fragrance.id}
          fragrance={fragrance}
          onRemove={() => removeFragrance(fragrance.id)}
        />
      ))}
    </div>
  );
}

function FragranceCard({ fragrance, onRemove }: { fragrance: Fragrance; onRemove: () => void }) {
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={fragrance.imageUrl} 
          alt={fragrance.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
        <CardDescription>{fragrance.brand}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="font-medium">${fragrance.price}</span>
          <FragranceDetailsDialog fragrance={fragrance} />
        </div>
      </CardContent>
    </Card>
  );
}

function FragranceDetailsDialog({ fragrance }: { fragrance: Fragrance }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif">{fragrance.name}</DialogTitle>
          <DialogDescription>{fragrance.brand}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <img 
              src={fragrance.imageUrl} 
              alt={fragrance.name} 
              className="col-span-4 aspect-square object-cover rounded-md"
            />
          </div>
          <div>
            <h4 className="font-medium mb-1">Price</h4>
            <p>${fragrance.price}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Rating</h4>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{fragrance.rating}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {fragrance.description || "No description available."}
            </p>
          </div>
          {fragrance.notes && (
            <div>
              <h4 className="font-medium mb-1">Notes</h4>
              <div className="flex flex-wrap gap-1">
                {fragrance.notes.map((note, i) => (
                  <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import Link at the top
import { Link } from "react-router-dom";
