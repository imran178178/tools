import { useState, useEffect, useRef } from 'react';
import { Download, Copy, RefreshCw, Play, Pause, RotateCw } from 'lucide-react';
import { ToolWrapper, DropZone, ToolButton, ResultBox } from './PDFTools';

// ============ IMAGE TOOLS ============

// Image Blur
export function ImageBlur() {
  const [image, setImage] = useState<string | null>(null);
  const [blur, setBlur] = useState(5);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => { const r = new FileReader(); r.onload = (e) => setImage(e.target?.result as string); r.readAsDataURL(files[0]); };
  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Blur" description="Apply blur effect to images">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-6 glass rounded-2xl p-5">
          <img src={image} alt="Preview" className="max-h-48 rounded-xl mb-4" style={{ filter: `blur(${blur}px)` }} />
          <div><label className="text-sm text-gray-300">Blur: {blur}px</label><input type="range" min="1" max="20" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full mt-1" /></div>
          <div className="mt-4"><ToolButton onClick={apply}>Apply Blur</ToolButton></div>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Result" className="max-h-48 rounded-xl mb-3" /><a href={result} download="blurred.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// Image Grayscale
export function ImageGrayscale() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => { const r = new FileReader(); r.onload = (e) => setImage(e.target?.result as string); r.readAsDataURL(files[0]); };
  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Grayscale Converter" description="Convert images to black and white">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-6 glass rounded-2xl p-5">
          <img src={image} alt="Preview" className="max-h-48 rounded-xl mb-4" style={{ filter: 'grayscale(100%)' }} />
          <ToolButton onClick={apply}>Convert to Grayscale</ToolButton>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Result" className="max-h-48 rounded-xl mb-3" /><a href={result} download="grayscale.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// Image Border
export function ImageBorder() {
  const [image, setImage] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => { const r = new FileReader(); r.onload = (e) => setImage(e.target?.result as string); r.readAsDataURL(files[0]); };
  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + borderWidth * 2;
      canvas.height = img.height + borderWidth * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, borderWidth, borderWidth);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image Border Maker" description="Add colored borders to images">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-6 glass rounded-2xl p-5 space-y-4">
          <img src={image} alt="Preview" className="max-h-48 rounded-xl" style={{ border: `${borderWidth}px solid ${borderColor}` }} />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-300">Border width: {borderWidth}px</label><input type="range" min="1" max="50" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full mt-1" /></div>
            <div><label className="text-sm text-gray-300">Border color:</label><input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-10 mt-1 rounded-lg cursor-pointer" /></div>
          </div>
          <ToolButton onClick={apply}>Add Border</ToolButton>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Result" className="max-h-48 rounded-xl mb-3" /><a href={result} download="bordered.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// Image Rounded Corners
export function ImageRounded() {
  const [image, setImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(20);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => { const r = new FileReader(); r.onload = (e) => setImage(e.target?.result as string); r.readAsDataURL(files[0]); };
  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Rounded Corners" description="Add rounded corners to images">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-6 glass rounded-2xl p-5">
          <img src={image} alt="Preview" className="max-h-48 rounded-xl mb-4" style={{ borderRadius: `${radius}px` }} />
          <div><label className="text-sm text-gray-300">Radius: {radius}px</label><input type="range" min="0" max="100" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full mt-1" /></div>
          <div className="mt-4"><ToolButton onClick={apply}>Apply Rounded Corners</ToolButton></div>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Result" className="max-h-48 rounded-xl mb-3" /><a href={result} download="rounded.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// Image Collage
export function ImageCollage() {
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const r = new FileReader();
      r.onload = (e) => setImages(prev => [...prev, e.target?.result as string]);
      r.readAsDataURL(file);
    });
  };

  const createCollage = () => {
    if (images.length < 2) return;
    const canvas = document.createElement('canvas');
    const cols = Math.ceil(Math.sqrt(images.length));
    const rows = Math.ceil(images.length / cols);
    const cellSize = 300;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let loaded = 0;
    images.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const scale = Math.min(cellSize / img.width, cellSize / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, col * cellSize + (cellSize - w) / 2, row * cellSize + (cellSize - h) / 2, w, h);
        loaded++;
        if (loaded === images.length) setResult(canvas.toDataURL('image/png'));
      };
      img.src = src;
    });
  };

  return (
    <ToolWrapper title="Image Collage Maker" description="Create photo collages from multiple images">
      <DropZone onFiles={handleFiles} accept="image/*" />
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {images.map((img, i) => <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />)}
          </div>
          <div className="flex space-x-3">
            <ToolButton onClick={createCollage}>Create Collage</ToolButton>
            <ToolButton onClick={() => setImages([])} variant="secondary">Clear</ToolButton>
          </div>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Collage" className="max-h-64 rounded-xl mb-3" /><a href={result} download="collage.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// Image Inverter
export function ImageInverter() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => { const r = new FileReader(); r.onload = (e) => setImage(e.target?.result as string); r.readAsDataURL(files[0]); };
  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = 'invert(100%)';
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Color Inverter" description="Invert image colors">
      <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
      {image && (
        <div className="mt-6 glass rounded-2xl p-5">
          <img src={image} alt="Preview" className="max-h-48 rounded-xl mb-4" style={{ filter: 'invert(100%)' }} />
          <ToolButton onClick={apply}>Invert Colors</ToolButton>
        </div>
      )}
      {result && <ResultBox><img src={result} alt="Result" className="max-h-48 rounded-xl mb-3" /><a href={result} download="inverted.png" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"><Download className="w-4 h-4 mr-2" /> Download</a></ResultBox>}
    </ToolWrapper>
  );
}

