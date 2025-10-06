import { useState } from 'react';
import { X, ZoomIn, ZoomOut, Printer, Share2, Download, RotateCw } from 'lucide-react';
import { Button } from './ui/button-variants';

interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
  onClose: () => void;
}

const DocumentViewer = ({ documentUrl, documentName, onClose }: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${documentName}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                img { max-width: 100%; page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${documentUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // For base64 images, convert to blob first
        if (documentUrl.startsWith('data:')) {
          const response = await fetch(documentUrl);
          const blob = await response.blob();
          const file = new File([blob], `${documentName}.png`, { type: blob.type });

          await navigator.share({
            title: documentName,
            text: `Sharing ${documentName}`,
            files: [file]
          });
        } else {
          await navigator.share({
            title: documentName,
            text: `Sharing ${documentName}`,
            url: documentUrl
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy link to clipboard
        handleCopyLink();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (documentUrl.startsWith('data:')) {
      alert('Document is stored locally. Use the download option to save it.');
    } else {
      navigator.clipboard.writeText(documentUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${documentName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      {/* Header with controls */}
      <div className="bg-black/80 border-b border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="container-wide flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{documentName}</h3>

          <div className="flex items-center gap-2">
            {/* Zoom Out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="text-white hover:bg-white/10"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            {/* Zoom Level */}
            <span className="text-white text-sm min-w-[60px] text-center">
              {zoom}%
            </span>

            {/* Zoom In */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              className="text-white hover:bg-white/10"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            {/* Rotate */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="text-white hover:bg-white/10"
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-white/20 mx-2" />

            {/* Download */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/10"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Print */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="text-white hover:bg-white/10"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  // Share functionality
                  if (navigator.share && navigator.canShare) {
                    await navigator.share({
                      title: documentName,
                      text: `Check out this document: ${documentName}`,
                      url: window.location.href
                    });
                  } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(documentUrl);
                    alert('Document link copied to clipboard!');
                  }
                } catch (err) {
                  console.error('Share failed:', err);
                  // Fallback for any errors
                  try {
                    await navigator.clipboard.writeText(documentUrl);
                    alert('Document link copied to clipboard!');
                  } catch (clipErr) {
                    alert('Unable to share or copy link');
                  }
                }
              }}
              className="text-white hover:bg-white/10"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-white/20 mx-2" />

            {/* Close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image viewer */}
      <div 
        className="flex-1 overflow-auto flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={documentUrl}
          alt={documentName}
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          className="select-none"
        />
      </div>

      {/* Footer with instructions */}
      <div className="bg-black/80 border-t border-white/10 p-3 text-center">
        <p className="text-white/60 text-sm">
          Use zoom controls to adjust size • Click outside to close
        </p>
      </div>
    </div>
  );
};

export default DocumentViewer;