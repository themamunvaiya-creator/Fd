import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, RefreshCw, Zap, ZapOff, X, Image as ImageIcon } from 'lucide-react';

interface CameraModalProps {
  onClose: () => void;
  torchInitial?: boolean;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, torchInitial = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [torchOn, setTorchOn] = useState(torchInitial);
  const [snappedPhoto, setSnappedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setCameraError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Apply torch if supported and requested
        if (torchOn && facingMode === 'environment') {
          const track = mediaStream.getVideoTracks()[0];
          const capabilities = (track.getCapabilities?.() as any) || {};
          if (capabilities.torch) {
            await (track as any).applyConstraints({ advanced: [{ torch: true }] });
          }
        }
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setCameraError('ক্যামেরা চালু করা যায়নি বা পারমিশন দেওয়া হয়নি।');
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      const newTorchState = !torchOn;
      const capabilities = (track.getCapabilities?.() as any) || {};
      if (capabilities.torch) {
        await (track as any).applyConstraints({
          advanced: [{ torch: newTorchState }],
        });
      }
      setTorchOn(newTorchState);
    } catch (e) {
      console.warn('Torch constraint error:', e);
      setTorchOn(!torchOn);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSnappedPhoto(canvas.toDataURL('image/jpeg'));
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-sm h-[560px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button
            onClick={toggleTorch}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
              torchOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-900/70 text-white'
            }`}
            title="ফ্ল্যাশ / টর্চলাইট"
          >
            {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
          </button>

          <span className="text-xs font-semibold text-white tracking-widest uppercase">
            Mita Lens Camera
          </span>

          <button
            onClick={handleClose}
            className="p-2.5 rounded-full bg-slate-900/70 text-white backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video feed or simulated preview */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-slate-400">
              <Camera size={44} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-200">{cameraError}</p>
              <p className="text-xs text-slate-500 mt-2">
                মিতা ক্যামেরা অ্যাপের ভার্চুয়াল ভিউ প্রস্তুত রেখেছে।
              </p>
            </div>
          ) : snappedPhoto ? (
            <img src={snappedPhoto} alt="Snapped" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          )}

          {/* Torch Glow overlay if torch simulation active */}
          {torchOn && (
            <div className="absolute inset-0 bg-amber-100/30 mix-blend-screen pointer-events-none" />
          )}
        </div>

        {/* Bottom controls */}
        <div className="z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around">
          <button
            onClick={() => setSnappedPhoto(null)}
            className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center"
            title="গ্যালারি / রিসেট"
          >
            <ImageIcon size={20} />
          </button>

          <button
            onClick={takePhoto}
            className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-white hover:bg-slate-200 transition-colors" />
          </button>

          <button
            onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
            className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center"
            title="ক্যামেরা ফ্লিপ করুন"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
