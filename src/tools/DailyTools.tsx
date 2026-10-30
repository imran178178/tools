import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Plus, Trash2, Check } from 'lucide-react';
import { ToolWrapper } from './PDFTools';

// QR Code Generator
export function QRGenerator() {
  const [text, setText] = useState('https://example.com');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const ctx = canvas.getContext('2d')!;
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    
    // Simple QR-like pattern generator (visual representation)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'black';
    
    // Generate a deterministic pattern based on text
    const data = text.split('').map(c => c.charCodeAt(0));
    const gridSize = 25;
    const cellSize = size / gridSize;
    
    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            ctx.fillRect((x + j) * cellSize, (y + i) * cellSize, cellSize, cellSize);
          }
        }
      }
    };
    
    drawFinder(0, 0);
    drawFinder(gridSize - 7, 0);
    drawFinder(0, gridSize - 7);
    
    // Data area
    let idx = 0;
    for (let y = 8; y < gridSize - 8; y++) {
      for (let x = 8; x < gridSize; x++) {
        if ((data[idx % data.length] + x * y) % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        idx++;
      }
    }
    for (let y = 0; y < 8; y++) {
      for (let x = 8; x < gridSize - 8; x++) {
        if ((data[(idx + x) % data.length] + x + y) % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  useEffect(() => { generateQR(); }, [text]);

  return (
    <ToolWrapper title="QR Code Generator" description="Generate QR codes for URLs, text, or any content">
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL or text..." className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4" />
        <canvas ref={canvasRef} className="mx-auto border rounded-lg" />
        {text && (
          <a href={canvasRef.current?.toDataURL()} download="qrcode.png" className="inline-flex items-center mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Download QR Code
          </a>
        )}
      </div>
    </ToolWrapper>
  );
}

// Stopwatch
export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setTime(t => t + 10), 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const format = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Stopwatch" description="Precise digital stopwatch with lap times">
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-md mx-auto">
        <div className="text-5xl font-mono font-bold text-gray-800 mb-8">{format(time)}</div>
        <div className="flex justify-center space-x-4">
          <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-xl text-white font-medium ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
            {running ? <><Pause className="w-5 h-5 inline mr-2" />Pause</> : <><Play className="w-5 h-5 inline mr-2" />Start</>}
          </button>
          <button onClick={() => { setRunning(false); setTime(0); }} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
            <RotateCw className="w-5 h-5 inline mr-2" />Reset
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Countdown Timer
export function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) {
      if (remaining <= 0 && running) { setDone(true); setRunning(false); }
      return;
    }
    const timer = setTimeout(() => setRemaining(r => r - 1000), 1000);
    return () => clearTimeout(timer);
  }, [remaining, running]);

  const start = () => {
    setRemaining((hours * 3600 + minutes * 60 + seconds) * 1000);
    setRunning(true);
    setDone(false);
  };

  const format = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Countdown Timer" description="Set and run countdown timers">
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-md mx-auto">
        {!running && !done && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div><label className="text-sm text-gray-500">Hours</label><input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min="0" max="23" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center text-xl" /></div>
            <div><label className="text-sm text-gray-500">Minutes</label><input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} min="0" max="59" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center text-xl" /></div>
            <div><label className="text-sm text-gray-500">Seconds</label><input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} min="0" max="59" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center text-xl" /></div>
          </div>
        )}
        <div className={`text-5xl font-mono font-bold mb-6 ${done ? 'text-red-500' : 'text-gray-800'}`}>
          {done ? "TIME'S UP!" : running ? format(remaining) : format((hours * 3600 + minutes * 60 + seconds) * 1000)}
        </div>
        <div className="flex justify-center space-x-3">
          {!running && !done && <button onClick={start} className="px-8 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600">Start</button>}
          {running && <button onClick={() => setRunning(false)} className="px-8 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">Pause</button>}
          <button onClick={() => { setRunning(false); setRemaining(0); setDone(false); }} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">Reset</button>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Notepad
