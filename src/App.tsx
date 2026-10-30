import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import { getToolById } from './data/tools';

// Import all tool components
import { MergePDF, SplitPDF, CompressPDF, RotatePDF, ImagesToPDF, PDFToImages, AddPageNumbers, WatermarkPDF, ProtectPDF, PDFMetadata, PDFWordCount, PDFInfo } from './tools/PDFTools';
import { ImageResizer, ImageCompressor, ImageConverter, ImageRotator, ImageFlipper, ImageFilters, ImageToBase64, ColorPicker, ImageWatermark, ImageCropper } from './tools/ImageTools';
import { WordCounter, CaseConverter, TextRepeater, LoremIpsum, TextToSlug, RemoveDuplicates, TextSorter, FindReplace, ReverseText, TextDiff } from './tools/TextTools';
import { JSONFormatter, JSONMinifier, Base64Tool, URLEncoder, HashGenerator, UUIDGenerator, RegexTester, HTMLFormatter, CSSMinifier, MarkdownPreview, ColorConverter, JWTDecoder } from './tools/DeveloperTools';
import { ScientificCalculator, PercentageCalculator, BMICalculator, LoanCalculator, AgeCalculator, UnitConverter, TemperatureConverter, CompoundInterest, DiscountCalculator, DateDifference } from './tools/CalculatorTools';
import { PasswordGenerator, PasswordStrength, TextEncryptor, HashChecker, PrivacyPolicy, RandomNumber } from './tools/SecurityTools';
import { MetaTagGenerator, RobotsGenerator, SitemapGenerator, OGGenerator, KeywordDensity, SERPPreview, SchemaGenerator, TwitterCard, CSVToJSON, JSONToCSV, XMLToJSON, TextToSpeech, AudioTrimmer, ImageToIcon } from './tools/SEOMediaTools';
import { QRGenerator, Stopwatch, CountdownTimer, Notepad, TodoList, DiceRoller, CoinFlipper, WorldClock, InvoiceGenerator, ColorPalette } from './tools/DailyTools';
import { ImageBlur, ImageGrayscale, ImageBorder, ImageRounded, ImageCollage, ImageInverter, TipCalculator, GSTCalculator, BMRCalculator, AspectRatio, TextToBinary, MorseCode, TextToEmoji, UpsideDownText, FancyText, TextToNumbers, HTMLPreview, CronGenerator, SQLFormatter, JSONDiff, HtaccessGenerator, CanonicalGenerator, YAMLToJSON, JSONToYAML, TSVToJSON, TermsGenerator, DisclaimerGenerator, TypingTest, PomodoroTimer, BMIChart, BreathingExercise } from './tools/ExtraTools';