// ============ CALCULATOR TOOLS ============

// Tip Calculator
export function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState('');

  const calculate = () => {
    const b = parseFloat(bill);
    if (isNaN(b)) return;
    const tip = b * tipPercent / 100;
    const total = b + tip;
    const perPerson = total / people;
    setResult(`Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)} | Per person: $${perPerson.toFixed(2)}`);
  };

  return (
    <ToolWrapper title="Tip Calculator" description="Calculate tips and split bills">
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300">Bill Amount ($):</label><input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">Tip: {tipPercent}%</label><input type="range" min="0" max="50" value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full mt-1" /></div>
          <div><label className="text-sm text-gray-300">Split between:</label><input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} min="1" className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
        </div>
        <div className="mt-4"><ToolButton onClick={calculate}>Calculate</ToolButton></div>
        {result && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm">{result}</div>}
      </div>
    </ToolWrapper>
  );
}

// GST Calculator
export function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [result, setResult] = useState('');

  const calculate = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) return;
    if (mode === 'exclusive') {
      const gst = a * gstRate / 100;
      setResult(`GST: $${gst.toFixed(2)} | Total: $${(a + gst).toFixed(2)}`);
    } else {
      const base = a / (1 + gstRate / 100);
      const gst = a - base;
      setResult(`Base: $${base.toFixed(2)} | GST: $${gst.toFixed(2)}`);
    }
  };

  return (
    <ToolWrapper title="GST Calculator" description="Calculate GST tax amounts">
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setMode('exclusive')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'exclusive' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>GST Exclusive</button>
          <button onClick={() => setMode('inclusive')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'inclusive' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>GST Inclusive</button>
        </div>
        <div className="space-y-3">
          <div><label className="text-sm text-gray-300">Amount ($):</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">GST Rate: {gstRate}%</label>
            <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="mt-1 w-full px-4 py-2.5 rounded-xl">
              <option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
            </select>
          </div>
        </div>
        <div className="mt-4"><ToolButton onClick={calculate}>Calculate</ToolButton></div>
        {result && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm">{result}</div>}
      </div>
    </ToolWrapper>
  );
}

// BMR Calculator
export function BMRCalculator() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height);
    if (isNaN(a) || isNaN(w) || isNaN(h)) return;
    let bmr: number;
    if (gender === 'male') bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    else bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    setResult(`BMR: ${bmr.toFixed(0)} cal/day | Sedentary: ${(bmr * 1.2).toFixed(0)} | Active: ${(bmr * 1.55).toFixed(0)} | Very Active: ${(bmr * 1.725).toFixed(0)}`);
  };

  return (
    <ToolWrapper title="BMR Calculator" description="Calculate Basal Metabolic Rate">
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-xl text-sm ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Male</button>
          <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-xl text-sm ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Female</button>
        </div>
        <div className="space-y-3">
          <div><label className="text-sm text-gray-300">Age:</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">Weight (kg):</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">Height (cm):</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
        </div>
        <div className="mt-4"><ToolButton onClick={calculate}>Calculate BMR</ToolButton></div>
        {result && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm">{result}</div>}
      </div>
    </ToolWrapper>
  );
}

