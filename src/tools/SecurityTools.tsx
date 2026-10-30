import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { ToolWrapper, DropZone } from './PDFTools';
import CryptoJS from 'crypto-js';

// Password Generator
export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (uppercase && lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    if (score <= 2) return { text: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { text: 'Medium', color: 'bg-yellow-500' };
    return { text: 'Strong', color: 'bg-green-500' };
  };

  return (
    <ToolWrapper title="Password Generator" description="Generate strong, secure passwords">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg">
        {password && (
          <div className="p-4 bg-gray-900 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <code className="text-lg text-green-400 font-mono break-all">{password}</code>
              <button onClick={() => navigator.clipboard.writeText(password)} className="ml-2 text-gray-400 hover:text-white">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${getStrength().color} transition-all`} style={{ width: `${(getStrength().text === 'Weak' ? 33 : getStrength().text === 'Medium' ? 66 : 100)}%` }}></div>
              </div>
              <span className="text-xs text-gray-400">{getStrength().text}</span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Length: {length}</label>
            <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2"><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /><span className="text-sm text-gray-700">Uppercase (A-Z)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /><span className="text-sm text-gray-700">Lowercase (a-z)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /><span className="text-sm text-gray-700">Numbers (0-9)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /><span className="text-sm text-gray-700">Symbols (!@#$)</span></label>
          </div>
        </div>
        <button onClick={generate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 mr-2" /> Generate Password
        </button>
      </div>
    </ToolWrapper>
  );
}

// Password Strength Checker
export function PasswordStrength() {
  const [password, setPassword] = useState('');

  const analyze = () => {
    let score = 0;
    const checks = [];
    if (password.length >= 8) { score++; checks.push('✓ At least 8 characters'); } else checks.push('✗ At least 8 characters');
    if (password.length >= 12) { score++; checks.push('✓ At least 12 characters'); } else checks.push('✗ At least 12 characters');
    if (/[a-z]/.test(password)) { score++; checks.push('✓ Contains lowercase'); } else checks.push('✗ Contains lowercase');
    if (/[A-Z]/.test(password)) { score++; checks.push('✓ Contains uppercase'); } else checks.push('✗ Contains uppercase');
    if (/[0-9]/.test(password)) { score++; checks.push('✓ Contains numbers'); } else checks.push('✗ Contains numbers');
    if (/[^a-zA-Z0-9]/.test(password)) { score++; checks.push('✓ Contains symbols'); } else checks.push('✗ Contains symbols');
    if (!/(.)\1{2,}/.test(password)) { score++; checks.push('✓ No repeated patterns'); } else checks.push('✗ No repeated patterns');
    
    const entropy = password.length * Math.log2(95);
    const crackTime = Math.pow(2, entropy) / 1e12;
    let timeStr = 'Instant';
    if (crackTime > 1) timeStr = `${crackTime.toFixed(0)} seconds`;
    if (crackTime > 60) timeStr = `${(crackTime / 60).toFixed(0)} minutes`;
    if (crackTime > 3600) timeStr = `${(crackTime / 3600).toFixed(0)} hours`;
    if (crackTime > 86400) timeStr = `${(crackTime / 86400).toFixed(0)} days`;
    if (crackTime > 31536000) timeStr = `${(crackTime / 31536000).toFixed(0)} years`;
    if (crackTime > 31536000 * 1000) timeStr = 'Centuries+';

    return { score, checks, timeStr, entropy: entropy.toFixed(1) };
  };

  const analysis = password ? analyze() : null;

  return (
    <ToolWrapper title="Password Strength Checker" description="Analyze the strength of your password">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg">
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password to check..." className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
        {analysis && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${analysis.score <= 3 ? 'bg-red-500' : analysis.score <= 5 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(analysis.score / 7) * 100}%` }}></div>
              </div>
              <span className="text-sm font-medium">{analysis.score}/7</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-800">{analysis.entropy}</div>
                <div className="text-xs text-gray-500">Entropy bits</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-800">{analysis.timeStr}</div>
                <div className="text-xs text-gray-500">Time to crack</div>
              </div>
            </div>
            <div className="space-y-1">
              {analysis.checks.map((check, i) => (
                <p key={i} className={`text-sm ${check.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{check}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Text Encryptor
export function TextEncryptor() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const handleProcess = () => {
    if (!text || !key) return;
    try {
      if (mode === 'encrypt') {
        setResult(CryptoJS.AES.encrypt(text, key).toString());
      } else {
        const bytes = CryptoJS.AES.decrypt(text, key);
        setResult(bytes.toString(CryptoJS.enc.Utf8));
      }
    } catch { setResult('Error: Invalid input or wrong key'); }
  };

  return (
    <ToolWrapper title="Text Encryptor / Decryptor" description="Encrypt and decrypt text using AES encryption">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-3">
          <select value={mode} onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')} className="px-3 py-2 border border-gray-200 rounded-lg">
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text...'} className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
        <div className="mt-3">
          <label className="text-sm text-gray-700">Secret Key:</label>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={handleProcess} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
        {result && (
          <div className="mt-4">
            <textarea value={result} readOnly className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none font-mono text-sm" />
            <button onClick={() => navigator.clipboard.writeText(result)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// File Hash Checker
export function HashChecker() {
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState('');

  const handleFile = async (files: File[]) => {
    const file = files[0];
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
    setHashes({
      'MD5': CryptoJS.MD5(wordArray).toString(),
      'SHA-1': CryptoJS.SHA1(wordArray).toString(),
      'SHA-256': CryptoJS.SHA256(wordArray).toString(),
    });
  };

  return (
    <ToolWrapper title="File Hash Checker" description="Generate file checksums (MD5, SHA-1, SHA-256)">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <DropZone onFiles={handleFile} multiple={false} />
        {fileName && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">File: <strong>{fileName}</strong></p>
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{algo}</span>
                  <button onClick={() => navigator.clipboard.writeText(hash)} className="text-xs text-blue-600 hover:underline">Copy</button>
                </div>
                <code className="text-xs text-gray-600 font-mono break-all">{hash}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Privacy Policy Generator
export function PrivacyPolicy() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [generated, setGenerated] = useState('');

  const generate = () => {
    const date = new Date().toLocaleDateString();
    setGenerated(`PRIVACY POLICY

Last Updated: ${date}

${companyName || '[Company Name]'} ("we", "us", or "our") operates ${website || '[Website URL]'} (the "Site").

This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Site.

1. INFORMATION COLLECTION
We collect several different types of information for various purposes:
- Personal Data: While using our Site, we may ask you to provide us with certain personally identifiable information, including but not limited to email address, name, and usage data.
- Usage Data: We may also collect information on how the Site is accessed and used.

2. USE OF DATA
${companyName || '[Company Name]'} uses the collected data for various purposes:
- To provide and maintain our Site
- To notify you about changes to our Site
- To provide customer support
- To gather analysis or valuable information to improve our Site
- To monitor the usage of our Site

3. COOKIES
We use cookies and similar tracking technologies to track the activity on our Site and hold certain information.

4. DATA SECURITY
The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure.

5. YOUR RIGHTS
You have the right to access, update, or delete the information we have on you.

6. CONTACT US
If you have any questions about this Privacy Policy, please contact us at ${email || '[email]'}.`);
  };

  return (
    <ToolWrapper title="Privacy Policy Generator" description="Generate a privacy policy for your website">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Company/Website Name:</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Website URL:</label><input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Contact Email:</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Policy</button>
        {generated && (
          <div className="mt-4">
            <textarea value={generated} readOnly className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none text-sm" />
            <div className="mt-2 flex space-x-2">
              <button onClick={() => navigator.clipboard.writeText(generated)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Copy</button>
              <button onClick={() => { const blob = new Blob([generated], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'privacy-policy.txt'; a.click(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Download</button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Random Number Generator
export function RandomNumber() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const nums: number[] = [];
    for (let i = 0; i < parseInt(count); i++) {
      nums.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }
    setResults(nums);
  };

  return (
    <ToolWrapper title="Random Number Generator" description="Generate random numbers within a range">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-sm text-gray-700">Min:</label><input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Max:</label><input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Count:</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="100" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={generate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
        {results.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{results.join(', ')}</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