// Tool component mapping
const toolComponents: Record<string, React.ComponentType> = {
  // PDF Tools
  'merge-pdf': MergePDF, 'split-pdf': SplitPDF, 'compress-pdf': CompressPDF, 'rotate-pdf': RotatePDF,
  'images-to-pdf': ImagesToPDF, 'pdf-to-images': PDFToImages, 'add-page-numbers': AddPageNumbers,
  'watermark-pdf': WatermarkPDF, 'protect-pdf': ProtectPDF, 'pdf-metadata': PDFMetadata,
  'pdf-word-count': PDFWordCount, 'pdf-info': PDFInfo,
  
  // Image Tools
  'image-resizer': ImageResizer, 'image-compressor': ImageCompressor, 'image-converter': ImageConverter,
  'image-rotator': ImageRotator, 'image-flipper': ImageFlipper, 'image-filters': ImageFilters,
  'image-to-base64': ImageToBase64, 'color-picker': ColorPicker, 'image-watermark': ImageWatermark,
  'image-cropper': ImageCropper, 'image-blur': ImageBlur, 'image-grayscale': ImageGrayscale,
  'image-border': ImageBorder, 'image-rounded': ImageRounded, 'image-collage': ImageCollage,
  'image-inverter': ImageInverter,
  
  // Text Tools
  'word-counter': WordCounter, 'case-converter': CaseConverter, 'text-repeater': TextRepeater,
  'lorem-ipsum': LoremIpsum, 'text-to-slug': TextToSlug, 'remove-duplicates': RemoveDuplicates,
  'text-sorter': TextSorter, 'find-replace': FindReplace, 'reverse-text': ReverseText,
  'text-diff': TextDiff, 'text-to-binary': TextToBinary, 'morse-code': MorseCode,
  'text-to-emoji': TextToEmoji, 'upside-down-text': UpsideDownText, 'fancy-text': FancyText,
  'text-to-numbers': TextToNumbers,
  
  // Developer Tools
  'json-formatter': JSONFormatter, 'json-minifier': JSONMinifier, 'base64-encoder': Base64Tool,
  'url-encoder': URLEncoder, 'hash-generator': HashGenerator, 'uuid-generator': UUIDGenerator,
  'regex-tester': RegexTester, 'html-formatter': HTMLFormatter, 'css-minifier': CSSMinifier,
  'markdown-preview': MarkdownPreview, 'color-converter': ColorConverter, 'jwt-decoder': JWTDecoder,
  'html-preview': HTMLPreview, 'cron-generator': CronGenerator, 'sql-formatter': SQLFormatter,
  'json-diff': JSONDiff,
  
  // Calculator Tools
  'scientific-calculator': ScientificCalculator, 'percentage-calculator': PercentageCalculator,
  'bmi-calculator': BMICalculator, 'loan-calculator': LoanCalculator, 'age-calculator': AgeCalculator,
  'unit-converter': UnitConverter, 'temperature-converter': TemperatureConverter,
  'compound-interest': CompoundInterest, 'discount-calculator': DiscountCalculator,
  'date-difference': DateDifference, 'tip-calculator': TipCalculator, 'gst-calculator': GSTCalculator,
  'bmr-calculator': BMRCalculator, 'aspect-ratio': AspectRatio,
  
  // Security Tools
  'password-generator': PasswordGenerator, 'password-strength': PasswordStrength,
  'text-encryptor': TextEncryptor, 'hash-checker': HashChecker, 'privacy-policy': PrivacyPolicy,
  'random-number': RandomNumber, 'terms-generator': TermsGenerator, 'disclaimer-generator': DisclaimerGenerator,
  
  // SEO & Media Tools
  'meta-tag-generator': MetaTagGenerator, 'robots-generator': RobotsGenerator,
  'sitemap-generator': SitemapGenerator, 'og-generator': OGGenerator, 'keyword-density': KeywordDensity,
  'serp-preview': SERPPreview, 'schema-generator': SchemaGenerator, 'twitter-card': TwitterCard,
  'csv-to-json': CSVToJSON, 'json-to-csv': JSONToCSV, 'xml-to-json': XMLToJSON,
  'text-to-speech': TextToSpeech, 'audio-trimmer': AudioTrimmer, 'image-to-icon': ImageToIcon,
  'yaml-to-json': YAMLToJSON, 'json-to-yaml': JSONToYAML, 'tsv-to-json': TSVToJSON,
  'htaccess-generator': HtaccessGenerator, 'canonical-checker': CanonicalGenerator,
  
  // Daily Tools
  'qr-generator': QRGenerator, 'stopwatch': Stopwatch, 'countdown-timer': CountdownTimer,
  'notepad': Notepad, 'todo-list': TodoList, 'dice-roller': DiceRoller, 'coin-flipper': CoinFlipper,
  'world-clock': WorldClock, 'invoice-generator': InvoiceGenerator, 'color-palette': ColorPalette,
  'typing-test': TypingTest, 'pomodoro-timer': PomodoroTimer, 'bmi-chart': BMIChart,
  'breathing-exercise': BreathingExercise,
};

function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = getToolById(toolId || '');
  
  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Tool not found</h1>
        <p className="text-gray-400 mb-6">The tool you're looking for doesn't exist.</p>
        <a href="/" className="text-indigo-400 hover:underline">← Back to Home</a>
      </div>
    );
  }

  const ToolComponent = toolComponents[tool.id];
  
  if (!ToolComponent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{tool.name}</h1>
        <p className="text-gray-400 mb-4">{tool.description}</p>
        <p className="text-sm text-gray-500">This tool is coming soon!</p>
        <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">← Back to Home</a>
      </div>
    );
  }

  return <ToolComponent />;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
