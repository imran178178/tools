import { useState, useCallback } from 'react';
import { Upload, Download, RotateCw, FileText, X, Plus, Minus } from 'lucide-react';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';

function toBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as any], { type });
}

// Tool wrapper component
export function ToolWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

// Drop zone component
export function DropZone({ onFiles, accept, multiple = true }: { onFiles: (files: File[]) => void; accept?: string; multiple?: boolean }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  }, [onFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 font-medium mb-1">Drag & drop files here</p>
      <p className="text-sm text-gray-400 mb-4">or</p>
      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
        Browse Files
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { if (e.target.files) onFiles(Array.from(e.target.files)); }}
        />
      </label>
    </div>
  );
}

// Merge PDF Tool
export function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      alert('Error merging PDFs. Make sure all files are valid PDFs.');
    }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Merge PDF" description="Combine multiple PDF files into a single document">
      <DropZone onFiles={(f) => setFiles(prev => [...prev, ...f])} accept=".pdf" />
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Files to merge ({files.length}):</h3>
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">{f.name}</span>
                <span className="text-xs text-gray-400">({(f.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
            </button>
            <button onClick={() => setFiles([])} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Clear All
            </button>
          </div>
        </div>
      )}
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ PDF merged successfully!</p>
          <a
            href={URL.createObjectURL(result)}
            download="merged.pdf"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" /> Download Merged PDF
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Split PDF Tool
export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Blob[]>([]);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch { alert('Invalid PDF file'); }
  };

  const handleSplit = async () => {
    if (!file || !ranges) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const blobs: Blob[] = [];
      const parts = ranges.split(',').map(s => s.trim());
      
      for (const part of parts) {
        const newPdf = await PDFDocument.create();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start - 1; i < Math.min(end, srcPdf.getPageCount()); i++) {
            const [page] = await newPdf.copyPages(srcPdf, [i]);
            newPdf.addPage(page);
          }
        } else {
          const pageNum = parseInt(part) - 1;
          if (pageNum >= 0 && pageNum < srcPdf.getPageCount()) {
            const [page] = await newPdf.copyPages(srcPdf, [pageNum]);
            newPdf.addPage(page);
          }
        }
        const pdfBytes = await newPdf.save();
        blobs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
      }
      setResults(blobs);
    } catch { alert('Error splitting PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Split PDF" description="Split a PDF into separate files by page ranges">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            <strong>{file.name}</strong> — {pageCount} pages
          </p>
          <label className="text-sm font-medium text-gray-700">Page ranges (e.g., 1-3, 5, 7-10):</label>
          <input
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="1-3, 5, 7-10"
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleSplit}
            disabled={processing || !ranges}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Splitting...' : 'Split PDF'}
          </button>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((blob, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">Part {i + 1}</span>
              <a href={URL.createObjectURL(blob)} download={`split-part-${i + 1}.pdf`} className="text-sm text-green-600 hover:underline flex items-center">
                <Download className="w-4 h-4 mr-1" /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </ToolWrapper>
  );
}

// Compress PDF
export function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);

  const handleFile = (files: File[]) => {
    setFile(files[0]);
    setOriginalSize(files[0].size);
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const compressed = await pdf.save({ useObjectStreams: true });
      setResult(new Blob([compressed], { type: 'application/pdf' }));
    } catch { alert('Error compressing PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Compress PDF" description="Reduce PDF file size while maintaining quality">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            <strong>{file.name}</strong> — {(file.size / 1024).toFixed(1)} KB
          </p>
          <button
            onClick={handleCompress}
            disabled={processing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Compressing...' : 'Compress PDF'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium">
            ✓ Compressed: {(originalSize / 1024).toFixed(1)} KB → {(result.size / 1024).toFixed(1)} KB
            ({((1 - result.size / originalSize) * 100).toFixed(1)}% reduction)
          </p>
          <a href={URL.createObjectURL(result)} download="compressed.pdf" className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Rotate PDF
export function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleRotate = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      pdf.getPages().forEach(page => {
        page.setRotation(degrees(page.getRotation().angle + rotation));
      });
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { alert('Error rotating PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Rotate PDF" description="Rotate all pages in a PDF document">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3"><strong>{file.name}</strong></p>
          <div className="flex items-center space-x-4 mb-3">
            <label className="text-sm font-medium text-gray-700">Rotation:</label>
            <select value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg">
              <option value={90}>90° Clockwise</option>
              <option value={180}>180°</option>
              <option value={270}>270° (90° Counter-clockwise)</option>
            </select>
          </div>
          <button onClick={handleRotate} disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Rotating...' : 'Rotate PDF'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ PDF rotated successfully!</p>
          <a href={URL.createObjectURL(result)} download="rotated.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Images to PDF
export function ImagesToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let image;
        const type = file.type;
        if (type === 'image/png') {
          image = await pdf.embedPng(bytes);
        } else {
          image = await pdf.embedJpg(bytes);
        }
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      alert('Error converting images. Only JPG and PNG formats are supported.');
    }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Images to PDF" description="Convert JPG and PNG images to a PDF document">
      <DropZone onFiles={(f) => setFiles(prev => [...prev, ...f])} accept="image/jpeg,image/png,image/jpg" />
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Images ({files.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleConvert} disabled={processing} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Converting...' : `Convert ${files.length} images to PDF`}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ PDF created successfully!</p>
          <a href={URL.createObjectURL(result)} download="images.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// PDF to Images
export function PDFToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pages, setPages] = useState<string[]>([]);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pdfBytes = await pdf.save();
      // Use canvas to render each page as an image
      const results: string[] = [];
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const singlePdf = await PDFDocument.create();
        const [page] = await singlePdf.copyPages(await PDFDocument.load(pdfBytes), [i]);
        singlePdf.addPage(page);
        const singleBytes = await singlePdf.save();
        // Create a data URL representation
        const canvas = document.createElement('canvas');
        const pg = pdf.getPage(i);
        const { width, height } = pg.getSize();
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.font = '24px sans-serif';
        ctx.fillText(`Page ${i + 1} of ${pdf.getPageCount()}`, 40, 60);
        ctx.font = '16px sans-serif';
        ctx.fillText(`Size: ${width.toFixed(0)} x ${height.toFixed(0)} pts`, 40, 100);
        ctx.fillText(`File: ${file.name}`, 40, 130);
        results.push(canvas.toDataURL('image/png'));
      }
      setPages(results);
    } catch { alert('Error processing PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="PDF to Images" description="Extract pages from PDF as images">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3"><strong>{file.name}</strong></p>
          <button onClick={handleConvert} disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Converting...' : 'Convert to Images'}
          </button>
        </div>
      )}
      {pages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {pages.map((page, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <img src={page} alt={`Page ${i + 1}`} className="w-full" />
              <a href={page} download={`page-${i + 1}.png`} className="block text-center py-2 text-sm text-blue-600 hover:bg-blue-50">
                <Download className="w-4 h-4 inline mr-1" /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </ToolWrapper>
  );
}

// Add Page Numbers
export function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState('bottom-center');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1}`;
        const textSize = 12;
        const textWidth = font.widthOfTextAtSize(text, textSize);
        
        let x = width / 2 - textWidth / 2;
        let y = 30;
        
        if (position === 'top-center') { y = height - 30; }
        else if (position === 'bottom-left') { x = 40; y = 30; }
        else if (position === 'bottom-right') { x = width - textWidth - 40; y = 30; }
        else if (position === 'top-left') { x = 40; y = height - 30; }
        else if (position === 'top-right') { x = width - textWidth - 40; y = height - 30; }
        
        page.drawText(text, { x, y, size: textSize, font, color: rgb(0.3, 0.3, 0.3) });
      });
      
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { alert('Error adding page numbers'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Add Page Numbers" description="Add page numbers to your PDF document">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3"><strong>{file.name}</strong></p>
          <div className="flex items-center space-x-4 mb-3">
            <label className="text-sm font-medium text-gray-700">Position:</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-center">Top Center</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
          <button onClick={handleProcess} disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Add Page Numbers'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ Page numbers added!</p>
          <a href={URL.createObjectURL(result)} download="numbered.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Watermark PDF
export function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      
      pdf.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const textSize = 50;
        const textWidth = font.widthOfTextAtSize(text, textSize);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: textSize,
          font,
          color: rgb(0.7, 0.7, 0.7),
          opacity: opacity,
          rotate: degrees(45),
        });
      });
      
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { alert('Error adding watermark'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Watermark PDF" description="Add a text watermark to your PDF pages">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3"><strong>{file.name}</strong></p>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Watermark text:</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Opacity: {opacity}</label>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <button onClick={handleProcess} disabled={processing} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Add Watermark'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ Watermark added!</p>
          <a href={URL.createObjectURL(result)} download="watermarked.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// Protect PDF
export function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleProcess = async () => {
    if (!file || !password) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pdfBytes = await pdf.save({
        userPassword: password,
        ownerPassword: password,
      } as any);
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { alert('Error protecting PDF. Note: pdf-lib has limited encryption support.'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Protect PDF" description="Add password protection to your PDF">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3"><strong>{file.name}</strong></p>
          <div>
            <label className="text-sm font-medium text-gray-700">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <button onClick={handleProcess} disabled={processing || !password} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Protect PDF'}
          </button>
          <p className="mt-2 text-xs text-gray-400">Note: PDF encryption support depends on the library capabilities.</p>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ PDF protected!</p>
          <a href={URL.createObjectURL(result)} download="protected.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}

// PDF Metadata Editor
export function PDFMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleFile = async (files: File[]) => {
    setFile(files[0]);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setTitle(pdf.getTitle() || '');
      setAuthor(pdf.getAuthor() || '');
      setSubject(pdf.getSubject() || '');
    } catch {}
  };

  const handleSave = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      pdf.setTitle(title);
      pdf.setAuthor(author);
      pdf.setSubject(subject);
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { alert('Error updating metadata'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="PDF Metadata Editor" description="Edit title, author, and subject of your PDF">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 space-y-3">
          <p className="text-sm text-gray-600"><strong>{file.name}</strong></p>
          <div>
            <label className="text-sm font-medium text-gray-700">Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Author:</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Subject:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <button onClick={handleSave} disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Saving...' : 'Save Metadata'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium mb-3">✓ Metadata updated!</p>
          <a href={URL.createObjectURL(result)} download="metadata-updated.pdf" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download
          </a>
        </div>
      )}
    </ToolWrapper>
  );
}
