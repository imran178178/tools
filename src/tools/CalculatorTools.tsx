import { useState, useEffect } from 'react';
import { ToolWrapper } from './PDFTools';

// Scientific Calculator
export function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleInput = (val: string) => {
    if (val === 'C') { setDisplay('0'); setExpression(''); return; }
    if (val === '=') {
      try {
        const expr = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, String(Math.PI)).replace(/e(?![x])/g, String(Math.E));
        const result = Function('"use strict"; return (' + expr + ')')();
        setDisplay(String(result));
        setExpression(String(result));
      } catch { setDisplay('Error'); }
      return;
    }
    if (val === 'sin') { setDisplay(String(Math.sin(Number(display)))); setExpression(String(Math.sin(Number(display)))); return; }
    if (val === 'cos') { setDisplay(String(Math.cos(Number(display)))); setExpression(String(Math.cos(Number(display)))); return; }
    if (val === 'tan') { setDisplay(String(Math.tan(Number(display)))); setExpression(String(Math.tan(Number(display)))); return; }
    if (val === '√') { setDisplay(String(Math.sqrt(Number(display)))); setExpression(String(Math.sqrt(Number(display)))); return; }
    if (val === 'x²') { setDisplay(String(Math.pow(Number(display), 2))); setExpression(String(Math.pow(Number(display), 2))); return; }
    if (val === 'log') { setDisplay(String(Math.log10(Number(display)))); setExpression(String(Math.log10(Number(display)))); return; }
    if (val === 'ln') { setDisplay(String(Math.log(Number(display)))); setExpression(String(Math.log(Number(display)))); return; }
    if (val === '1/x') { setDisplay(String(1 / Number(display))); setExpression(String(1 / Number(display))); return; }
    if (val === '±') { setDisplay(String(-Number(display))); setExpression(String(-Number(display))); return; }
    
    setExpression(prev => prev + val);
    setDisplay(prev => prev === '0' && !isNaN(Number(val)) ? val : prev + val);
  };

  const buttons = [
    ['sin', 'cos', 'tan', '√', 'x²'],
    ['log', 'ln', '1/x', 'π', 'e'],
    ['7', '8', '9', '÷', 'C'],
    ['4', '5', '6', '×', '±'],
    ['1', '2', '3', '-', '('],
    ['0', '.', '=', '+', ')'],
  ];

  return (
    <ToolWrapper title="Scientific Calculator" description="Full-featured scientific calculator">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-sm mx-auto">
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-400 font-mono h-4 overflow-hidden">{expression}</div>
          <div className="text-2xl text-white font-mono text-right">{display}</div>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {buttons.flat().map((btn, i) => (
            <button
              key={i}
              onClick={() => handleInput(btn)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                btn === 'C' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                isNaN(Number(btn)) && btn !== '.' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
                'bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}

// Percentage Calculator
export function PercentageCalculator() {
  const [type, setType] = useState<'of' | 'is' | 'change'>('of');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) return;
    switch (type) {
      case 'of': setResult(`${a}% of ${b} = ${(a / 100 * b).toFixed(2)}`); break;
      case 'is': setResult(`${a} is ${((a / b) * 100).toFixed(2)}% of ${b}`); break;
      case 'change': setResult(`Change from ${a} to ${b}: ${(((b - a) / a) * 100).toFixed(2)}%`); break;
    }
  };

  return (
    <ToolWrapper title="Percentage Calculator" description="Calculate percentages easily">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4">
          <option value="of">What is X% of Y?</option>
          <option value="is">X is what % of Y?</option>
          <option value="change">% change from X to Y</option>
        </select>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} placeholder="Value 1" className="px-3 py-2 border border-gray-200 rounded-lg" />
          <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} placeholder="Value 2" className="px-3 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={calculate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate</button>
        {result && <p className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 font-medium">{result}</p>}
      </div>
    </ToolWrapper>
  );
}

// BMI Calculator
export function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h)) return;
    let result: number;
    if (unit === 'metric') {
      result = w / ((h / 100) ** 2);
    } else {
      result = (w * 703) / (h ** 2);
    }
    setBmi(result);
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  return (
    <ToolWrapper title="BMI Calculator" description="Calculate your Body Mass Index">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="flex space-x-3 mb-4">
          <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-lg ${unit === 'metric' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Metric</button>
          <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-lg ${unit === 'imperial' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Imperial</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Weight ({unit === 'metric' ? 'kg' : 'lbs'}):</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Height ({unit === 'metric' ? 'cm' : 'inches'}):</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate BMI</button>
        {bmi !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-800">{bmi.toFixed(1)}</div>
            <div className={`text-lg font-medium ${getCategory(bmi).color}`}>{getCategory(bmi).text}</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Loan Calculator
export function LoanCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('30');
  const [emi, setEmi] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (isNaN(p) || isNaN(r) || isNaN(n)) return;
    const emiVal = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    setEmi(emiVal);
    setTotalPayment(emiVal * n);
    setTotalInterest(emiVal * n - p);
  };

  return (
    <ToolWrapper title="Loan Calculator" description="Calculate EMI, total payment, and interest">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Loan Amount ($):</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Interest Rate (% per year):</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Loan Term (years):</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate</button>
        {emi !== null && (
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg flex justify-between"><span className="text-gray-600">Monthly EMI:</span><span className="font-bold text-blue-600">${emi.toFixed(2)}</span></div>
            <div className="p-3 bg-green-50 rounded-lg flex justify-between"><span className="text-gray-600">Total Payment:</span><span className="font-bold text-green-600">${totalPayment!.toFixed(2)}</span></div>
            <div className="p-3 bg-red-50 rounded-lg flex justify-between"><span className="text-gray-600">Total Interest:</span><span className="font-bold text-red-600">${totalInterest!.toFixed(2)}</span></div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}

// Age Calculator
export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState('');

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    setAge(`${years} years, ${months} months, ${days} days (${totalDays.toLocaleString()} total days)`);
  };

  return (
    <ToolWrapper title="Age Calculator" description="Calculate exact age from date of birth">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div>
          <label className="text-sm text-gray-700">Date of Birth:</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate Age</button>
        {age && <p className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium text-center">{age}</p>}
      </div>
    </ToolWrapper>
  );
}

// Unit Converter
export function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const units: Record<string, Record<string, number>> = {
    length: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
    weight: { kilogram: 1, gram: 0.001, milligram: 0.000001, pound: 0.453592, ounce: 0.0283495, ton: 1000 },
    area: { 'sq meter': 1, 'sq kilometer': 1000000, 'sq foot': 0.092903, 'sq inch': 0.00064516, acre: 4046.86, hectare: 10000 },
    volume: { liter: 1, milliliter: 0.001, gallon: 3.78541, quart: 0.946353, 'cubic meter': 1000, 'cubic foot': 28.3168 },
    speed: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, knot: 0.514444 },
    data: { byte: 1, kilobyte: 1024, megabyte: 1048576, gigabyte: 1073741824, terabyte: 1099511627776 },
  };

  useEffect(() => {
    const catUnits = Object.keys(units[category] || {});
    if (catUnits.length >= 2) {
      setFromUnit(catUnits[0]);
      setToUnit(catUnits[1]);
    }
  }, [category]);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const catUnits = units[category];
    const baseValue = v * catUnits[fromUnit];
    const converted = baseValue / catUnits[toUnit];
    setResult(`${v} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`);
  };

  return (
    <ToolWrapper title="Unit Converter" description="Convert between measurement units">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4">
          {Object.keys(units).map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
            {Object.keys(units[category] || {}).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
            {Object.keys(units[category] || {}).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value..." className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3" />
        <button onClick={convert} className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert</button>
        {result && <p className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 font-medium text-center">{result}</p>}
      </div>
    </ToolWrapper>
  );
}

// Temperature Converter
export function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [kelvin, setKelvin] = useState('');

  const fromCelsius = (c: number) => {
    setFahrenheit(((c * 9 / 5) + 32).toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  return (
    <ToolWrapper title="Temperature Converter" description="Convert between Celsius, Fahrenheit, and Kelvin">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Celsius (°C):</label>
            <input type="number" value={celsius} onChange={(e) => { setCelsius(e.target.value); fromCelsius(parseFloat(e.target.value) || 0); }} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Fahrenheit (°F):</label>
            <input type="number" value={fahrenheit} onChange={(e) => { setFahrenheit(e.target.value); const f = parseFloat(e.target.value) || 0; setCelsius(((f - 32) * 5 / 9).toFixed(2)); setKelvin(((f - 32) * 5 / 9 + 273.15).toFixed(2)); }} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Kelvin (K):</label>
            <input type="number" value={kelvin} onChange={(e) => { setKelvin(e.target.value); const k = parseFloat(e.target.value) || 0; setCelsius((k - 273.15).toFixed(2)); setFahrenheit(((k - 273.15) * 9 / 5 + 32).toFixed(2)); }} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
}

// Compound Interest
export function CompoundInterest() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('10');
  const [compound, setCompound] = useState('12');
  const [result, setResult] = useState('');

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(compound);
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    setResult(`Final Amount: $${amount.toFixed(2)} | Interest Earned: $${interest.toFixed(2)}`);
  };

  return (
    <ToolWrapper title="Compound Interest Calculator" description="Calculate compound interest on investments">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Principal ($):</label><input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Annual Rate (%):</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Years:</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Compounds/year:</label>
            <select value={compound} onChange={(e) => setCompound(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value="1">Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate</button>
        {result && <p className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 font-medium">{result}</p>}
      </div>
    </ToolWrapper>
  );
}

// Discount Calculator
export function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [savings, setSavings] = useState('');

  const calculate = () => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d)) return;
    const saved = p * d / 100;
    const final = p - saved;
    setSavings(`You save: $${saved.toFixed(2)} | Final price: $${final.toFixed(2)}`);
  };

  return (
    <ToolWrapper title="Discount Calculator" description="Calculate discounts and savings">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="space-y-3">
          <div><label className="text-sm text-gray-700">Original Price ($):</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">Discount (%):</label><input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate</button>
        {savings && <p className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 font-medium">{savings}</p>}
      </div>
    </ToolWrapper>
  );
}

// Date Difference
export function DateDifference() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    if (!date1 || !date2) return;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    setResult(`${days} days | ${weeks} weeks | ~${months} months | ~${years} years`);
  };

  return (
    <ToolWrapper title="Date Difference Calculator" description="Calculate the difference between two dates">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-gray-700">Start Date:</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <div><label className="text-sm text-gray-700">End Date:</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
        </div>
        <button onClick={calculate} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Calculate</button>
        {result && <p className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 font-medium text-center">{result}</p>}
      </div>
    </ToolWrapper>
  );
}
