import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { ToolWrapper, DropZone } from './PDFTools';

// Meta Tag Generator
export function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    setOutput(`<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="index, follow">`);
  };

  return (
    <ToolWrapper title="Meta Tag Generator" description="Generate HTML meta tags for your website">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Page Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-20" /></div>
          <div><label className="text-sm text-gray-700">Keywords (comma separated):</label><input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Author:</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Tags</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-auto">{output}</pre>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Robots.txt Generator
export function RobotsGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState('/admin/\n/private/');
  const [sitemap, setSitemap] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    let txt = 'User-agent: *\n';
    if (allowAll) {
      txt += 'Allow: /\n';
    }
    disallowPaths.split('\n').filter(p => p.trim()).forEach(path => {
      txt += `Disallow: ${path.trim()}\n`;
    });
    if (sitemap) txt += `\nSitemap: ${sitemap}`;
    setOutput(txt);
  };

  return (
    <ToolWrapper title="Robots.txt Generator" description="Generate a robots.txt file for your website">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <label className="flex items-center space-x-2"><input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} /><span className="text-sm text-gray-700">Allow all pages by default</span></label>
          <div><label className="text-sm text-gray-700">Disallow paths (one per line):</label><textarea value={disallowPaths} onChange={(e) => setDisallowPaths(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-24" /></div>
          <div><label className="text-sm text-gray-700">Sitemap URL:</label><input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="https://example.com/sitemap.xml" /></div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-auto">{output}</pre>
            <button onClick={() => { const blob = new Blob([output], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'robots.txt'; a.click(); }} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Download robots.txt</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Sitemap Generator
export function SitemapGenerator() {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
  const [output, setOutput] = useState('');

  const generate = () => {
    const urlList = urls.split('\n').filter(u => u.trim());
    const date = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urlList.forEach(url => {
      xml += `  <url>\n    <loc>${url.trim()}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;
    setOutput(xml);
  };

  return (
    <ToolWrapper title="Sitemap Generator" description="Generate XML sitemap for your website">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div><label className="text-sm text-gray-700">URLs (one per line):</label><textarea value={urls} onChange={(e) => setUrls(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-32 font-mono text-sm" /></div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Sitemap</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto max-h-64">{output}</pre>
            <button onClick={() => { const blob = new Blob([output], { type: 'application/xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sitemap.xml'; a.click(); }} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Download sitemap.xml</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Open Graph Generator
export function OGGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('website');
  const [output, setOutput] = useState('');

  const generate = () => {
    setOutput(`<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${title}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">`);
  };

  return (
    <ToolWrapper title="Open Graph Generator" description="Generate Open Graph and Twitter Card meta tags">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-16" /></div>
          <div><label className="text-sm text-gray-700">Image URL:</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Page URL:</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value="website">Website</option><option value="article">Article</option><option value="product">Product</option><option value="profile">Profile</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Tags</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-auto">{output}</pre>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Keyword Density Checker
export function KeywordDensity() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<{ word: string; count: number; density: string }[]>([]);

  const analyze = () => {
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const total = words.length;
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
    setResults(sorted.map(([word, count]) => ({ word, count, density: ((count / total) * 100).toFixed(2) })));
  };

  return (
    <ToolWrapper title="Keyword Density Checker" description="Analyze keyword density in your text">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your content here..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <button onClick={analyze} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Analyze</button>
        {results.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="px-3 py-2 text-left">Keyword</th><th className="px-3 py-2 text-left">Count</th><th className="px-3 py-2 text-left">Density</th></tr></thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium">{r.word}</td>
                    <td className="px-3 py-2">{r.count}</td>
                    <td className="px-3 py-2">{r.density}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// SERP Preview
export function SERPPreview() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ToolWrapper title="SERP Preview" description="Preview how your page appears in Google search results">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3 mb-6">
          <div><label className="text-sm text-gray-700">Title (max 60 chars):</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /><span className="text-xs text-gray-400">{title.length}/60</span></div>
          <div><label className="text-sm text-gray-700">URL:</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Description (max 160 chars):</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={160} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-16" /><span className="text-xs text-gray-400">{description.length}/160</span></div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Google Search Preview:</p>
          <div className="max-w-lg">
            <p className="text-sm text-gray-600 truncate">{url || 'https://example.com'}</p>
            <h3 className="text-xl text-blue-700 hover:underline cursor-pointer truncate">{title || 'Page Title'}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description || 'Your meta description will appear here...'}</p>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Schema Markup Generator
export function SchemaGenerator() {
  const [type, setType] = useState('Organization');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const schema: any = { '@context': 'https://schema.org', '@type': type };
    if (name) schema.name = name;
    if (url) schema.url = url;
    if (description) schema.description = description;
    setOutput(JSON.stringify(schema, null, 2));
  };

  return (
    <ToolWrapper title="Schema Markup Generator" description="Generate structured data markup for search engines">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Schema Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value="Organization">Organization</option><option value="WebSite">WebSite</option><option value="Article">Article</option><option value="Product">Product</option><option value="Person">Person</option><option value="LocalBusiness">LocalBusiness</option>
            </select>
          </div>
          <div><label className="text-sm text-gray-700">Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">URL:</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-16" /></div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Schema</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-auto">{`<script type="application/ld+json">\n${output}\n</script>`}</pre>
            <button onClick={() => navigator.clipboard.writeText(`<script type="application/ld+json">\n${output}\n</script>`)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Twitter Card Generator
export function TwitterCard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    setOutput(`<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">`);
  };

  return (
    <ToolWrapper title="Twitter Card Generator" description="Generate Twitter Card meta tags">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg h-16" /></div>
          <div><label className="text-sm text-gray-700">Image URL:</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
        {output && (
          <div className="mt-4">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-auto">{output}</pre>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// CSV to JSON
export function CSVToJSON() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });
      return obj;
    });
    setJson(JSON.stringify(result, null, 2));
  };

  return (
    <ToolWrapper title="CSV to JSON" description="Convert CSV data to JSON format">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="Paste CSV data..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={convert} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert to JSON</button>
        {json && (
          <div className="mt-4">
            <textarea value={json} readOnly className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(json)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// JSON to CSV
export function JSONToCSV() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');

  const convert = () => {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data) || data.length === 0) { setCsv('Invalid: Expected array of objects'); return; }
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(h => `"${(item[h] || '').toString().replace(/"/g, '""')}"`).join(','));
      setCsv([headers.join(','), ...rows].join('\n'));
    } catch { setCsv('Invalid JSON'); }
  };

  return (
    <ToolWrapper title="JSON to CSV" description="Convert JSON data to CSV format">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='Paste JSON array...' className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={convert} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert to CSV</button>
        {csv && (
          <div className="mt-4">
            <textarea value={csv} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />
            <button onClick={() => { const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.csv'; a.click(); }} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Download CSV</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// XML to JSON
export function XMLToJSON() {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const xmlToObj = (node: Element): any => {
        const obj: any = {};
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            obj['@' + node.attributes[i].name] = node.attributes[i].value;
          }
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i] as Element;
          if (child.nodeType === 1) {
            const childObj = xmlToObj(child);
            if (obj[child.nodeName]) {
              if (!Array.isArray(obj[child.nodeName])) obj[child.nodeName] = [obj[child.nodeName]];
              obj[child.nodeName].push(childObj);
            } else {
              obj[child.nodeName] = childObj;
            }
          } else if (child.nodeType === 3 && child.textContent?.trim()) {
            obj['#text'] = child.textContent.trim();
          }
        }
        return Object.keys(obj).length === 1 && obj['#text'] ? obj['#text'] : obj;
      };
      setJson(JSON.stringify(xmlToObj(doc.documentElement), null, 2));
    } catch { setJson('Invalid XML'); }
  };

  return (
    <ToolWrapper title="XML to JSON" description="Convert XML data to JSON format">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={xml} onChange={(e) => setXml(e.target.value)} placeholder="Paste XML..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-none" />
        <button onClick={convert} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert to JSON</button>
        {json && (
          <div className="mt-4">
            <textarea value={json} readOnly className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(json)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text to Speech
export function TextToSpeech() {
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    speechSynthesis.speak(utterance);
  };

  const stop = () => { speechSynthesis.cancel(); };

  return (
    <ToolWrapper title="Text to Speech" description="Convert text to spoken audio using browser speech synthesis">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to speak..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div><label className="text-sm text-gray-700">Speed: {rate}x</label><input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" /></div>
          <div><label className="text-sm text-gray-700">Pitch: {pitch}</label><input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full" /></div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button onClick={speak} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">▶ Speak</button>
          <button onClick={stop} className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">■ Stop</button>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Audio Trimmer (basic)
export function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFile = (files: File[]) => {
    setFile(files[0]);
    const audio = new Audio(URL.createObjectURL(files[0]));
    audio.onloadedmetadata = () => { setDuration(audio.duration); setEndTime(audio.duration); };
  };

  return (
    <ToolWrapper title="Audio Trimmer" description="Trim audio files to a specific time range">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <DropZone onFiles={handleFile} accept="audio/*" multiple={false} />
        {file && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600"><strong>{file.name}</strong> — Duration: {duration.toFixed(1)}s</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-gray-700">Start (seconds):</label><input type="number" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} min="0" max={duration} step="0.1" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="text-sm text-gray-700">End (seconds):</label><input type="number" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} min="0" max={duration} step="0.1" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
            </div>
            <audio controls src={URL.createObjectURL(file)} className="w-full" />
            <p className="text-xs text-gray-400">Note: Browser-based audio trimming has limited capabilities. For full audio editing, consider dedicated audio software.</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Image to Favicon
export function ImageToIcon() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(files[0]);
  };

  const generate = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 32, 32);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <ToolWrapper title="Image to Favicon" description="Convert any image to a 32x32 favicon">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <DropZone onFiles={handleFile} accept="image/*" multiple={false} />
        {image && (
          <div className="mt-4 text-center">
            <img src={image} alt="Preview" className="max-h-32 rounded-lg mb-4 mx-auto" />
            <button onClick={generate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Favicon</button>
          </div>
        )}
        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <img src={result} alt="Favicon" className="mx-auto mb-3 border" style={{ imageRendering: 'pixelated' }} />
            <a href={result} download="favicon.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" /> Download Favicon
            </a>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
