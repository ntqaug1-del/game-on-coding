import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { SpinWheelIcon } from '@/components/icons/SpinWheelIcon';
import Footer from '@/components/Footer';
// Sound effects
const spinSound = new Audio('/sounds/spin.mp3');
const winSound = new Audio('/sounds/win.mp3');

// Set volume levels
spinSound.volume = 1;
winSound.volume = 1;

interface WheelItem {
  text: string;
  image?: string;
}

const SpinWheel: React.FC = () => {
  const [items, setItems] = useState<WheelItem[]>([
    { text: 'Item 1' },
    { text: 'Item 2' },
    { text: 'Item 3' },
    { text: 'Item 4' },
  ]);
  const [newItem, setNewItem] = useState('');
  const [newImage, setNewImage] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRefs = useRef<{ [key: string]: HTMLImageElement }>({});

  // Track window size changes
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate canvas size based on window width
  const getCanvasSize = () => {
    const maxSize = Math.min(windowSize.width - 40, 400); // Max 400px, but smaller on mobile
    return {
      width: maxSize,
      height: maxSize,
    };
  };

  // Modern color palette
  const colors = [
    ['#6C3CE9', '#4E2AA7'],
    ['#00D2FF', '#0091FF'],
    ['#FF3366', '#FF1493'],
    ['#7B42F6', '#B01EFF'],
    ['#22D1EE', '#1CA7EC'],
    ['#FF61D8', '#FF2ECF'],
  ];

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasSize();
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const anglePerItem = 360 / items.length;
    items.forEach((item, index) => {
      const startAngle = (index * anglePerItem * Math.PI) / 180;
      const endAngle = ((index + 1) * anglePerItem * Math.PI) / 180;

      // Create gradient for each section
      const gradient = ctx.createConicGradient(startAngle, 0, 0);
      gradient.addColorStop(0, colors[index % colors.length][0]);
      gradient.addColorStop(1, colors[index % colors.length][1]);

      // Draw section with gradient
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = colors[index % colors.length][0];
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text or image
      ctx.save();
      const textAngle = startAngle + (anglePerItem * Math.PI) / 360;
      ctx.rotate(textAngle);

      if (item.image) {
        const img = imageRefs.current[item.image];
        if (img) {
          // Calculate sector dimensions
          const sectorAngle = (2 * Math.PI) / items.length; // angle in radians

          // Dynamic size calculation based on number of items
          const minItems = 2; // minimum number of items allowed
          const maxItems = 12; // maximum number of items allowed
          const sizeFactor = 1 - ((items.length - minItems) / (maxItems - minItems)); // 0 to 1

          // Base dimensions
          const maxSectorWidth = radius * 0.45; // Maximum width is 45% of radius
          const sectorArcLength = sectorAngle * radius; // arc length at the outer edge

          // Calculate dynamic size with minimum guarantees
          const minSize = Math.max(radius * 0.15, 40); // Minimum size (15% of radius or 40px)
          const maxSize = Math.min(maxSectorWidth, sectorArcLength * 0.85); // Maximum size

          // Calculate final image size
          const dynamicSize = minSize + (maxSize - minSize) * sizeFactor;
          const imgSize = Math.min(dynamicSize, maxSize);

          // Position image with dynamic offset
          const imgX = radius - (radius * 0.3) - (imgSize / 2); // Dynamic position from edge
          const imgY = -imgSize / 2; // Center vertically

          // Draw image with rounded corners
          ctx.save();

          // Create rounded rectangle clip path
          const cornerRadius = Math.max(4, imgSize * 0.1); // Dynamic corner radius
          ctx.beginPath();
          ctx.moveTo(imgX + cornerRadius, imgY);
          ctx.lineTo(imgX + imgSize - cornerRadius, imgY);
          ctx.quadraticCurveTo(imgX + imgSize, imgY, imgX + imgSize, imgY + cornerRadius);
          ctx.lineTo(imgX + imgSize, imgY + imgSize - cornerRadius);
          ctx.quadraticCurveTo(imgX + imgSize, imgY + imgSize, imgX + imgSize - cornerRadius, imgY + imgSize);
          ctx.lineTo(imgX + cornerRadius, imgY + imgSize);
          ctx.quadraticCurveTo(imgX, imgY + imgSize, imgX, imgY + imgSize - cornerRadius);
          ctx.lineTo(imgX, imgY + cornerRadius);
          ctx.quadraticCurveTo(imgX, imgY, imgX + cornerRadius, imgY);
          ctx.closePath();
          ctx.clip();

          // Draw image
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

          // Add subtle white border
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        }
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, radius - 30, 0);
      }
      ctx.restore();
    });

    // Draw center button
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#000000';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw SPIN text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', 0, 0);

    ctx.restore();
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowResult(false);

    // Play spin sound
    spinSound.currentTime = 0;
    spinSound.play();

    const spins = 5;
    const baseSpeed = 3600; // 10 full rotations
    const randomOffset = Math.random() * 360;
    const finalRotation = rotation + baseSpeed * spins + randomOffset;

    const startTime = performance.now();
    const duration = 5000; // 5 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = rotation + (finalRotation - rotation) * easeOut(progress);

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalAngle = currentRotation % 360;
        const itemIndex = Math.floor((360 - finalAngle) / (360 / items.length));
        setSelectedItem(items[itemIndex]);
        setShowResult(true);

        // Play win sound when showing result
        winSound.currentTime = 0;
        winSound.play();
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawWheel();
  }, [rotation, items]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        // Preload image
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          imageRefs.current[dataUrl] = img;
          // Auto add image item when image is loaded
          if (items.length < 12) {
            setItems([...items, { text: '', image: dataUrl }]);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() && items.length < 12) {
      setItems([...items, { text: newItem.trim() }]);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItem.trim()) {
      handleAddItem();
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>

          <div className="bg-white/80 rounded-xl p-4 sm:p-8 shadow-2xl max-w-4xl mx-auto backdrop-blur-md border border-orange-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 mr-3 sm:mr-4 text-orange-600">
                  <SpinWheelIcon />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-orange-900">Spin Wheel</h1>
                  <p className="text-sm sm:text-base text-orange-700 mt-1">Create and spin your custom wheel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-sm text-orange-700">Ready to spin</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:gap-8">
              <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={getCanvasSize().width}
                    height={getCanvasSize().height}
                    onClick={spinWheel}
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                />
                {/* Winner Pointer */}
                <div className="absolute right-[-15px] sm:right-[-20px] top-1/2 -translate-y-1/2 flex items-center">
                  <ArrowLeft
                      size={windowSize.width < 640 ? 30 : 40}
                      className="text-orange-500 drop-shadow-lg"
                      style={{
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                        strokeWidth: 3
                      }}
                  />
                </div>
                <AnimatePresence>
                  {showResult && (
                      <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                          onClick={() => setShowResult(false)}
                      >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 sm:p-12 rounded-2xl shadow-2xl text-center max-w-2xl w-full mx-4"
                        >
                          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">🎉 Result!</h2>
                          {selectedItem?.image ? (
                              <img
                                  src={selectedItem.image}
                                  alt="Winner"
                                  className="max-w-[300px] sm:max-w-[400px] max-h-[300px] sm:max-h-[400px] w-full h-full object-contain mx-auto rounded-lg shadow-xl"
                              />
                          ) : (
                              <p className="text-xl sm:text-3xl text-white">{selectedItem?.text}</p>
                          )}
                        </motion.div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="relative flex items-center">
                  <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Input text here..."
                      className="w-full px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-orange-900 placeholder-gray-400 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-20 sm:pr-24 text-sm sm:text-base"
                  />
                  <div className="absolute right-0 flex items-center gap-1 mr-2">
                    <label
                        htmlFor="imageUpload"
                        className="p-1.5 sm:p-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={windowSize.width < 640 ? 20 : 24}
                          height={windowSize.width < 640 ? 20 : 24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <div className="w-px h-4 sm:h-6 bg-orange-200"></div>
                    <button
                        onClick={handleAddItem}
                        className="p-1.5 sm:p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={windowSize.width < 640 ? 20 : 24}
                          height={windowSize.width < 640 ? 20 : 24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item, index) => (
                      <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-orange-50/80 border border-orange-200"
                      >
                    <span className="text-orange-900 flex items-center gap-2 text-sm sm:text-base">
                      <span
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length][0] }}
                      />
                      {item.image ? (
                          <img
                              src={item.image}
                              alt={item.text || 'Item image'}
                              className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
                          />
                      ) : (
                          item.text
                      )}
                    </span>
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-400 hover:text-red-300 text-lg sm:text-xl"
                        >
                          ×
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default SpinWheel;
