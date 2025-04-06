
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ImageDiagnostics from "@/components/ImageDiagnostics";
import ImageLoadingTest from "@/components/ImageLoadingTest";
import { Link } from "react-router-dom";

export default function ImageDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState("diagnostics");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Image Diagnostics Tools</h1>
            <p className="text-muted-foreground">
              Analyze and troubleshoot image loading issues in your application
            </p>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="diagnostics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagnostics">Image Diagnostics</TabsTrigger>
              <TabsTrigger value="testing">Image Testing</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="diagnostics">
                <ImageDiagnostics />
              </TabsContent>
              
              <TabsContent value="testing">
                <ImageLoadingTest />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
