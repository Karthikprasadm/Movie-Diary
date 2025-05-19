import React from 'react';
import { Button } from "@/components/ui/button";

export default function Temp() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Download Project Files</h1>
      <p className="mb-4">Click the button below to download the complete project code:</p>
      
      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => {
          window.location.href = '/download/movie_tracker_app.zip';
        }}
      >
        Download Project ZIP
      </Button>
    </div>
  );
}