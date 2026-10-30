import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Sparkles, ChevronDown, Zap, Github, Twitter } from 'lucide-react';
import { categories, searchTools } from '../data/tools';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(searchTools(q).slice(0, 8));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] bg-mesh">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-gradient group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-xl font-bold text-gradient hidden sm:block">
                  ToolsHub
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden lg:flex ml-8 space-x-1">
                {categories.slice(0, 5).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      location.pathname.includes(cat.id) 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="relative group">
                  <button className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center">
                    More <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 glass-strong rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {categories.slice(5).map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color} mr-3`}></div>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search 100+ tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-2xl overflow-hidden z-50">
                    {searchResults.map(tool => {
                      const cat = categories.find(c => c.id === tool.category);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => { navigate(`/tool/${tool.id}`); setShowSearch(false); setSearchQuery(''); }}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat?.color}`}></div>
                            <div className="text-sm font-medium text-white">{tool.name}</div>
                          </div>
                          <div className="text-xs text-gray-500 ml-4">{tool.description}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-strong border-t border-white/5 py-4 px-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mb-4 glass rounded-xl overflow-hidden">
                {searchResults.map(tool => (
                  <Link
                    key={tool.id}
                    to={`/tool/${tool.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 border-b border-white/5"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color} mr-3`}></div>
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">ToolsHub</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                All your online tools in one place. Convert, edit, calculate, and create — completely free and private.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
            {categories.slice(0, 4).map(cat => (
              <div key={cat.id}>
                <h3 className="text-white font-semibold mb-3 text-sm">{cat.name}</h3>
                <ul className="space-y-2">
                  {cat.tools.slice(0, 5).map(tool => (
                    <li key={tool.id}>
                      <Link to={`/tool/${tool.id}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 Ultimate Tools Hub. All processing happens in your browser.</p>
            <p className="mt-2 md:mt-0 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
              100% Private • No Data Collection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