// Aspect Ratio Calculator
export function AspectRatio() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [ratio, setRatio] = useState('');

  useEffect(() => {
    const w = parseInt(width), h = parseInt(height);
    if (w && h) {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const d = gcd(w, h);
      setRatio(`${w / d}:${h / d}`);
    }
  }, [width, height]);

  return (
    <ToolWrapper title="Aspect Ratio Calculator" description="Calculate image aspect ratios">
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">Width:</label><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">Height:</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
        </div>
        {ratio && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center"><span className="text-2xl font-bold text-indigo-400">{ratio}</span><p className="text-xs text-gray-500 mt-1">Aspect Ratio</p></div>}
      </div>
    </ToolWrapper>
  );
}

// ============ TEXT TOOLS ============

// Text to Binary
export function TextToBinary() {
  const [text, setText] = useState('');
  const [binary, setBinary] = useState('');
  const [mode, setMode] = useState<'toBinary' | 'toText'>('toBinary');

  const convert = () => {
    if (mode === 'toBinary') {
      setBinary(text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
    } else {
      try { setBinary(text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('')); } catch { setBinary('Invalid binary'); }
    }
  };

  return (
    <ToolWrapper title="Text to Binary" description="Convert text to binary code and vice versa">
      <div className="glass rounded-2xl p-6">
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setMode('toBinary')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'toBinary' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Text → Binary</button>
          <button onClick={() => setMode('toText')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'toText' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Binary → Text</button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'toBinary' ? 'Enter text...' : 'Enter binary (space separated)...'} className="w-full h-24 px-4 py-3 rounded-xl resize-none" />
        <div className="mt-3"><ToolButton onClick={convert}>Convert</ToolButton></div>
        {binary && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"><code className="text-sm text-indigo-300 font-mono break-all">{binary}</code><button onClick={() => navigator.clipboard.writeText(binary)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// Morse Code
export function MorseCode() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [mode, setMode] = useState<'toMorse' | 'toText'>('toMorse');

  const morseMap: Record<string, string> = { A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..', '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.', ' ':'/' };
  const reverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

  const convert = () => {
    if (mode === 'toMorse') {
      setMorse(text.toUpperCase().split('').map(c => morseMap[c] || '').join(' '));
    } else {
      setMorse(text.split(' ').map(c => reverseMorse[c] || '').join(''));
    }
  };

  return (
    <ToolWrapper title="Morse Code Translator" description="Convert text to Morse code and vice versa">
      <div className="glass rounded-2xl p-6">
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setMode('toMorse')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'toMorse' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Text → Morse</button>
          <button onClick={() => setMode('toText')} className={`flex-1 py-2 rounded-xl text-sm ${mode === 'toText' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>Morse → Text</button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'toMorse' ? 'Enter text...' : 'Enter morse code...'} className="w-full h-24 px-4 py-3 rounded-xl resize-none" />
        <div className="mt-3"><ToolButton onClick={convert}>Convert</ToolButton></div>
        {morse && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"><code className="text-sm text-indigo-300 font-mono">{morse}</code><button onClick={() => navigator.clipboard.writeText(morse)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// Text to Emoji
export function TextToEmoji() {
  const [text, setText] = useState('');
  const emojiMap: Record<string, string> = { love:'❤️', happy:'😊', sad:'😢', angry:'😡', cool:'😎', fire:'🔥', star:'⭐', heart:'❤️', smile:'😄', laugh:'😂', think:'🤔', wow:'😮', yes:'✅', no:'❌', money:'💰', sun:'☀️', moon:'🌙', music:'🎵', book:'📚', phone:'📱', computer:'💻', food:'🍔', coffee:'☕', party:'🎉', gift:'🎁', thumbsup:'👍', clap:'👏', wave:'👋', pray:'🙏', muscle:'💪', eyes:'👀', brain:'🧠', rocket:'🚀', crown:'👑', diamond:'💎' };

  const convert = () => {
    let result = text.toLowerCase();
    Object.entries(emojiMap).forEach(([word, emoji]) => {
      result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), emoji);
    });
    return result;
  };

  return (
    <ToolWrapper title="Text to Emoji" description="Convert words to emoji">
      <div className="glass rounded-2xl p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type words like: love happy fire star..." className="w-full h-24 px-4 py-3 rounded-xl resize-none" />
        {text && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-2xl">{convert()}</div>}
        <div className="mt-4 flex flex-wrap gap-1">
          {Object.entries(emojiMap).slice(0, 20).map(([word, emoji]) => (
            <span key={word} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400">{word} {emoji}</span>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}

// Upside Down Text
export function UpsideDownText() {
  const [text, setText] = useState('');
  const flipMap: Record<string, string> = { a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ', i:'ᴉ', j:'ɾ', k:'ʞ', l:'l', m:'ɯ', n:'u', o:'o', p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z', A:'∀', B:'B', C:'Ɔ', D:'D', E:'Ǝ', F:'Ⅎ', G:'פ', H:'H', I:'I', J:'ſ', K:'K', L:'˥', M:'W', N:'N', O:'O', P:'Ԁ', Q:'Q', R:'R', S:'S', T:'┴', U:'U', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z', '1':'Ɩ', '2':'ᄅ', '3':'Ɛ', '4':'ㄣ', '5':'ϛ', '6':'9', '7':'ㄥ', '8':'8', '9':'6', '0':'0', '.':'˙', ',':"'", '?':'⸮', '!':'¡', "'":',', '"':',,', '`':',', '(':')', ')':'(', '[':']', ']':'[', '{':'}', '}':'{', '<':'>', '>':'<', '&':'⅋', '_':'‾' };

  const flipped = text.split('').reverse().map(c => flipMap[c] || c).join('');

  return (
    <ToolWrapper title="Upside Down Text" description="Flip text upside down">
      <div className="glass rounded-2xl p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something..." className="w-full h-24 px-4 py-3 rounded-xl resize-none" />
        {text && (
          <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-lg text-indigo-300" style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{flipped}</p>
            <button onClick={() => navigator.clipboard.writeText(flipped)} className="mt-2 block text-xs text-indigo-400 hover:underline">Copy flipped text</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Fancy Text Generator
export function FancyText() {
  const [text, setText] = useState('');
  
  const styles = [
    { name: 'Bold', fn: (t: string) => t.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D5D4); if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D5EE); return c; }).join('') },
    { name: 'Italic', fn: (t: string) => t.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D434); if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D44E); return c; }).join('') },
    { name: 'Small Caps', fn: (t: string) => t.toLowerCase().split('').map(c => { const map: Record<string, string> = { a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'q', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ' }; return map[c] || c; }).join('') },
    { name: 'Circled', fn: (t: string) => t.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x24B6); if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x24D0); return c; }).join('') },
    { name: 'Squared', fn: (t: string) => t.toUpperCase().split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1F130); return c; }).join('') },
    { name: 'Spaced', fn: (t: string) => t.split('').join(' ') },
  ];

  return (
    <ToolWrapper title="Fancy Text Generator" description="Generate stylish text in different fonts">
      <div className="glass rounded-2xl p-6">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full px-4 py-3 rounded-xl" />
        {text && (
          <div className="mt-4 space-y-3">
            {styles.map((style, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl flex items-center justify-between group">
                <div>
                  <span className="text-xs text-gray-500 block">{style.name}</span>
                  <span className="text-lg text-white">{style.fn(text)}</span>
                </div>
                <button onClick={() => navigator.clipboard.writeText(style.fn(text))} className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:underline">Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text to Numbers
export function TextToNumbers() {
  const [text, setText] = useState('');
  const numbers = text.split('').map(c => c.charCodeAt(0)).join(' ');

  return (
    <ToolWrapper title="Text to Numbers" description="Convert text to ASCII number codes">
      <div className="glass rounded-2xl p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full h-24 px-4 py-3 rounded-xl resize-none" />
        {text && (
          <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <code className="text-sm text-indigo-300 font-mono break-all">{numbers}</code>
            <button onClick={() => navigator.clipboard.writeText(numbers)} className="mt-2 block text-xs text-indigo-400 hover:underline">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// ============ DEVELOPER TOOLS ============

// HTML Preview
export function HTMLPreview() {
  const [html, setHtml] = useState('<h1 style="color: #6366f1">Hello World!</h1>\n<p>This is a live preview.</p>');

  return (
    <ToolWrapper title="HTML Live Preview" description="Preview HTML code in real-time">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">HTML Code:</label>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="w-full h-64 px-4 py-3 rounded-xl font-mono text-sm resize-none" />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Preview:</label>
          <div className="w-full h-64 bg-white rounded-xl p-4 overflow-auto text-black" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </ToolWrapper>
  );
}

// Cron Generator
export function CronGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');

  const expression = `${minute} ${hour} ${day} ${month} ${weekday}`;

  return (
    <ToolWrapper title="Cron Expression Generator" description="Generate cron schedule expressions">
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-5 gap-3">
          {[{ label: 'Minute', val: minute, set: setMinute }, { label: 'Hour', val: hour, set: setHour }, { label: 'Day', val: day, set: setDay }, { label: 'Month', val: month, set: setMonth }, { label: 'Weekday', val: weekday, set: setWeekday }].map((field, i) => (
            <div key={i}><label className="text-xs text-gray-500">{field.label}</label><input type="text" value={field.val} onChange={(e) => field.set(e.target.value)} className="mt-1 w-full px-2 py-2 rounded-lg text-center text-sm" /></div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
          <code className="text-xl text-indigo-300 font-mono">{expression}</code>
          <button onClick={() => navigator.clipboard.writeText(expression)} className="mt-2 block text-xs text-indigo-400 hover:underline mx-auto">Copy expression</button>
        </div>
      </div>
    </ToolWrapper>
  );
}

// SQL Formatter
export function SQLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'LIMIT', 'OFFSET', 'UNION', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN'];
    let formatted = input;
    keywords.forEach(kw => {
      formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), `\n${kw}`);
    });
    setOutput(formatted.trim().replace(/\n{2,}/g, '\n'));
  };

  return (
    <ToolWrapper title="SQL Formatter" description="Format and beautify SQL queries">
      <div className="glass rounded-2xl p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste SQL query..." className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" />
        <div className="mt-3"><ToolButton onClick={format}>Format SQL</ToolButton></div>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 rounded-xl text-sm text-green-400 font-mono overflow-auto">{output}</pre>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// JSON Diff
export function JSONDiff() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diff, setDiff] = useState('');

  const compare = () => {
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      const s1 = JSON.stringify(obj1, null, 2);
      const s2 = JSON.stringify(obj2, null, 2);
      if (s1 === s2) { setDiff('✓ Both JSON objects are identical'); return; }
      const lines1 = s1.split('\n');
      const lines2 = s2.split('\n');
      const result: string[] = [];
      const maxLen = Math.max(lines1.length, lines2.length);
      for (let i = 0; i < maxLen; i++) {
        if (i >= lines1.length) result.push(`+ ${lines2[i]}`);
        else if (i >= lines2.length) result.push(`- ${lines1[i]}`);
        else if (lines1[i] !== lines2[i]) { result.push(`- ${lines1[i]}`); result.push(`+ ${lines2[i]}`); }
      }
      setDiff(result.join('\n'));
    } catch { setDiff('Error: Invalid JSON'); }
  };

  return (
    <ToolWrapper title="JSON Diff Checker" description="Compare two JSON objects">
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300 mb-1 block">JSON 1:</label><textarea value={json1} onChange={(e) => setJson1(e.target.value)} className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">JSON 2:</label><textarea value={json2} onChange={(e) => setJson2(e.target.value)} className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" /></div>
        </div>
        <div className="mt-3"><ToolButton onClick={compare}>Compare</ToolButton></div>
        {diff && <pre className="mt-4 p-4 bg-gray-900 rounded-xl text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap">{diff.split('\n').map((line, i) => <span key={i} className={`block ${line.startsWith('+') ? 'text-green-400' : line.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>{line}</span>)}</pre>}
      </div>
    </ToolWrapper>
  );
}

// ============ SEO TOOLS ============

// Htaccess Generator
export function HtaccessGenerator() {
  const [redirects, setRedirects] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    let htaccess = '# .htaccess file\nRewriteEngine On\n\n';
    if (redirects) {
      redirects.split('\n').filter(r => r.trim()).forEach(r => {
        const [from, to] = r.split('->').map(s => s.trim());
        if (from && to) htaccess += `Redirect 301 ${from} ${to}\n`;
      });
    }
    htaccess += '\n# Security Headers\n<IfModule mod_headers.c>\n  Header set X-Content-Type-Options "nosniff"\n  Header set X-Frame-Options "SAMEORIGIN"\n  Header set X-XSS-Protection "1; mode=block"\n</IfModule>';
    setOutput(htaccess);
  };

  return (
    <ToolWrapper title=".htaccess Generator" description="Generate .htaccess redirect rules">
      <div className="glass rounded-2xl p-6">
        <div><label className="text-sm text-gray-300">Redirects (format: /old {'->'} /new, one per line):</label><textarea value={redirects} onChange={(e) => setRedirects(e.target.value)} placeholder="/old-page {'->'} /new-page" className="mt-1 w-full h-24 px-4 py-3 rounded-xl resize-none" /></div>
        <div className="mt-3"><ToolButton onClick={generate}>Generate .htaccess</ToolButton></div>
        {output && <div className="mt-4"><pre className="p-4 bg-gray-900 rounded-xl text-sm text-green-400 font-mono overflow-auto">{output}</pre><button onClick={() => { const blob = new Blob([output], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '.htaccess'; a.click(); }} className="mt-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm">Download .htaccess</button></div>}
      </div>
    </ToolWrapper>
  );
}

// Canonical URL Generator
export function CanonicalGenerator() {
  const [url, setUrl] = useState('');
  const output = url ? `<link rel="canonical" href="${url}" />` : '';

  return (
    <ToolWrapper title="Canonical URL Generator" description="Generate canonical URL tags">
      <div className="glass rounded-2xl p-6">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className="w-full px-4 py-3 rounded-xl" />
        {output && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"><code className="text-sm text-indigo-300 font-mono break-all">{output}</code><button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 block text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// ============ MEDIA TOOLS ============

// YAML to JSON
export function YAMLToJSON() {
  const [yaml, setYaml] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      const obj: Record<string, any> = {};
      yaml.split('\n').forEach(line => {
        const match = line.match(/^(\s*)(\w+):\s*(.+)$/);
        if (match) { obj[match[2]] = match[3].replace(/^["']|["']$/g, ''); }
      });
      setJson(JSON.stringify(obj, null, 2));
    } catch { setJson('Error parsing YAML'); }
  };

  return (
    <ToolWrapper title="YAML to JSON" description="Convert YAML to JSON format">
      <div className="glass rounded-2xl p-6">
        <textarea value={yaml} onChange={(e) => setYaml(e.target.value)} placeholder="Paste YAML..." className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" />
        <div className="mt-3"><ToolButton onClick={convert}>Convert to JSON</ToolButton></div>
        {json && <div className="mt-4"><textarea value={json} readOnly className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm bg-white/5 resize-none" /><button onClick={() => navigator.clipboard.writeText(json)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// JSON to YAML
export function JSONToYAML() {
  const [json, setJson] = useState('');
  const [yaml, setYaml] = useState('');

  const convert = () => {
    try {
      const obj = JSON.parse(json);
      const toYaml = (o: any, indent = 0): string => {
        let result = '';
        const prefix = '  '.repeat(indent);
        Object.entries(o).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            result += `${prefix}${key}:\n${toYaml(value, indent + 1)}`;
          } else {
            result += `${prefix}${key}: ${value}\n`;
          }
        });
        return result;
      };
      setYaml(toYaml(obj));
    } catch { setYaml('Invalid JSON'); }
  };

  return (
    <ToolWrapper title="JSON to YAML" description="Convert JSON to YAML format">
      <div className="glass rounded-2xl p-6">
        <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='Paste JSON...' className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" />
        <div className="mt-3"><ToolButton onClick={convert}>Convert to YAML</ToolButton></div>
        {yaml && <div className="mt-4"><textarea value={yaml} readOnly className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm bg-white/5 resize-none" /><button onClick={() => navigator.clipboard.writeText(yaml)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// TSV to JSON
export function TSVToJSON() {
  const [tsv, setTsv] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    const lines = tsv.trim().split('\n');
    const headers = lines[0].split('\t');
    const result = lines.slice(1).map(line => {
      const values = line.split('\t');
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
      return obj;
    });
    setJson(JSON.stringify(result, null, 2));
  };

  return (
    <ToolWrapper title="TSV to JSON" description="Convert TSV (tab-separated) to JSON">
      <div className="glass rounded-2xl p-6">
        <textarea value={tsv} onChange={(e) => setTsv(e.target.value)} placeholder="Paste TSV data..." className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm resize-none" />
        <div className="mt-3"><ToolButton onClick={convert}>Convert to JSON</ToolButton></div>
        {json && <div className="mt-4"><textarea value={json} readOnly className="w-full h-32 px-4 py-3 rounded-xl font-mono text-sm bg-white/5 resize-none" /><button onClick={() => navigator.clipboard.writeText(json)} className="mt-2 text-xs text-indigo-400 hover:underline">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// ============ SECURITY TOOLS ============

// Terms Generator
export function TermsGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [generated, setGenerated] = useState('');

  const generate = () => {
    setGenerated(`TERMS OF SERVICE\n\nLast Updated: ${new Date().toLocaleDateString()}\n\nWelcome to ${companyName || '[Company Name]'}.\n\n1. ACCEPTANCE OF TERMS\nBy accessing and using this website, you accept and agree to be bound by these Terms of Service.\n\n2. USE LICENSE\nPermission is granted to temporarily use the materials on ${companyName || '[Company Name]'}'s website for personal, non-commercial transitory viewing only.\n\n3. DISCLAIMER\nThe materials on ${companyName || '[Company Name]'}'s website are provided on an 'as is' basis. ${companyName || '[Company Name]'} makes no warranties, expressed or implied.\n\n4. LIMITATIONS\nIn no event shall ${companyName || '[Company Name]'} be held liable for any damages arising from the use of its website.\n\n5. CONTACT\nFor questions about these Terms, contact us at ${email || '[email]'}.`);
  };

  return (
    <ToolWrapper title="Terms of Service Generator" description="Generate terms of service pages">
      <div className="glass rounded-2xl p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-300">Company Name:</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
          <div><label className="text-sm text-gray-300">Contact Email:</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
        </div>
        <div className="mt-4"><ToolButton onClick={generate}>Generate Terms</ToolButton></div>
        {generated && <div className="mt-4"><textarea value={generated} readOnly className="w-full h-64 px-4 py-3 rounded-xl bg-white/5 resize-none text-sm" /><div className="mt-2 flex space-x-2"><button onClick={() => navigator.clipboard.writeText(generated)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm">Copy</button></div></div>}
      </div>
    </ToolWrapper>
  );
}

// Disclaimer Generator
export function DisclaimerGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [generated, setGenerated] = useState('');

  const generate = () => {
    setGenerated(`DISCLAIMER\n\nLast Updated: ${new Date().toLocaleDateString()}\n\nIf you require any more information or have any questions about our site's disclaimer, please feel free to contact us.\n\nDISCLAIMER FOR ${companyName || '[COMPANY NAME]'}\n\nAll the information on this website is published in good faith and for general information purpose only. ${companyName || '[Company Name]'} does not make any warranties about the completeness, reliability and accuracy of this information.\n\nAny action you take upon the information you find on this website is strictly at your own risk. ${companyName || '[Company Name]'} will not be liable for any losses and/or damages in connection with the use of our website.\n\nFrom our website, you can visit other websites by following hyperlinks. While we strive to provide only quality links, we have no control over the content and nature of these sites.\n\nPlease note that when you leave our website, other sites may have different privacy policies and terms which are beyond our control.`);
  };

  return (
    <ToolWrapper title="Disclaimer Generator" description="Generate disclaimer text for your website">
      <div className="glass rounded-2xl p-6">
        <div><label className="text-sm text-gray-300">Company/Website Name:</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl" /></div>
        <div className="mt-4"><ToolButton onClick={generate}>Generate Disclaimer</ToolButton></div>
        {generated && <div className="mt-4"><textarea value={generated} readOnly className="w-full h-64 px-4 py-3 rounded-xl bg-white/5 resize-none text-sm" /><button onClick={() => navigator.clipboard.writeText(generated)} className="mt-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm">Copy</button></div>}
      </div>
    </ToolWrapper>
  );
}

// ============ DAILY TOOLS ============

// Typing Speed Test
export function TypingTest() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [finished, setFinished] = useState(false);

  const sampleTexts = [
    'The quick brown fox jumps over the lazy dog near the peaceful river.',
    'Programming is the art of telling another human what one wants the computer to do.',
    'Success is not final, failure is not fatal, it is the courage to continue that counts.',
  ];

  useEffect(() => { setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]); }, []);

  const handleInput = (val: string) => {
    if (!startTime) setStartTime(Date.now());
    setInput(val);
    if (val === text) {
      const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
      const words = text.split(' ').length;
      setWpm(Math.round(words / elapsed));
      setFinished(true);
    }
  };

  const reset = () => { setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]); setInput(''); setStartTime(null); setWpm(0); setFinished(false); };

  return (
    <ToolWrapper title="Typing Speed Test" description="Test your typing speed in words per minute">
      <div className="glass rounded-2xl p-6">
        <div className="p-4 bg-white/5 rounded-xl mb-4">
          <p className="text-lg text-gray-300 font-mono leading-relaxed">
            {text.split('').map((char, i) => (
              <span key={i} className={i < input.length ? (input[i] === char ? 'text-green-400' : 'text-red-400 bg-red-500/20') : i === input.length ? 'bg-indigo-500/30' : 'text-gray-500'}>{char}</span>
            ))}
          </p>
        </div>
        <textarea value={input} onChange={(e) => handleInput(e.target.value)} placeholder="Start typing..." className="w-full h-20 px-4 py-3 rounded-xl resize-none" disabled={finished} />
        {finished && <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center"><span className="text-3xl font-bold text-indigo-400">{wpm} WPM</span><p className="text-sm text-gray-400 mt-1">Words per minute</p></div>}
        <div className="mt-4"><ToolButton onClick={reset}>New Test</ToolButton></div>
      </div>
    </ToolWrapper>
  );
}

// Pomodoro Timer
export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          setRunning(false);
          if (mode === 'work') { setSessions(s => s + 1); setMode('break'); setMinutes(5); }
          else { setMode('work'); setMinutes(25); }
          return;
        }
        setMinutes(m => m - 1); setSeconds(59);
      } else setSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running, minutes, seconds, mode]);

  const reset = () => { setRunning(false); setMinutes(mode === 'work' ? 25 : 5); setSeconds(0); };

  return (
    <ToolWrapper title="Pomodoro Timer" description="Focus timer for productivity">
      <div className="glass rounded-2xl p-8 text-center max-w-md mx-auto">
        <div className={`inline-flex px-4 py-1 rounded-full text-sm font-medium mb-6 ${mode === 'work' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {mode === 'work' ? '🔥 Focus Time' : '☕ Break Time'}
        </div>
        <div className="text-6xl font-mono font-bold text-white mb-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center space-x-3">
          <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-xl font-medium ${running ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}>
            {running ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset} className="px-8 py-3 bg-white/5 text-gray-300 rounded-xl font-medium hover:bg-white/10">Reset</button>
        </div>
        <p className="mt-6 text-sm text-gray-500">Sessions completed: {sessions}</p>
      </div>
    </ToolWrapper>
  );
}

// BMI Chart
export function BMIChart() {
  return (
    <ToolWrapper title="BMI Chart" description="Visual BMI reference chart">
      <div className="glass rounded-2xl p-6">
        <div className="space-y-3">
          {[
            { range: '< 16', label: 'Severe Thinness', color: 'bg-blue-600', width: 'w-1/5' },
            { range: '16 - 17', label: 'Moderate Thinness', color: 'bg-blue-400', width: 'w-1/5' },
            { range: '17 - 18.5', label: 'Mild Thinness', color: 'bg-cyan-400', width: 'w-1/5' },
            { range: '18.5 - 25', label: 'Normal', color: 'bg-green-500', width: 'w-1/4' },
            { range: '25 - 30', label: 'Overweight', color: 'bg-yellow-500', width: 'w-1/5' },
            { range: '30 - 35', label: 'Obese Class I', color: 'bg-orange-500', width: 'w-1/5' },
            { range: '35 - 40', label: 'Obese Class II', color: 'bg-red-500', width: 'w-1/6' },
            { range: '40 and above', label: 'Obese Class III', color: 'bg-red-700', width: 'w-1/6' },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className={`h-8 ${item.width} ${item.color} rounded-lg flex items-center px-3`}>
                <span className="text-xs text-white font-medium">{item.range}</span>
              </div>
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}

// Breathing Exercise
export function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!running) return;
    const phases = [
      { name: 'Breathe In', scale: 1.5, duration: 4000 },
      { name: 'Hold', scale: 1.5, duration: 4000 },
      { name: 'Breathe Out', scale: 1, duration: 4000 },
      { name: 'Hold', scale: 1, duration: 4000 },
    ];
    let i = 0;
    const run = () => {
      setPhase(phases[i].name);
      setScale(phases[i].scale);
      i = (i + 1) % phases.length;
      setTimeout(run, phases[(i - 1 + phases.length) % phases.length].duration);
    };
    run();
  }, [running]);

  return (
    <ToolWrapper title="Breathing Exercise" description="Guided breathing exercises for relaxation">
      <div className="glass rounded-2xl p-8 text-center max-w-md mx-auto">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 transition-transform duration-[4000ms] ease-in-out flex items-center justify-center`} style={{ transform: `scale(${scale})` }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
          </div>
        </div>
        <p className="text-2xl font-bold text-white mb-2">{phase || 'Ready'}</p>
        <p className="text-sm text-gray-400 mb-6">4-4-4-4 Box Breathing</p>
        <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-xl font-medium ${running ? 'bg-red-500/20 text-red-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}>
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
    </ToolWrapper>
  );
}
