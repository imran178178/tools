import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Wrench, ChevronDown } from 'lucide-react';
import { categories, searchTools } from '../data/tools';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ToolsHub
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden lg:flex ml-8 space-x-1">
                {categories.slice(0, 6).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="relative group">
                  <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                    More <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {categories.slice(6).map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search 100+ tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border border-transparent focus:border-blue-300 focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    {searchResults.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => { navigate(`/tool/${tool.id}`); setShowSearch(false); setSearchQuery(''); }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0"
                      >
                        <div className="text-sm font-medium text-gray-800">{tool.name}</div>
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center p-2 text-gray-600 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-lg text-sm focus:outline-none"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
                {searchResults.map(tool => (
                  <Link
                    key={tool.id}
                    to={`/tool/${tool.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100"
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
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ToolsHub</span>
              </div>
              <p className="text-sm text-gray-400">
                All your online tools in one place. Convert, edit, calculate, and create — completely free.
              </p>
            </div>
            {categories.slice(0, 4).map(cat => (
              <div key={cat.id}>
                <h3 className="text-white font-semibold mb-3 text-sm">{cat.name}</h3>
                <ul className="space-y-2">
                  {cat.tools.slice(0, 4).map(tool => (
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Ultimate Tools Hub. All rights reserved. All processing happens in your browser — your files never leave your device.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
