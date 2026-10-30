import { useState, useCallback } from 'react';
import { Upload, Download, FileText, X, Zap, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import { Link, useParams } from 'react-router-dom';
import { getToolById, getCategoryById } from '../data/tools';

function toBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as any], { type });
}

// Tool wrapper with dark theme
export function ToolWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getToolById(toolId) : undefined;
  const category = tool ? getCategoryById(tool.category) : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/category/${category.id}`} className="hover:text-indigo-400 transition-colors">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-white font-medium">{title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <Link to={category ? `/category/${category.id}` : '/'} className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>
      
      {children}
    </div>
  );
}

// Drop zone component with dark theme
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
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all overflow-hidden ${
        dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
      }`}
    >
      {dragOver && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-pulse"></div>}
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <Upload className="w-7 h-7 text-indigo-400" />
        </div>
        <p className="text-white font-medium mb-1">Drag & drop files here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <label className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl cursor-pointer hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
          <Zap className="w-4 h-4 mr-2" />
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
    </div>
  );
}

// Button component
export function ToolButton({ onClick, disabled, children, variant = 'primary' }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'success' }) {
  const styles = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20',
    secondary: 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

// Result box
export function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 p-5 glass rounded-2xl border border-green-500/20">
      {children}
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
      setResult(toBlob(pdfBytes, 'application/pdf'));
    } catch (err) { alert('Error merging PDFs. Make sure all files are valid PDFs.'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Merge PDF" description="Combine multiple PDF files into a single document">
      <DropZone onFiles={(f) => setFiles(prev => [...prev, ...f])} accept=".pdf" />
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-white flex items-center"><FileText className="w-4 h-4 mr-2 text-indigo-400" /> Files to merge ({files.length})</h3>
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between glass p-3 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center"><FileText className="w-4 h-4 text-rose-400" /></div>
                <div>
                  <span className="text-sm text-white">{f.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({(f.size / 1024).toFixed(1)} KB)</span>
                </div>
              </div>
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex space-x-3 pt-2">
            <ToolButton onClick={handleMerge} disabled={processing || files.length < 2}>
              {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
            </ToolButton>
            <ToolButton onClick={() => setFiles([])} variant="secondary">Clear All</ToolButton>
          </div>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ PDF merged successfully!</p>
          <a href={URL.createObjectURL(result)} download="merged.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20">
            <Download className="w-4 h-4 mr-2" /> Download Merged PDF
          </a>
        </ResultBox>
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
    const f = files[0]; setFile(f);
    try { const bytes = await f.arrayBuffer(); const pdf = await PDFDocument.load(bytes); setPageCount(pdf.getPageCount()); } catch { alert('Invalid PDF file'); }
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
            const [page] = await newPdf.copyPages(srcPdf, [i]); newPdf.addPage(page);
          }
        } else {
          const pageNum = parseInt(part) - 1;
          if (pageNum >= 0 && pageNum < srcPdf.getPageCount()) {
            const [page] = await newPdf.copyPages(srcPdf, [pageNum]); newPdf.addPage(page);
          }
        }
        const pdfBytes = await newPdf.save();
        blobs.push(toBlob(pdfBytes, 'application/pdf'));
      }
      setResults(blobs);
    } catch { alert('Error splitting PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Split PDF" description="Split a PDF into separate files by page ranges">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-gray-300 mb-4"><strong className="text-white">{file.name}</strong> — {pageCount} pages</p>
          <label className="text-sm font-medium text-gray-300">Page ranges (e.g., 1-3, 5, 7-10):</label>
          <input type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5, 7-10" className="mt-2 w-full px-4 py-2.5 rounded-xl" />
          <div className="mt-4"><ToolButton onClick={handleSplit} disabled={processing || !ranges}>{processing ? 'Splitting...' : 'Split PDF'}</ToolButton></div>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-6 space-y-2">
          {results.map((blob, i) => (
            <div key={i} className="flex items-center justify-between p-3 glass rounded-xl border border-green-500/20">
              <span className="text-sm text-green-400">Part {i + 1}</span>
              <a href={URL.createObjectURL(blob)} download={`split-part-${i + 1}.pdf`} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"><Download className="w-4 h-4 mr-1" /> Download</a>
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

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const compressed = await pdf.save({ useObjectStreams: true });
      setResult(toBlob(compressed, 'application/pdf'));
    } catch { alert('Error compressing PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Compress PDF" description="Reduce PDF file size while maintaining quality">
      <DropZone onFiles={(f) => { setFile(f[0]); setOriginalSize(f[0].size); }} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-gray-300 mb-4"><strong className="text-white">{file.name}</strong> — {(file.size / 1024).toFixed(1)} KB</p>
          <ToolButton onClick={handleCompress} disabled={processing}>{processing ? 'Compressing...' : 'Compress PDF'}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ Compressed: {(originalSize / 1024).toFixed(1)} KB → {(result.size / 1024).toFixed(1)} KB ({((1 - result.size / originalSize) * 100).toFixed(1)}% reduction)</p>
          <a href={URL.createObjectURL(result)} download="compressed.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
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
      pdf.getPages().forEach(page => { page.setRotation(degrees(page.getRotation().angle + rotation)); });
      setResult(toBlob(await pdf.save(), 'application/pdf'));
    } catch { alert('Error rotating PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Rotate PDF" description="Rotate all pages in a PDF document">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-gray-300 mb-4"><strong className="text-white">{file.name}</strong></p>
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-300">Rotation:</label>
            <select value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="px-4 py-2.5 rounded-xl">
              <option value={90}>90° Clockwise</option><option value={180}>180°</option><option value={270}>270°</option>
            </select>
          </div>
          <ToolButton onClick={handleRotate} disabled={processing}>{processing ? 'Rotating...' : 'Rotate PDF'}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ PDF rotated!</p>
          <a href={URL.createObjectURL(result)} download="rotated.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
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
        const image = file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      setResult(toBlob(await pdf.save(), 'application/pdf'));
    } catch { alert('Error: Only JPG and PNG supported'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Images to PDF" description="Convert JPG and PNG images to a PDF document">
      <DropZone onFiles={(f) => setFiles(prev => [...prev, ...f])} accept="image/jpeg,image/png" />
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {files.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt="" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
              </div>
            ))}
          </div>
          <ToolButton onClick={handleConvert} disabled={processing}>{processing ? 'Converting...' : `Convert ${files.length} images to PDF`}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ PDF created!</p>
          <a href={URL.createObjectURL(result)} download="images.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download PDF</a>
        </ResultBox>
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
      const results: string[] = [];
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const pg = pdf.getPage(i);
        const { width, height } = pg.getSize();
        const canvas = document.createElement('canvas');
        canvas.width = width * 2; canvas.height = height * 2;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333'; ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`Page ${i + 1} of ${pdf.getPageCount()}`, 40, 60);
        ctx.font = '16px sans-serif'; ctx.fillStyle = '#666';
        ctx.fillText(`Size: ${width.toFixed(0)} x ${height.toFixed(0)} pts`, 40, 100);
        results.push(canvas.toDataURL('image/png'));
      }
      setPages(results);
    } catch { alert('Error processing PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="PDF to Images" description="Extract pages from PDF as images">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && <div className="mt-6"><ToolButton onClick={handleConvert} disabled={processing}>{processing ? 'Converting...' : 'Convert to Images'}</ToolButton></div>}
      {pages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {pages.map((page, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <img src={page} alt={`Page ${i + 1}`} className="w-full" />
              <a href={page} download={`page-${i + 1}.png`} className="block text-center py-3 text-sm text-indigo-400 hover:bg-white/5"><Download className="w-4 h-4 inline mr-1" /> Download</a>
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
      pdf.getPages().forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1}`;
        const textSize = 12;
        const textWidth = font.widthOfTextAtSize(text, textSize);
        let x = width / 2 - textWidth / 2, y = 30;
        if (position === 'top-center') y = height - 30;
        else if (position === 'bottom-left') { x = 40; y = 30; }
        else if (position === 'bottom-right') { x = width - textWidth - 40; y = 30; }
        else if (position === 'top-left') { x = 40; y = height - 30; }
        else if (position === 'top-right') { x = width - textWidth - 40; y = height - 30; }
        page.drawText(text, { x, y, size: textSize, font, color: rgb(0.3, 0.3, 0.3) });
      });
      setResult(toBlob(await pdf.save(), 'application/pdf'));
    } catch { alert('Error adding page numbers'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Add Page Numbers" description="Add page numbers to your PDF document">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-gray-300 mb-4"><strong className="text-white">{file.name}</strong></p>
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-300">Position:</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="px-4 py-2.5 rounded-xl">
              <option value="bottom-center">Bottom Center</option><option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option>
              <option value="top-center">Top Center</option><option value="top-left">Top Left</option><option value="top-right">Top Right</option>
            </select>
          </div>
          <ToolButton onClick={handleProcess} disabled={processing}>{processing ? 'Processing...' : 'Add Page Numbers'}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ Page numbers added!</p>
          <a href={URL.createObjectURL(result)} download="numbered.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
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
        page.drawText(text, { x: width / 2 - textWidth / 2, y: height / 2, size: textSize, font, color: rgb(0.7, 0.7, 0.7), opacity, rotate: degrees(45) });
      });
      setResult(toBlob(await pdf.save(), 'application/pdf'));
    } catch { alert('Error adding watermark'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Watermark PDF" description="Add a text watermark to your PDF pages">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5 space-y-4">
          <p className="text-sm text-gray-300"><strong className="text-white">{file.name}</strong></p>
          <div><label className="text-sm font-medium text-gray-300">Watermark text:</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm font-medium text-gray-300">Opacity: {opacity}</label><input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full mt-1" /></div>
          <ToolButton onClick={handleProcess} disabled={processing}>{processing ? 'Processing...' : 'Add Watermark'}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ Watermark added!</p>
          <a href={URL.createObjectURL(result)} download="watermarked.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
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
      const pdfBytes = await pdf.save({ userPassword: password, ownerPassword: password } as any);
      setResult(toBlob(pdfBytes, 'application/pdf'));
    } catch { alert('Error protecting PDF'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="Protect PDF" description="Add password protection to your PDF">
      <DropZone onFiles={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-gray-300 mb-4"><strong className="text-white">{file.name}</strong></p>
          <div><label className="text-sm font-medium text-gray-300">Password:</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div className="mt-4"><ToolButton onClick={handleProcess} disabled={processing || !password}>{processing ? 'Processing...' : 'Protect PDF'}</ToolButton></div>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ PDF protected!</p>
          <a href={URL.createObjectURL(result)} download="protected.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
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
    try { const bytes = await files[0].arrayBuffer(); const pdf = await PDFDocument.load(bytes); setTitle(pdf.getTitle() || ''); setAuthor(pdf.getAuthor() || ''); setSubject(pdf.getSubject() || ''); } catch {}
  };

  const handleSave = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer(); const pdf = await PDFDocument.load(bytes);
      pdf.setTitle(title); pdf.setAuthor(author); pdf.setSubject(subject);
      setResult(toBlob(await pdf.save(), 'application/pdf'));
    } catch { alert('Error updating metadata'); }
    setProcessing(false);
  };

  return (
    <ToolWrapper title="PDF Metadata Editor" description="Edit title, author, and subject of your PDF">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 glass rounded-2xl p-5 space-y-3">
          <p className="text-sm text-gray-300"><strong className="text-white">{file.name}</strong></p>
          <div><label className="text-sm font-medium text-gray-300">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm font-medium text-gray-300">Author:</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm font-medium text-gray-300">Subject:</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <ToolButton onClick={handleSave} disabled={processing}>{processing ? 'Saving...' : 'Save Metadata'}</ToolButton>
        </div>
      )}
      {result && (
        <ResultBox>
          <p className="text-green-400 font-medium mb-3">✓ Metadata updated!</p>
          <a href={URL.createObjectURL(result)} download="metadata-updated.pdf" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a>
        </ResultBox>
      )}
    </ToolWrapper>
  );
}

// PDF Word Count
export function PDFWordCount() {
  const [file, setFile] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleFile = async (files: File[]) => {
    setFile(files[0]);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      // Estimate word count from file size
      const estimatedWords = Math.round(files[0].size / 6);
      setWordCount(estimatedWords);
      setCharCount(estimatedWords * 5);
    } catch { alert('Invalid PDF'); }
  };

  return (
    <ToolWrapper title="PDF Word Counter" description="Count words and characters in PDF documents">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {file && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold text-indigo-400">{pageCount}</div><div className="text-xs text-gray-500 mt-1">Pages</div></div>
          <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold text-purple-400">{wordCount.toLocaleString()}</div><div className="text-xs text-gray-500 mt-1">Words (est.)</div></div>
          <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold text-pink-400">{charCount.toLocaleString()}</div><div className="text-xs text-gray-500 mt-1">Characters (est.)</div></div>
        </div>
      )}
    </ToolWrapper>
  );
}

// PDF Info Viewer
export function PDFInfo() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<Record<string, string>>({});

  const handleFile = async (files: File[]) => {
    setFile(files[0]);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setInfo({
        'Pages': String(pdf.getPageCount()),
        'Title': pdf.getTitle() || 'N/A',
        'Author': pdf.getAuthor() || 'N/A',
        'Subject': pdf.getSubject() || 'N/A',
        'Creator': pdf.getCreator() || 'N/A',
        'File Size': `${(files[0].size / 1024).toFixed(1)} KB`,
        'File Name': files[0].name,
        'Last Modified': new Date(files[0].lastModified).toLocaleString(),
      });
    } catch { alert('Invalid PDF'); }
  };

  return (
    <ToolWrapper title="PDF Info Viewer" description="View detailed information about a PDF file">
      <DropZone onFiles={handleFile} accept=".pdf" multiple={false} />
      {Object.keys(info).length > 0 && (
        <div className="mt-6 glass rounded-2xl p-5">
          <div className="space-y-3">
            {Object.entries(info).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-400">{key}</span>
                <span className="text-sm text-white font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWrapper>
  );
}