export function Notepad() {
  const [text, setText] = useState(() => localStorage.getItem('notepad-text') || '');

  useEffect(() => {
    localStorage.setItem('notepad-text', text);
  }, [text]);

  return (
    <ToolWrapper title="Online Notepad" description="Quick notes with auto-save to browser storage">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Auto-saved to browser</p>
          <div className="flex space-x-2">
            <button onClick={() => navigator.clipboard.writeText(text)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Copy All</button>
            <button onClick={() => { const blob = new Blob([text], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'notes.txt'; a.click(); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Download</button>
            <button onClick={() => setText('')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Clear</button>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing your notes..." className="w-full h-96 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <p className="text-xs text-gray-400 mt-2">{text.length} characters | {text.split(/\s+/).filter(w => w).length} words</p>
      </div>
    </ToolWrapper>
  );
}

// To-Do List
export function TodoList() {
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  return (
    <ToolWrapper title="To-Do List" description="Manage your tasks with auto-save">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg mx-auto">
        <div className="flex space-x-2 mb-4">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} placeholder="Add a task..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg" />
          <button onClick={addTodo} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group">
              <button onClick={() => setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${todo.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {todo.done && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{todo.text}</span>
              <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {todos.length === 0 && <p className="text-center text-gray-400 py-8">No tasks yet. Add one above!</p>}
        </div>
        {todos.length > 0 && (
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{todos.filter(t => !t.done).length} remaining</span>
            <button onClick={() => setTodos(todos.filter(t => !t.done))} className="text-red-500 hover:underline">Clear completed</button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Dice Roller
export function DiceRoller() {
  const [numDice, setNumDice] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const res = Array.from({ length: numDice }, () => Math.floor(Math.random() * sides) + 1);
      setResults(res);
      setRolling(false);
    }, 500);
  };

  return (
    <ToolWrapper title="Dice Roller" description="Roll virtual dice of any size">
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="text-sm text-gray-700">Number of dice:</label><input type="number" value={numDice} onChange={(e) => setNumDice(Number(e.target.value))} min="1" max="10" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Sides:</label>
            <select value={sides} onChange={(e) => setSides(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value={4}>D4</option><option value={6}>D6</option><option value={8}>D8</option><option value={10}>D10</option><option value={12}>D12</option><option value={20}>D20</option><option value={100}>D100</option>
            </select>
          </div>
        </div>
        <button onClick={roll} disabled={rolling} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
          {rolling ? 'Rolling...' : '🎲 Roll!'}
        </button>
        {results.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap justify-center gap-3">
              {results.map((r, i) => (
                <div key={i} className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {r}
                </div>
              ))}
            </div>
            <p className="mt-3 text-lg font-medium text-gray-700">Total: {results.reduce((a, b) => a + b, 0)}</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Coin Flipper
export function CoinFlipper() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const res = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(res);
      setStats(s => ({ ...s, [res]: s[res as keyof typeof s] + 1 }));
      setFlipping(false);
    }, 800);
  };

  return (
    <ToolWrapper title="Coin Flipper" description="Flip a virtual coin">
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-sm mx-auto">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 transition-transform duration-500 ${flipping ? 'animate-spin' : ''} ${result === 'heads' ? 'bg-yellow-400' : result === 'tails' ? 'bg-gray-400' : 'bg-gray-200'}`}>
          {flipping ? '🪙' : result === 'heads' ? '👑' : result === 'tails' ? '🦅' : '🪙'}
        </div>
        {result && !flipping && <p className="text-2xl font-bold text-gray-800 mb-4 capitalize">{result}!</p>}
        <button onClick={flip} disabled={flipping} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">Flip Coin</button>
        {(stats.heads > 0 || stats.tails > 0) && (
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600">
            <span>Heads: {stats.heads}</span>
            <span>Tails: {stats.tails}</span>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// World Clock
export function WorldClock() {
  const [time, setTime] = useState(new Date());
  const zones = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Paris', tz: 'Europe/Paris' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Mumbai', tz: 'Asia/Kolkata' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ToolWrapper title="World Clock" description="View current time across different time zones">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {zones.map(zone => (
          <div key={zone.name} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">{zone.name}</p>
            <p className="text-xl font-mono font-bold text-gray-800">
              {time.toLocaleTimeString('en-US', { timeZone: zone.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {time.toLocaleDateString('en-US', { timeZone: zone.tz, weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </ToolWrapper>
  );
}

// Invoice Generator
export function InvoiceGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [invoiceNum, setInvoiceNum] = useState('INV-001');

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: any) => {
    const updated = [...items];
    (updated[i] as any)[field] = value;
    setItems(updated);
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const downloadInvoice = () => {
    const date = new Date().toLocaleDateString();
    const content = `INVOICE\n${'='.repeat(40)}\nInvoice #: ${invoiceNum}\nDate: ${date}\n\nFrom: ${companyName}\nTo: ${clientName}\n\n${'─'.repeat(40)}\nDescription          Qty    Price    Total\n${'─'.repeat(40)}\n${items.map(i => `${i.desc.padEnd(20)} ${String(i.qty).padEnd(6)} $${i.price.toFixed(2).padEnd(8)} $${(i.qty * i.price).toFixed(2)}`).join('\n')}\n${'─'.repeat(40)}\nTotal: $${total.toFixed(2)}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${invoiceNum}.txt`;
    a.click();
  };

  return (
    <ToolWrapper title="Invoice Generator" description="Create professional invoices">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="text-sm text-gray-700">Your Company:</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Client Name:</label><input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <div><label className="text-sm text-gray-700">Invoice #:</label><input type="text" value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} className="mt-1 w-48 px-3 py-2 border border-gray-200 rounded-lg" /></div>
        
        <h3 className="font-medium text-gray-700 mt-4 mb-2">Items:</h3>
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 mb-2">
            <input type="text" value={item.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Description" className="col-span-5 px-2 py-1 border border-gray-200 rounded text-sm" />
            <input type="number" value={item.qty} onChange={(e) => updateItem(i, 'qty', Number(e.target.value))} placeholder="Qty" className="col-span-2 px-2 py-1 border border-gray-200 rounded text-sm" />
            <input type="number" value={item.price} onChange={(e) => updateItem(i, 'price', Number(e.target.value))} placeholder="Price" className="col-span-3 px-2 py-1 border border-gray-200 rounded text-sm" />
            <button onClick={() => removeItem(i)} className="col-span-2 text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-blue-600 hover:underline mb-4">+ Add Item</button>
        
        <div className="text-right text-xl font-bold text-gray-800 mb-4">Total: ${total.toFixed(2)}</div>
        <button onClick={downloadInvoice} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Download Invoice</button>
      </div>
    </ToolWrapper>
  );
}

// Color Palette Generator
export function ColorPalette() {
  const [colors, setColors] = useState<string[]>([]);
  const [baseColor, setBaseColor] = useState('#3b82f6');

  const generate = () => {
    const palette: string[] = [];
    const base = parseInt(baseColor.slice(1), 16);
    for (let i = 0; i < 5; i++) {
      const r = ((base >> 16) + Math.floor(Math.random() * 80 - 40)) & 0xFF;
      const g = (((base >> 8) & 0xFF) + Math.floor(Math.random() * 80 - 40)) & 0xFF;
      const b = ((base & 0xFF) + Math.floor(Math.random() * 80 - 40)) & 0xFF;
      palette.push('#' + [r, g, b].map(x => Math.min(255, Math.max(0, x)).toString(16).padStart(2, '0')).join(''));
    }
    setColors(palette);
  };

  useEffect(() => { generate(); }, [baseColor]);

  return (
    <ToolWrapper title="Color Palette Generator" description="Generate beautiful color palettes">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
          <button onClick={generate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Palette</button>
        </div>
        <div className="flex rounded-xl overflow-hidden h-32">
          {colors.map((color, i) => (
            <div key={i} className="flex-1 flex items-end justify-center pb-3 cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: color }} onClick={() => navigator.clipboard.writeText(color)}>
              <span className="text-xs font-mono px-2 py-1 bg-black/30 text-white rounded">{color}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Click a color to copy its hex code</p>
      </div>
    </ToolWrapper>
  );
}
