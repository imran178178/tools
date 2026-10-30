import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { ToolWrapper, DropZone } from './PDFTools';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// JSON Formatter
export function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) { setError(e.message); setOutput(''); }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) { setError(e.message); setOutput(''); }
  };

  return (
    <ToolWrapper title="JSON Formatter" description="Format, validate, and beautify JSON data">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here...' className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <div className="flex space-x-3 mt-3">
          <button onClick={format} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Beautify</button>
          <button onClick={minify} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Minify</button>
          <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Copy</button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">Error: {error}</p>}
        {output && <textarea value={output} readOnly className="mt-3 w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />}
      </div>
    </ToolWrapper>
  );
}

// JSON Minifier
export function JSONMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleMinify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); } catch { setOutput('Invalid JSON'); }
  };

  return (
    <ToolWrapper title="JSON Minifier" description="Minify JSON to reduce file size">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={handleMinify} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Minify</button>
        {output && <textarea value={output} readOnly className="mt-3 w-full h-20 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />}
      </div>
    </ToolWrapper>
  );
}

// Base64 Encoder/Decoder
export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleProcess = () => {
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else setOutput(decodeURIComponent(escape(atob(input))));
    } catch { setOutput('Error: Invalid input for ' + mode); }
  };

  return (
    <ToolWrapper title="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 to text">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-3">
          <select value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} className="px-3 py-2 border border-gray-200 rounded-lg">
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
          <button onClick={handleProcess} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Process</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        {output && (
          <div className="mt-3">
            <textarea value={output} readOnly className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none font-mono text-sm" />
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// URL Encoder/Decoder
export function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleProcess = () => {
    try {
      if (mode === 'encode') setOutput(encodeURIComponent(input));
      else setOutput(decodeURIComponent(input));
    } catch { setOutput('Error: Invalid input'); }
  };

  return (
    <ToolWrapper title="URL Encoder/Decoder" description="Encode or decode URL strings">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-3">
          <select value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} className="px-3 py-2 border border-gray-200 rounded-lg">
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
          <button onClick={handleProcess} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Process</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter URL or text..." className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        {output && (
          <div className="mt-3">
            <textarea value={output} readOnly className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none font-mono text-sm" />
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Hash Generator
export function HashGenerator() {
  const [input, setInput] = useState('');
  const hashes = {
    MD5: input ? CryptoJS.MD5(input).toString() : '',
    'SHA-1': input ? CryptoJS.SHA1(input).toString() : '',
    'SHA-256': input ? CryptoJS.SHA256(input).toString() : '',
    'SHA-512': input ? CryptoJS.SHA512(input).toString() : '',
  };

  return (
    <ToolWrapper title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        {input && (
          <div className="mt-4 space-y-3">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{algo}</span>
                  <button onClick={() => navigator.clipboard.writeText(hash)} className="text-xs text-blue-600 hover:underline">Copy</button>
                </div>
                <code className="text-xs text-gray-600 font-mono break-all mt-1 block">{hash}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// UUID Generator
export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  return (
    <ToolWrapper title="UUID Generator" description="Generate universally unique identifiers (UUIDs)">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <label className="text-sm font-medium text-gray-700">Count:</label>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min="1" max="100" className="w-20 px-3 py-2 border border-gray-200 rounded-lg" />
          <button onClick={generate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
        </div>
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <code className="text-sm font-mono text-gray-700">{uuid}</code>
              <button onClick={() => navigator.clipboard.writeText(uuid)} className="text-xs text-blue-600 hover:underline">Copy</button>
            </div>
          ))}
        </div>
        <button onClick={() => navigator.clipboard.writeText(uuids.join('\n'))} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy All</button>
      </div>
    </ToolWrapper>
  );
}

// Regex Tester
export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);

  const handleTest = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = testText.match(regex);
      setMatches(found || []);
    } catch { setMatches([]); }
  };

  return (
    <ToolWrapper title="Regex Tester" description="Test regular expressions against text">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex space-x-3 mb-3">
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex pattern..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono" />
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" className="w-20 px-3 py-2 border border-gray-200 rounded-lg font-mono" />
        </div>
        <textarea value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="Test text..." className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <button onClick={handleTest} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Test</button>
        {matches.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-700 mb-2">{matches.length} match(es) found:</p>
            <div className="flex flex-wrap gap-2">
              {matches.map((m, i) => (
                <span key={i} className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm font-mono">{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// HTML Formatter
export function HTMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatHTML = (html: string) => {
    let formatted = '';
    let indent = 0;
    const tags = html.replace(/></g, '>\n<').split('\n');
    tags.forEach(tag => {
      if (tag.match(/^<\/\w/)) indent--;
      formatted += '  '.repeat(Math.max(0, indent)) + tag.trim() + '\n';
      if (tag.match(/^<\w[^>]*[^\/]>$/) && !tag.match(/^<(br|hr|img|input|meta|link)/)) indent++;
    });
    return formatted;
  };

  return (
    <ToolWrapper title="HTML Formatter" description="Format and beautify HTML code">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={() => setOutput(formatHTML(input))} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Format HTML</button>
        {output && (
          <>
            <textarea value={output} readOnly className="mt-3 w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </>
        )}
      </div>
    </ToolWrapper>
  );
}

// CSS Minifier
export function CSSMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minify = () => {
    setOutput(input.replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*;\s*/g, ';').replace(/;\}/g, '}').trim());
  };

  return (
    <ToolWrapper title="CSS Minifier" description="Minify CSS to reduce file size">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste CSS..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={minify} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Minify CSS</button>
        {output && (
          <>
            <textarea value={output} readOnly className="mt-3 w-full h-24 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </>
        )}
      </div>
    </ToolWrapper>
  );
}

// Markdown Preview
export function MarkdownPreview() {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```code```\n\n> Blockquote');

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  };

  return (
    <ToolWrapper title="Markdown Preview" description="Write Markdown and see live HTML preview">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Markdown</label>
            <textarea value={md} onChange={(e) => setMd(e.target.value)} className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Preview</label>
            <div className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg overflow-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }} />
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Color Code Converter
export function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });

  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    setRgb({ r, g, b });
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    setHex('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <ToolWrapper title="Color Code Converter" description="Convert between HEX, RGB, and HSL color formats">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-6">
          <input type="color" value={hex} onChange={(e) => { setHex(e.target.value); hexToRgb(e.target.value); }} className="w-16 h-16 rounded-lg cursor-pointer border-0" />
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-sm text-gray-500">HEX:</label>
              <input type="text" value={hex} onChange={(e) => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) hexToRgb(e.target.value); }} className="ml-2 px-3 py-1 border border-gray-200 rounded font-mono" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-500">RGB:</label>
              <input type="number" value={rgb.r} onChange={(e) => { const r = Number(e.target.value); setRgb({ ...rgb, r }); rgbToHex(r, rgb.g, rgb.b); }} className="w-16 px-2 py-1 border border-gray-200 rounded text-center" min="0" max="255" />
              <input type="number" value={rgb.g} onChange={(e) => { const g = Number(e.target.value); setRgb({ ...rgb, g }); rgbToHex(rgb.r, g, rgb.b); }} className="w-16 px-2 py-1 border border-gray-200 rounded text-center" min="0" max="255" />
              <input type="number" value={rgb.b} onChange={(e) => { const b = Number(e.target.value); setRgb({ ...rgb, b }); rgbToHex(rgb.r, rgb.g, b); }} className="w-16 px-2 py-1 border border-gray-200 rounded text-center" min="0" max="255" />
            </div>
          </div>
        </div>
        <div className="mt-4 h-16 rounded-lg" style={{ backgroundColor: hex }}></div>
      </div>
    </ToolWrapper>
  );
}

// JWT Decoder
export function JWTDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');

  const decode = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
    } catch { setHeader('Invalid JWT token'); setPayload(''); }
  };

  return (
    <ToolWrapper title="JWT Decoder" description="Decode and inspect JSON Web Tokens">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste JWT token..." className="w-full h-20 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={decode} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Decode</button>
        {header && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Header</h3>
              <pre className="p-3 bg-gray-50 rounded-lg text-xs font-mono overflow-auto">{header}</pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Payload</h3>
              <pre className="p-3 bg-gray-50 rounded-lg text-xs font-mono overflow-auto">{payload}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
