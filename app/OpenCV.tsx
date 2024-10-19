// OpenCV.js hook file (OpenCV.js)
import { useEffect, useState } from 'react';

const useOpenCV = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If OpenCV is already loaded and ready, set isReady to true
    if (window.cv && window.cv['onRuntimeInitialized']) {
      setIsReady(true);
      return;
    }

    // Check if the script is already added to the document
    let script = document.getElementById('opencvjs') as HTMLScriptElement | null;

    if (script) {
      // If script exists but OpenCV is not ready, wait for it
      if (window.cv && window.cv['onRuntimeInitialized']) {
        setIsReady(true);
      } else {
        // Wait for OpenCV to initialize
        window.cv = window.cv || {};
        window.cv['onRuntimeInitialized'] = () => {
          setIsReady(true);
        };
      }
    } else {
      // Load opencv.js script
      script = document.createElement('script');
      script.id = 'opencvjs';
      script.src = '/opencv.js';
      script.async = true;
      script.onload = () => {
        // Wait for OpenCV to initialize
        window.cv = window.cv || {};
        window.cv['onRuntimeInitialized'] = () => {
          setIsReady(true);
        };
      };
      document.body.appendChild(script);
    }

    // Do not remove the script tag on unmount

  }, []);

  return isReady;
};

export default useOpenCV;
