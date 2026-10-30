import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { ToolWrapper, DropZone } from './PDFTools';

// Image Resizer
export function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(files[0]);
  };

  const handleWidthChange = (w: number) => {
    setNewWidth(w);
    if (keepAspect && width > 0) {
      setNewHeight(Math.round(w * height / width));
    }
  };

  const handleHeightChange = (h: number) => {
    setNewHeight(h);
    if (keepAspect && height > 0) {
      setNewWidth(Math.round(h * width / height));
    }
  };

  const handleResize = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Resizer" description="Resize images to any dimension while maintaining quality">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <img src={image} alt="Preview" className="max-h-32 rounded-lg border" />
            <div className="text-sm text-gray-600">
              <p>Original: {width} × {height}px</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Width (px):</label>
              <input type="number" value={newWidth} onChange={(e) => handleWidthChange(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Height (px):</label>
              <input type="number" value={newHeight} onChange={(e) => handleHeightChange(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>
          <label className="flex items-center mt-3 space-x-2">
            <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="rounded" />
            <span className="text-sm text-gray-600">Keep aspect ratio</span>
          </label>
          <button onClick={handleResize} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Resize Image</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-48 rounded-lg mb-3" />
          <p className="text-green-700 text-sm mb-3">✓ Resized to {newWidth} × {newHeight}px</p>
          <a href={result} download="resized.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Compressor
export function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [originalSize, setOriginalSize] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const handleFile = (files: File[]) => {
    setOriginalSize(files[0].size);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleCompress = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      setResult(compressed);
      const byteString = atob(compressed.split(',')[1]);
      setResultSize(byteString.length);
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Compressor" description="Compress images to reduce file size">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          <div>
            <label className="text-sm font-medium text-gray-700">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full mt-1" />
          </div>
          <button onClick={handleCompress} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Compress</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-40 rounded-lg mb-3" />
          <p className="text-green-700 text-sm">
            ✓ {(originalSize / 1024).toFixed(1)} KB → {(resultSize / 1024).toFixed(1)} KB ({((1 - resultSize / originalSize) * 100).toFixed(1)}% reduction)
          </p>
          <a href={result} download="compressed.jpg" className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Converter
export function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState('image/png');
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleConvert = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const ext = format.split('/')[1];
      setResult(canvas.toDataURL(format, 0.92));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Converter" description="Convert images between formats (JPG, PNG, WEBP)">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Output format:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
          <button onClick={handleConvert} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-40 rounded-lg mb-3" />
          <p className="text-green-700 text-sm mb-3">✓ Converted successfully!</p>
          <a href={result} download={`converted.${format.split('/')[1]}`} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Rotator
export function ImageRotator() {
  const [image, setImage] = useState<string | null>(null);
  const [angle, setAngle] = useState(90);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleRotate = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const rad = (angle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      canvas.width = img.width * cos + img.height * sin;
      canvas.height = img.width * sin + img.height * cos;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Rotator" description="Rotate images to any angle">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Angle:</label>
            <select value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg">
              <option value={90}>90° Clockwise</option>
              <option value={180}>180°</option>
              <option value={270}>270° (90° CCW)</option>
              <option value={45}>45°</option>
              <option value={-45}>-45°</option>
            </select>
          </div>
          <button onClick={handleRotate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Rotate</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-40 rounded-lg mb-3" />
          <a href={result} download="rotated.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Flipper
export function ImageFlipper() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleFlip = (direction: 'h' | 'v') => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (direction === 'h') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Flipper" description="Flip images horizontally or vertically">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          <div className="flex space-x-3">
            <button onClick={() => handleFlip('h')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <FlipHorizontal className="w-4 h-4 mr-2" /> Flip Horizontal
            </button>
            <button onClick={() => handleFlip('v')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
              <FlipVertical className="w-4 h-4 mr-2" /> Flip Vertical
            </button>
          </div>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-40 rounded-lg mb-3" />
          <a href={result} download="flipped.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Filters
export function ImageFilters() {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const applyFilter = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`;
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`;

  return (
    <ToolWrapper title="Image Filters" description="Apply filters and effects to your images">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-48 rounded-lg mb-4" style={{ filter: filterStyle }} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Brightness: {brightness}%</label>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Contrast: {contrast}%</label>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Saturation: {saturate}%</label>
              <input type="range" min="0" max="200" value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Grayscale: {grayscale}%</label>
              <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Blur: {blur}px</label>
              <input type="range" min="0" max="10" step="0.5" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Sepia: {sepia}%</label>
              <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <button onClick={applyFilter} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply & Save</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-48 rounded-lg mb-3" />
          <a href={result} download="filtered.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image to Base64
export function ImageToBase64() {
  const [result, setResult] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setResult(dataUrl);
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <ToolWrapper title="Image to Base64" description="Convert an image to a Base64 encoded string">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-32 rounded-lg mb-4" />
          <textarea value={result} readOnly className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono" />
          <button onClick={() => navigator.clipboard.writeText(result)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Copy to Clipboard
          </button>
        </div>
      )}
    </ToolWrapper>
  );
}

// Color Picker
export function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setColor(hex);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    setRgb({ r, g, b });
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hsl = hexToHsl(color);

  return (
    <ToolWrapper title="Color Picker" description="Pick colors and convert between formats">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input type="color" value={color} onChange={handleChange} className="w-24 h-24 rounded-xl cursor-pointer border-0" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 w-12">HEX:</span>
              <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">{color.toUpperCase()}</code>
              <button onClick={() => navigator.clipboard.writeText(color.toUpperCase())} className="text-xs text-blue-600 hover:underline">Copy</button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 w-12">RGB:</span>
              <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
              <button onClick={() => navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="text-xs text-blue-600 hover:underline">Copy</button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 w-12">HSL:</span>
              <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
              <button onClick={() => navigator.clipboard.writeText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="text-xs text-blue-600 hover:underline">Copy</button>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: color }}>
          <p className="text-sm font-medium" style={{ color: hsl.l > 50 ? '#000' : '#fff' }}>Preview color</p>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Image Watermark
export function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('Watermark');
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.5);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleApply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      const metrics = ctx.measureText(text);
      const x = canvas.width / 2 - metrics.width / 2;
      const y = canvas.height / 2;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Watermark" description="Add a text watermark to your images">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Watermark text:</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Font size: {fontSize}px</label>
              <input type="range" min="12" max="72" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Opacity: {Math.round(opacity * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <button onClick={handleApply} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply Watermark</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-48 rounded-lg mb-3" />
          <a href={result} download="watermarked.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Image Cropper
export function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(200);
  const [cropH, setCropH] = useState(200);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        setImgWidth(img.width);
        setImgHeight(img.height);
        setCropW(Math.min(200, img.width));
        setCropH(Math.min(200, img.height));
      };
      img.src = src;
    };
    reader.readAsDataURL(files[0]);
  };

  const handleCrop = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Cropper" description="Crop images to a specific area">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <img src={image} alt="Preview" className="max-h-48 rounded-lg mb-4" />
          <p className="text-xs text-gray-500 mb-3">Image: {imgWidth} × {imgHeight}px</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-700">X offset:</label>
              <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="w-full px-2 py-1 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-700">Y offset:</label>
              <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="w-full px-2 py-1 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-700">Width:</label>
              <input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className="w-full px-2 py-1 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-700">Height:</label>
              <input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className="w-full px-2 py-1 border rounded text-sm" />
            </div>
          </div>
          <button onClick={handleCrop} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crop Image</button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <img src={result} alt="Result" className="max-h-48 rounded-lg mb-3" />
          <a href={result} download="cropped.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}
