import { Link } from 'react-router-dom';
import { categories } from '../data/tools';
import { Search, Zap, Shield, Globe, ArrowRight, Sparkles, TrendingUp, Clock, Star, ChevronRight, Layers, Code2, Image, FileText, Calculator, Type, Film, Lock, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchTools } from '../data/tools';

const categoryIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-6 h-6" />,
  image: <Image className="w-6 h-6" />,
  calculator: <Calculator className="w-6 h-6" />,
  text: <Type className="w-6 h-6" />,
  developer: <Code2 className="w-6 h-6" />,
  seo: <TrendingUp className="w-6 h-6" />,
  media: <Film className="w-6 h-6" />,
  security: <Lock className="w-6 h-6" />,
  daily: <Wrench className="w-6 h-6" />,
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) setResults(searchTools(q).slice(0, 6));
    else setResults([]);
  };

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const totalTools = categories.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{totalTools}+ Free Tools • No Sign-up Required</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">All Your</span>
            <br />
            <span className="text-gradient">Online Tools</span>
            <br />
            <span className="text-white">in One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Convert, Edit, Calculate, Optimize and Create — Everything You Need, 
            <span className="text-indigo-400 font-medium"> Completely Free & Private</span>.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for any tool... (PDF, Image, JSON, Calculator)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-900/80 backdrop-blur-xl text-white rounded-2xl text-base border border-white/10 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
                {results.map(tool => {
                  const cat = categories.find(c => c.id === tool.category);
                  return (
                    <Link
                      key={tool.id}
                      to={`/tool/${tool.id}`}
                      className="flex items-center px-5 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center mr-3`}>
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{tool.name}</div>
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: <Zap className="w-5 h-5" />, label: `${totalTools}+ Tools`, color: 'text-yellow-400' },
              { icon: <Shield className="w-5 h-5" />, label: '100% Private', color: 'text-green-400' },
              { icon: <Globe className="w-5 h-5" />, label: 'No Installation', color: 'text-cyan-400' },
              { icon: <Star className="w-5 h-5" />, label: 'Always Free', color: 'text-pink-400' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
                <span className={stat.color}>{stat.icon}</span>
                <span className="text-sm text-gray-300 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 glass rounded-full mb-4">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Categories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Explore <span className="text-gradient">9 Categories</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Professional tools organized for easy access</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group relative glass rounded-2xl p-6 card-hover neon-border overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    {categoryIcons[cat.id]}
                  </div>
                  <span className="text-xs font-medium text-gray-500 glass px-2 py-1 rounded-full">
                    {cat.tools.length} tools
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient transition-all">{cat.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{cat.description}</p>
                <div className="flex items-center text-sm text-indigo-400 font-medium">
                  Explore tools
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 glass rounded-full mb-3">
              <TrendingUp className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Trending</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Popular Tools</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.flatMap(c => c.tools).slice(0, 18).map((tool, i) => {
            const cat = categories.find(c => c.id === tool.category);
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group glass rounded-xl p-4 card-hover text-center"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors leading-tight block">{tool.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 glass rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How It <span className="text-gradient">Works</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Choose a Tool', desc: 'Browse categories or search for what you need', color: 'from-indigo-500 to-blue-500' },
            { num: '02', title: 'Upload or Input', desc: 'Upload files or enter data directly in your browser', color: 'from-purple-500 to-pink-500' },
            { num: '03', title: 'Get Results', desc: 'Download processed files or copy results instantly', color: 'from-pink-500 to-rose-500' },
          ].map((step, i) => (
            <div key={i} className="relative glass rounded-2xl p-8 card-hover group">
              <div className={`absolute top-4 right-4 text-6xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>
                {step.num}
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-xl font-bold text-white">{step.num}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Shield className="w-7 h-7" />, title: 'Privacy First', desc: 'All processing happens in your browser. Files never leave your device.', color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-cyan-400' },
            { icon: <Clock className="w-7 h-7" />, title: 'Lightning Fast', desc: 'Instant processing with no server wait times or upload delays.', color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
            { icon: <Star className="w-7 h-7" />, title: 'Always Free', desc: 'All tools are completely free with no hidden charges or limits.', color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400' },
            { icon: <Globe className="w-7 h-7" />, title: 'Works Everywhere', desc: 'Use on any device — desktop, tablet, or mobile phone.', color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
          ].map((feature, i) => (
            <div key={i} className={`relative glass rounded-2xl p-6 card-hover overflow-hidden group`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative">
                <div className={`${feature.iconColor} mb-4`}>{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { q: 'Is it really free?', a: 'Yes! All tools are completely free to use with no hidden charges, subscriptions, or limits.' },
            { q: 'Are my files safe?', a: 'Absolutely. All processing happens directly in your browser. Your files are never uploaded to any server.' },
            { q: 'Do I need to install anything?', a: 'No installation required. All tools work directly in your web browser on any device.' },
            { q: 'What browsers are supported?', a: 'ToolsHub works on all modern browsers including Chrome, Firefox, Safari, and Edge.' },
            { q: 'Is there a file size limit?', a: 'Since processing happens in your browser, limits depend on your device capabilities. Most tools handle files up to 100MB.' },
          ].map((faq, i) => (
            <details key={i} className="group glass rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-white hover:text-indigo-400 transition-colors">
                {faq.q}
                <span className="text-gray-500 group-open:rotate-180 transition-transform ml-4">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-400">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
