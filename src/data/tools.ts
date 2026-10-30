export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  component: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Convert, edit, merge, split, compress and manage PDF files',
    icon: 'FileText',
    color: 'from-rose-500 to-pink-600',
    gradient: 'from-rose-500/20 to-pink-600/20',
    tools: [
      { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one', category: 'pdf', icon: 'Merge', component: 'MergePDF' },
      { id: 'split-pdf', name: 'Split PDF', description: 'Split a PDF into separate files', category: 'pdf', icon: 'Split', component: 'SplitPDF' },
      { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', category: 'pdf', icon: 'Minimize2', component: 'CompressPDF' },
      { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', category: 'pdf', icon: 'RotateCw', component: 'RotatePDF' },
      { id: 'pdf-to-images', name: 'PDF to Images', description: 'Convert PDF pages to images', category: 'pdf', icon: 'Image', component: 'PDFToImages' },
      { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert images to PDF', category: 'pdf', icon: 'FileImage', component: 'ImagesToPDF' },
      { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password protection to PDF', category: 'pdf', icon: 'Lock', component: 'ProtectPDF' },
      { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers to PDF', category: 'pdf', icon: 'Hash', component: 'AddPageNumbers' },
      { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add watermark to PDF pages', category: 'pdf', icon: 'Droplets', component: 'WatermarkPDF' },
      { id: 'pdf-metadata', name: 'PDF Metadata Editor', description: 'Edit PDF metadata properties', category: 'pdf', icon: 'Info', component: 'PDFMetadata' },
      { id: 'pdf-word-count', name: 'PDF Word Counter', description: 'Count words in PDF documents', category: 'pdf', icon: 'FileText', component: 'PDFWordCount' },
      { id: 'pdf-info', name: 'PDF Info Viewer', description: 'View PDF file information', category: 'pdf', icon: 'Info', component: 'PDFInfo' },
    ]
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Resize, crop, convert, compress and edit images online',
    icon: 'Image',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    tools: [
      { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to any dimension', category: 'image', icon: 'Maximize2', component: 'ImageResizer' },
      { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to desired area', category: 'image', icon: 'Crop', component: 'ImageCropper' },
      { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images without quality loss', category: 'image', icon: 'Minimize2', component: 'ImageCompressor' },
      { id: 'image-converter', name: 'Image Converter', description: 'Convert between image formats', category: 'image', icon: 'RefreshCw', component: 'ImageConverter' },
      { id: 'image-rotator', name: 'Image Rotator', description: 'Rotate images to any angle', category: 'image', icon: 'RotateCw', component: 'ImageRotator' },
      { id: 'image-flipper', name: 'Image Flipper', description: 'Flip images horizontally or vertically', category: 'image', icon: 'FlipHorizontal', component: 'ImageFlipper' },
      { id: 'image-filters', name: 'Image Filters', description: 'Apply filters and effects to images', category: 'image', icon: 'Palette', component: 'ImageFilters' },
      { id: 'image-to-base64', name: 'Image to Base64', description: 'Convert image to Base64 string', category: 'image', icon: 'Code', component: 'ImageToBase64' },
      { id: 'color-picker', name: 'Color Picker', description: 'Pick and convert colors', category: 'image', icon: 'Droplet', component: 'ColorPicker' },
      { id: 'image-watermark', name: 'Image Watermark', description: 'Add text watermark to images', category: 'image', icon: 'Type', component: 'ImageWatermark' },
      { id: 'image-blur', name: 'Image Blur', description: 'Apply blur effect to images', category: 'image', icon: 'Droplet', component: 'ImageBlur' },
      { id: 'image-grayscale', name: 'Grayscale Converter', description: 'Convert images to black & white', category: 'image', icon: 'Circle', component: 'ImageGrayscale' },
      { id: 'image-border', name: 'Image Border Maker', description: 'Add borders to images', category: 'image', icon: 'Square', component: 'ImageBorder' },
      { id: 'image-rounded', name: 'Rounded Corners', description: 'Add rounded corners to images', category: 'image', icon: 'Circle', component: 'ImageRounded' },
      { id: 'image-collage', name: 'Image Collage Maker', description: 'Create photo collages', category: 'image', icon: 'Grid3x3', component: 'ImageCollage' },
      { id: 'image-inverter', name: 'Color Inverter', description: 'Invert image colors', category: 'image', icon: 'RefreshCw', component: 'ImageInverter' },
    ]
  },
  {
    id: 'calculator',
    name: 'Calculators',
    description: 'Financial, math, health, and everyday calculators',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    tools: [
      { id: 'scientific-calculator', name: 'Scientific Calculator', description: 'Full-featured scientific calculator', category: 'calculator', icon: 'Calculator', component: 'ScientificCalculator' },
      { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages easily', category: 'calculator', icon: 'Percent', component: 'PercentageCalculator' },
      { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate your Body Mass Index', category: 'calculator', icon: 'Activity', component: 'BMICalculator' },
      { id: 'loan-calculator', name: 'Loan Calculator', description: 'Calculate loan EMI and payments', category: 'calculator', icon: 'DollarSign', component: 'LoanCalculator' },
      { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate exact age from birthdate', category: 'calculator', icon: 'Calendar', component: 'AgeCalculator' },
      { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between measurement units', category: 'calculator', icon: 'ArrowLeftRight', component: 'UnitConverter' },
      { id: 'temperature-converter', name: 'Temperature Converter', description: 'Convert between temperature scales', category: 'calculator', icon: 'Thermometer', component: 'TemperatureConverter' },
      { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate compound interest returns', category: 'calculator', icon: 'TrendingUp', component: 'CompoundInterest' },
      { id: 'discount-calculator', name: 'Discount Calculator', description: 'Calculate discounts and savings', category: 'calculator', icon: 'Tag', component: 'DiscountCalculator' },
      { id: 'date-difference', name: 'Date Difference', description: 'Calculate days between dates', category: 'calculator', icon: 'CalendarDays', component: 'DateDifference' },
      { id: 'tip-calculator', name: 'Tip Calculator', description: 'Calculate tips and split bills', category: 'calculator', icon: 'Receipt', component: 'TipCalculator' },
      { id: 'gst-calculator', name: 'GST Calculator', description: 'Calculate GST tax amounts', category: 'calculator', icon: 'DollarSign', component: 'GSTCalculator' },
      { id: 'bmr-calculator', name: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate', category: 'calculator', icon: 'Heart', component: 'BMRCalculator' },
      { id: 'aspect-ratio', name: 'Aspect Ratio Calculator', description: 'Calculate image aspect ratios', category: 'calculator', icon: 'RectangleHorizontal', component: 'AspectRatio' },
    ]
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Count words, convert case, encode, decode and process text',
    icon: 'Type',
    color: 'from-violet-500 to-purple-600',
    gradient: 'from-violet-500/20 to-purple-600/20',
    tools: [
      { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences', category: 'text', icon: 'FileText', component: 'WordCounter' },
      { id: 'case-converter', name: 'Case Converter', description: 'Convert text between cases', category: 'text', icon: 'ArrowUpDown', component: 'CaseConverter' },
      { id: 'text-repeater', name: 'Text Repeater', description: 'Repeat text multiple times', category: 'text', icon: 'Copy', component: 'TextRepeater' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text', category: 'text', icon: 'AlignLeft', component: 'LoremIpsum' },
      { id: 'text-to-slug', name: 'Text to Slug', description: 'Convert text to URL-friendly slug', category: 'text', icon: 'Link', component: 'TextToSlug' },
      { id: 'remove-duplicates', name: 'Remove Duplicates', description: 'Remove duplicate lines from text', category: 'text', icon: 'Eraser', component: 'RemoveDuplicates' },
      { id: 'text-sorter', name: 'Text Sorter', description: 'Sort lines alphabetically', category: 'text', icon: 'ArrowDownAZ', component: 'TextSorter' },
      { id: 'find-replace', name: 'Find & Replace', description: 'Find and replace text patterns', category: 'text', icon: 'Search', component: 'FindReplace' },
      { id: 'reverse-text', name: 'Reverse Text', description: 'Reverse text or words', category: 'text', icon: 'Undo2', component: 'ReverseText' },
      { id: 'text-diff', name: 'Text Diff Checker', description: 'Compare two texts for differences', category: 'text', icon: 'GitCompare', component: 'TextDiff' },
      { id: 'text-to-binary', name: 'Text to Binary', description: 'Convert text to binary code', category: 'text', icon: 'Binary', component: 'TextToBinary' },
      { id: 'morse-code', name: 'Morse Code Translator', description: 'Convert text to Morse code', category: 'text', icon: 'Radio', component: 'MorseCode' },
      { id: 'text-to-emoji', name: 'Text to Emoji', description: 'Convert words to emoji', category: 'text', icon: 'Smile', component: 'TextToEmoji' },
      { id: 'upside-down-text', name: 'Upside Down Text', description: 'Flip text upside down', category: 'text', icon: 'FlipVertical', component: 'UpsideDownText' },
      { id: 'fancy-text', name: 'Fancy Text Generator', description: 'Generate stylish text fonts', category: 'text', icon: 'Sparkles', component: 'FancyText' },
      { id: 'text-to-numbers', name: 'Text to Numbers', description: 'Convert text to number codes', category: 'text', icon: 'Hash', component: 'TextToNumbers' },
    ]
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'JSON, XML, code formatting, encoding, and dev utilities',
    icon: 'Code2',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate and beautify JSON', category: 'developer', icon: 'Braces', component: 'JSONFormatter' },
      { id: 'json-minifier', name: 'JSON Minifier', description: 'Minify JSON data', category: 'developer', icon: 'Minimize', component: 'JSONMinifier' },
      { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64', category: 'developer', icon: 'Binary', component: 'Base64Tool' },
      { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode and decode URLs', category: 'developer', icon: 'Link2', component: 'URLEncoder' },
      { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512', category: 'developer', icon: 'Fingerprint', component: 'HashGenerator' },
      { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate UUIDs/GUIDs', category: 'developer', icon: 'Hash', component: 'UUIDGenerator' },
      { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions', category: 'developer', icon: 'Regex', component: 'RegexTester' },
      { id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML code', category: 'developer', icon: 'Code', component: 'HTMLFormatter' },
      { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS stylesheets', category: 'developer', icon: 'FileCode', component: 'CSSMinifier' },
      { id: 'markdown-preview', name: 'Markdown Preview', description: 'Preview Markdown as HTML', category: 'developer', icon: 'Eye', component: 'MarkdownPreview' },
      { id: 'color-converter', name: 'Color Code Converter', description: 'Convert between color formats', category: 'developer', icon: 'Palette', component: 'ColorConverter' },
      { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens', category: 'developer', icon: 'Key', component: 'JWTDecoder' },
      { id: 'html-preview', name: 'HTML Live Preview', description: 'Preview HTML code in real-time', category: 'developer', icon: 'Monitor', component: 'HTMLPreview' },
      { id: 'cron-generator', name: 'Cron Expression Generator', description: 'Generate cron schedule expressions', category: 'developer', icon: 'Clock', component: 'CronGenerator' },
      { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format and beautify SQL queries', category: 'developer', icon: 'Database', component: 'SQLFormatter' },
      { id: 'json-diff', name: 'JSON Diff Checker', description: 'Compare two JSON objects', category: 'developer', icon: 'GitCompare', component: 'JSONDiff' },
    ]
  },
  {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Analyze, optimize and improve your website SEO',
    icon: 'TrendingUp',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-500/20 to-orange-600/20',
    tools: [
      { id: 'meta-tag-generator', name: 'Meta Tag Generator', description: 'Generate HTML meta tags', category: 'seo', icon: 'Tag', component: 'MetaTagGenerator' },
      { id: 'robots-generator', name: 'Robots.txt Generator', description: 'Generate robots.txt file', category: 'seo', icon: 'FileText', component: 'RobotsGenerator' },
      { id: 'sitemap-generator', name: 'Sitemap Generator', description: 'Generate XML sitemap', category: 'seo', icon: 'Map', component: 'SitemapGenerator' },
      { id: 'og-generator', name: 'Open Graph Generator', description: 'Generate Open Graph meta tags', category: 'seo', icon: 'Share2', component: 'OGGenerator' },
      { id: 'keyword-density', name: 'Keyword Density Checker', description: 'Analyze keyword density in text', category: 'seo', icon: 'BarChart3', component: 'KeywordDensity' },
      { id: 'serp-preview', name: 'SERP Preview', description: 'Preview Google search results', category: 'seo', icon: 'Monitor', component: 'SERPPreview' },
      { id: 'schema-generator', name: 'Schema Markup Generator', description: 'Generate structured data markup', category: 'seo', icon: 'Database', component: 'SchemaGenerator' },
      { id: 'twitter-card', name: 'Twitter Card Generator', description: 'Generate Twitter Card meta tags', category: 'seo', icon: 'Twitter', component: 'TwitterCard' },
      { id: 'htaccess-generator', name: '.htaccess Generator', description: 'Generate .htaccess redirect rules', category: 'seo', icon: 'Settings', component: 'HtaccessGenerator' },
      { id: 'canonical-checker', name: 'Canonical URL Generator', description: 'Generate canonical URL tags', category: 'seo', icon: 'Link', component: 'CanonicalGenerator' },
    ]
  },
  {
    id: 'media',
    name: 'Media Converter',
    description: 'Convert audio, video, and document files',
    icon: 'Film',
    color: 'from-fuchsia-500 to-pink-600',
    gradient: 'from-fuchsia-500/20 to-pink-600/20',
    tools: [
      { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON format', category: 'media', icon: 'FileJson', component: 'CSVToJSON' },
      { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON data to CSV format', category: 'media', icon: 'FileSpreadsheet', component: 'JSONToCSV' },
      { id: 'xml-to-json', name: 'XML to JSON', description: 'Convert XML to JSON format', category: 'media', icon: 'FileCode', component: 'XMLToJSON' },
      { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text to audio speech', category: 'media', icon: 'Volume2', component: 'TextToSpeech' },
      { id: 'audio-trimmer', name: 'Audio Trimmer', description: 'Trim audio files', category: 'media', icon: 'Scissors', component: 'AudioTrimmer' },
      { id: 'image-to-icon', name: 'Image to Favicon', description: 'Convert image to favicon', category: 'media', icon: 'Star', component: 'ImageToIcon' },
      { id: 'yaml-to-json', name: 'YAML to JSON', description: 'Convert YAML to JSON format', category: 'media', icon: 'FileCode', component: 'YAMLToJSON' },
      { id: 'json-to-yaml', name: 'JSON to YAML', description: 'Convert JSON to YAML format', category: 'media', icon: 'FileCode', component: 'JSONToYAML' },
      { id: 'tsv-to-json', name: 'TSV to JSON', description: 'Convert TSV to JSON format', category: 'media', icon: 'FileSpreadsheet', component: 'TSVToJSON' },
    ]
  },
  {
    id: 'security',
    name: 'Security Tools',
    description: 'Password generators, encryption, and security utilities',
    icon: 'Shield',
    color: 'from-slate-500 to-zinc-700',
    gradient: 'from-slate-500/20 to-zinc-700/20',
    tools: [
      { id: 'password-generator', name: 'Password Generator', description: 'Generate strong secure passwords', category: 'security', icon: 'Key', component: 'PasswordGenerator' },
      { id: 'password-strength', name: 'Password Strength Checker', description: 'Check password strength', category: 'security', icon: 'ShieldCheck', component: 'PasswordStrength' },
      { id: 'text-encryptor', name: 'Text Encryptor', description: 'Encrypt and decrypt text with AES', category: 'security', icon: 'Lock', component: 'TextEncryptor' },
      { id: 'hash-checker', name: 'File Hash Checker', description: 'Generate file checksums', category: 'security', icon: 'Fingerprint', component: 'HashChecker' },
      { id: 'privacy-policy', name: 'Privacy Policy Generator', description: 'Generate privacy policy pages', category: 'security', icon: 'FileCheck', component: 'PrivacyPolicy' },
      { id: 'random-number', name: 'Random Number Generator', description: 'Generate secure random numbers', category: 'security', icon: 'Dice5', component: 'RandomNumber' },
      { id: 'terms-generator', name: 'Terms of Service Generator', description: 'Generate terms of service pages', category: 'security', icon: 'FileText', component: 'TermsGenerator' },
      { id: 'disclaimer-generator', name: 'Disclaimer Generator', description: 'Generate disclaimer text', category: 'security', icon: 'AlertTriangle', component: 'DisclaimerGenerator' },
    ]
  },
  {
    id: 'daily',
    name: 'Daily Utilities',
    description: 'Everyday tools for productivity and convenience',
    icon: 'Wrench',
    color: 'from-lime-500 to-green-600',
    gradient: 'from-lime-500/20 to-green-600/20',
    tools: [
      { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes for any content', category: 'daily', icon: 'QrCode', component: 'QRGenerator' },
      { id: 'stopwatch', name: 'Stopwatch', description: 'Precise digital stopwatch', category: 'daily', icon: 'Timer', component: 'Stopwatch' },
      { id: 'countdown-timer', name: 'Countdown Timer', description: 'Set countdown timers', category: 'daily', icon: 'Clock', component: 'CountdownTimer' },
      { id: 'notepad', name: 'Online Notepad', description: 'Quick notes with auto-save', category: 'daily', icon: 'Edit3', component: 'Notepad' },
      { id: 'todo-list', name: 'To-Do List', description: 'Manage your tasks', category: 'daily', icon: 'CheckSquare', component: 'TodoList' },
      { id: 'dice-roller', name: 'Dice Roller', description: 'Roll virtual dice', category: 'daily', icon: 'Dice5', component: 'DiceRoller' },
      { id: 'coin-flipper', name: 'Coin Flipper', description: 'Flip a virtual coin', category: 'daily', icon: 'Circle', component: 'CoinFlipper' },
      { id: 'world-clock', name: 'World Clock', description: 'View time across time zones', category: 'daily', icon: 'Globe', component: 'WorldClock' },
      { id: 'invoice-generator', name: 'Invoice Generator', description: 'Create professional invoices', category: 'daily', icon: 'Receipt', component: 'InvoiceGenerator' },
      { id: 'color-palette', name: 'Color Palette Generator', description: 'Generate beautiful color palettes', category: 'daily', icon: 'Palette', component: 'ColorPalette' },
      { id: 'typing-test', name: 'Typing Speed Test', description: 'Test your typing speed (WPM)', category: 'daily', icon: 'Keyboard', component: 'TypingTest' },
      { id: 'pomodoro-timer', name: 'Pomodoro Timer', description: 'Focus timer for productivity', category: 'daily', icon: 'Timer', component: 'PomodoroTimer' },
      { id: 'bmi-chart', name: 'BMI Chart', description: 'Visual BMI reference chart', category: 'daily', icon: 'Activity', component: 'BMIChart' },
      { id: 'breathing-exercise', name: 'Breathing Exercise', description: 'Guided breathing exercises', category: 'daily', icon: 'Wind', component: 'BreathingExercise' },
    ]
  }
];

export const getAllTools = (): Tool[] => {
  return categories.flatMap(cat => cat.tools);
};

export const getToolById = (id: string): Tool | undefined => {
  return getAllTools().find(t => t.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const searchTools = (query: string): Tool[] => {
  const lower = query.toLowerCase();
  return getAllTools().filter(t => 
    t.name.toLowerCase().includes(lower) || 
    t.description.toLowerCase().includes(lower) ||
    t.category.toLowerCase().includes(lower)
  );
};
