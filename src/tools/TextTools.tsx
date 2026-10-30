import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { ToolWrapper } from './PDFTools';

// Word Counter
export function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const readingTime = Math.ceil(words / 200);

  return (
    <ToolWrapper title="Word Counter" description="Count words, characters, sentences, and estimate reading time">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{words}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{chars}</div>
            <div className="text-xs text-gray-500">Characters</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{charsNoSpace}</div>
            <div className="text-xs text-gray-500">No Spaces</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{sentences}</div>
            <div className="text-xs text-gray-500">Sentences</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-600">{paragraphs}</div>
            <div className="text-xs text-gray-500">Paragraphs</div>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-teal-600">{readingTime}m</div>
            <div className="text-xs text-gray-500">Read Time</div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Case Converter
export function CaseConverter() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const convert = (type: string) => {
    switch (type) {
      case 'upper': setResult(text.toUpperCase()); break;
      case 'lower': setResult(text.toLowerCase()); break;
      case 'title': setResult(text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())); break;
      case 'sentence': setResult(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())); break;
      case 'camel': setResult(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())); break;
      case 'snake': setResult(text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')); break;
      case 'kebab': setResult(text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); break;
      case 'toggle': setResult(text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')); break;
    }
  };

  return (
    <ToolWrapper title="Case Converter" description="Convert text between different cases">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
        <div className="flex flex-wrap gap-2 mt-4">
          {['upper', 'lower', 'title', 'sentence', 'camel', 'snake', 'kebab', 'toggle'].map(type => (
            <button key={type} onClick={() => convert(type)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 capitalize">
              {type} case
            </button>
          ))}
        </div>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <Copy className="w-4 h-4 mr-2" /> Copy Result
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text Repeater
export function TextRepeater() {
  const [text, setText] = useState('');
  const [times, setTimes] = useState(5);
  const [separator, setSeparator] = useState(' ');
  const [result, setResult] = useState('');

  const handleRepeat = () => {
    setResult(Array(times).fill(text).join(separator));
  };

  return (
    <ToolWrapper title="Text Repeater" description="Repeat text multiple times with custom separator">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Text to repeat:</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Times:</label>
              <input type="number" value={times} onChange={(e) => setTimes(Number(e.target.value))} min="1" max="1000" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Separator:</label>
              <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value=" ">Space</option>
                <option value="\n">New Line</option>
                <option value=", ">Comma</option>
                <option value="">None</option>
              </select>
            </div>
          </div>
          <button onClick={handleRepeat} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Repeat</button>
        </div>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Lorem Ipsum Generator
export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [result, setResult] = useState('');

  const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

  const generate = () => {
    const paras = [];
    for (let p = 0; p < paragraphs; p++) {
      const sentences = [];
      const numSentences = 3 + Math.floor(Math.random() * 5);
      for (let s = 0; s < numSentences; s++) {
        const numWords = 8 + Math.floor(Math.random() * 12);
        const words = [];
        for (let w = 0; w < numWords; w++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
      }
      paras.push(sentences.join(' '));
    }
    setResult(paras.join('\n\n'));
  };

  return (
    <ToolWrapper title="Lorem Ipsum Generator" description="Generate placeholder text for your designs">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Paragraphs:</label>
          <input type="number" value={paragraphs} onChange={(e) => setParagraphs(Number(e.target.value))} min="1" max="50" className="w-20 px-3 py-2 border border-gray-200 rounded-lg" />
          <button onClick={generate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
        </div>
        {result && (
          <>
            <textarea value={result} readOnly className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none text-sm" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text to Slug
export function TextToSlug() {
  const [text, setText] = useState('');
  const slug = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  return (
    <ToolWrapper title="Text to Slug" description="Convert text to URL-friendly slugs">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to convert..." className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
        {slug && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Slug:</p>
            <code className="text-lg text-green-700 font-mono">{slug}</code>
            <button onClick={() => navigator.clipboard.writeText(slug)} className="mt-2 block text-sm text-blue-600 hover:underline">Copy slug</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Remove Duplicates
export function RemoveDuplicates() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleRemove = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    setResult(unique.join('\n'));
  };

  return (
    <ToolWrapper title="Remove Duplicate Lines" description="Remove duplicate lines from text">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text with duplicate lines..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <button onClick={handleRemove} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Remove Duplicates</button>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none" />
            <p className="text-sm text-gray-500 mt-1">Removed {text.split('\n').length - result.split('\n').length} duplicate lines</p>
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text Sorter
export function TextSorter() {
  const [text, setText] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [result, setResult] = useState('');

  const handleSort = () => {
    const lines = text.split('\n').filter(l => l.trim());
    lines.sort((a, b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    setResult(lines.join('\n'));
  };

  return (
    <ToolWrapper title="Text Sorter" description="Sort lines of text alphabetically">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter lines to sort..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <div className="flex items-center space-x-3 mt-3">
          <select value={order} onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')} className="px-3 py-2 border border-gray-200 rounded-lg">
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
          <button onClick={handleSort} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sort</button>
        </div>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Find and Replace
export function FindReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState('');

  const handleReplace = () => {
    if (caseSensitive) {
      setResult(text.split(find).join(replace));
    } else {
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      setResult(text.replace(regex, replace));
    }
  };

  return (
    <ToolWrapper title="Find & Replace" description="Find and replace text patterns">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <input type="text" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find..." className="px-3 py-2 border border-gray-200 rounded-lg" />
          <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with..." className="px-3 py-2 border border-gray-200 rounded-lg" />
        </div>
        <label className="flex items-center mt-2 space-x-2">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          <span className="text-sm text-gray-600">Case sensitive</span>
        </label>
        <button onClick={handleReplace} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Replace All</button>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Reverse Text
export function ReverseText() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'chars' | 'words'>('chars');
  const result = mode === 'chars' ? text.split('').reverse().join('') : text.split(' ').reverse().join(' ');

  return (
    <ToolWrapper title="Reverse Text" description="Reverse text characters or word order">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to reverse..." className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <div className="flex items-center space-x-3 mt-3">
          <select value={mode} onChange={(e) => setMode(e.target.value as 'chars' | 'words')} className="px-3 py-2 border border-gray-200 rounded-lg">
            <option value="chars">Reverse Characters</option>
            <option value="words">Reverse Words</option>
          </select>
        </div>
        {text && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-mono text-blue-700 break-all">{result}</p>
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 text-sm text-blue-600 hover:underline">Copy result</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text Diff
export function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<{ type: string; text: string }[]>([]);

  const handleCompare = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: { type: string; text: string }[] = [];
    const maxLen = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= lines1.length) result.push({ type: 'added', text: lines2[i] });
      else if (i >= lines2.length) result.push({ type: 'removed', text: lines1[i] });
      else if (lines1[i] !== lines2[i]) {
        result.push({ type: 'removed', text: lines1[i] });
        result.push({ type: 'added', text: lines2[i] });
      } else {
        result.push({ type: 'same', text: lines1[i] });
      }
    }
    setDiff(result);
  };

  return (
    <ToolWrapper title="Text Diff Checker" description="Compare two texts and find differences">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Original text:</label>
            <textarea value={text1} onChange={(e) => setText1(e.target.value)} className="mt-1 w-full h-32 px-3 py-2 border border-gray-200 rounded-lg resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Modified text:</label>
            <textarea value={text2} onChange={(e) => setText2(e.target.value)} className="mt-1 w-full h-32 px-3 py-2 border border-gray-200 rounded-lg resize-none" />
          </div>
        </div>
        <button onClick={handleCompare} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Compare</button>
        {diff.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg font-mono text-sm max-h-64 overflow-auto">
            {diff.map((line, i) => (
              <div key={i} className={`px-2 py-0.5 ${line.type === 'added' ? 'bg-green-100 text-green-800' : line.type === 'removed' ? 'bg-red-100 text-red-800' : ''}`}>
                {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
