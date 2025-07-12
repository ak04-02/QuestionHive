import React, { useState, useEffect } from "react";

interface Spline3DModelProps {
  sceneUrl: string;
}

const Spline3DModel: React.FC<Spline3DModelProps> = ({ sceneUrl }) => {
  const [canEmbed, setCanEmbed] = useState(true);

  useEffect(() => {
    // Simple check to detect if iframe can load the URL
    const iframe = document.createElement("iframe");
    iframe.src = sceneUrl;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const timer = setTimeout(() => {
      document.body.removeChild(iframe);
      setCanEmbed(true); // Assume true after timeout
    }, 3000);

    iframe.onerror = () => {
      clearTimeout(timer);
      document.body.removeChild(iframe);
      setCanEmbed(false);
    };

    return () => {
      clearTimeout(timer);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };
  }, [sceneUrl]);

  if (!canEmbed) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        <p>Unable to load 3D model. Please check the Spline scene URL or permissions.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={sceneUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        allow="fullscreen; vr"
        className="rounded-lg"
        title="Spline 3D Model"
      />
    </div>
  );
};

export default Spline3DModel;
