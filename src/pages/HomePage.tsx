import { Link } from 'react-router-dom';
import { categories } from '../data/tools';
import { Search, Zap, Shield, Globe, ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { searchTools } from '../data/tools';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setResults(searchTools(q).slice(0, 6));
    } else {
      setResults([]);
    }
  };

  const popularTools = [
    'merge-pdf', 'image-compressor', 'json-formatter', 'password-generator',
    'qr-generator', 'word-counter', 'base64-encoder', 'bmi-calculator'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              All Your Online Tools
              <br />
              <span className="text-blue-200">in One Place</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Convert, Edit, Calculate, Optimize and Create — Everything You Need, Completely Online. 
              100+ tools, all free, all in your browser.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a tool... (e.g., PDF, Image, JSON, Calculator)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-800 rounded-2xl shadow-2xl text-base focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 text-left">
                  {results.map(tool => (
                    <Link
                      key={tool.id}
                      to={`/tool/${tool.id}`}
                      className="block px-5 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="text-sm font-semibold text-gray-800">{tool.name}</div>
                      <div className="text-xs text-gray-500">{tool.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-blue-100">100+ Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-300" />
                <span className="text-sm text-blue-100">100% Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-300" />
                <span className="text-sm text-blue-100">No Installation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-pink-300" />
                <span className="text-sm text-blue-100">Always Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Popular Tools</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popularTools.map(id => {
            const tool = categories.flatMap(c => c.tools).find(t => t.id === id);
            if (!tool) return null;
            const cat = categories.find(c => c.id === tool.category);
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{tool.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">All Tool Categories</h2>
          <p className="text-gray-500">Explore our comprehensive collection of online tools</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">{cat.tools.length} tools</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">How It Works</h2>
            <p className="text-gray-500">Simple, fast, and secure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose a Tool</h3>
              <p className="text-sm text-gray-500">Browse our categories or search for the tool you need</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload or Input</h3>
              <p className="text-sm text-gray-500">Upload your files or enter your data directly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Results</h3>
              <p className="text-sm text-gray-500">Download your processed files or copy the results instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-1">Privacy First</h3>
            <p className="text-sm text-gray-600">All processing happens in your browser. Files never leave your device.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
            <Clock className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-1">Lightning Fast</h3>
            <p className="text-sm text-gray-600">Instant processing with no server wait times or upload delays.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
            <Star className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-1">Always Free</h3>
            <p className="text-sm text-gray-600">All tools are completely free with no hidden charges or limits.</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
            <Globe className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-1">Works Everywhere</h3>
            <p className="text-sm text-gray-600">Use on any device — desktop, tablet, or mobile phone.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is it really free?', a: 'Yes! All tools are completely free to use with no hidden charges, subscriptions, or limits.' },
              { q: 'Are my files safe?', a: 'Absolutely. All processing happens directly in your browser. Your files are never uploaded to any server.' },
              { q: 'Do I need to install anything?', a: 'No installation required. All tools work directly in your web browser on any device.' },
              { q: 'What browsers are supported?', a: 'ToolsHub works on all modern browsers including Chrome, Firefox, Safari, and Edge.' },
              { q: 'Is there a file size limit?', a: 'Since processing happens in your browser, limits depend on your device capabilities. Most tools handle files up to 100MB.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-800 hover:text-blue-600">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
