import { useParams, Link } from 'react-router-dom';
import { getCategoryById } from '../data/tools';
import { ArrowLeft, Zap, ChevronRight } from 'lucide-react';

const categoryIcons: Record<string, string> = {
  pdf: '📄', image: '🖼️', calculator: '🧮', text: '✍️',
  developer: '💻', seo: '📈', media: '🎬', security: '🔒', daily: '🛠️'
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = getCategoryById(categoryId || '');

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Category not found</h1>
        <Link to="/" className="text-indigo-400 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white font-medium">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to all categories</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl animate-float`}>
            {categoryIcons[category.id] || '🔧'}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="mt-4 inline-flex items-center space-x-2 glass px-3 py-1 rounded-full">
          <Zap className="w-3 h-3 text-indigo-400" />
          <span className="text-xs text-gray-400">{category.tools.length} tools available</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.id}
            to={`/tool/${tool.id}`}
            className="group glass rounded-2xl p-5 card-hover neon-border relative overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-gradient transition-all">{tool.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
