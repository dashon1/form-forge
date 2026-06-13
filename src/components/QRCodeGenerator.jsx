import React, { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

export default function QRCodeGenerator({ url, title }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (url && canvasRef.current) {
      generateQRCode();
    }
  }, [url]);

  const generateQRCode = () => {
    // Simple QR code generation using a free API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const padding = 40;
      const qrSize = canvas.width - (padding * 2);
      ctx.drawImage(img, padding, padding, qrSize, qrSize);
      
      // Add title
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(title || 'Scan to access form', canvas.width / 2, 25);
    };
    img.src = qrApiUrl;
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${title || 'form'}-qr-code.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas 
        ref={canvasRef} 
        width={350} 
        height={350}
        className="neu-card rounded-xl"
      />
      <button
        onClick={downloadQRCode}
        className="neu-button px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <Download className="w-4 h-4" />
        <span>Download QR Code</span>
      </button>
    </div>
  );
}