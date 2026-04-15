import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Extract video ID from YouTube URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    
    // If already an embed URL
    if (url.includes('embed')) return url;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-5xl bg-dark-900 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="text-xl font-bold text-white">{title} - Trailer</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={getYoutubeEmbedUrl(trailerUrl)}
            title={`${title} Trailer`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;