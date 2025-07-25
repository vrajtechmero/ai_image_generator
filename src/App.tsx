import React, { useState } from 'react';
import { Download, Sparkles, RefreshCw, Copy, Zap, Palette, Wand2, Camera, Brush, Brain, Globe, ChevronDown, X, User, Mail, Star, Award, Layers, Code } from 'lucide-react';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
}

interface StyleCategory {
  name: string;
  icon: React.ReactNode;
  styles: string[];
}

const styleCategories: StyleCategory[] = [
  {
    name: "🎨 Artistic / Illustration",
    icon: <Brush className="w-4 h-4" />,
    styles: ["Cartoon", "Anime", "3D Render", "Digital Painting", "Sketch / Line Art", "Pixel Art", "Watercolor", "Oil Painting", "Low Poly", "Fantasy Art"]
  },
  {
    name: "📷 Photography / Vintage",
    icon: <Camera className="w-4 h-4" />,
    styles: ["Black & White", "Sepia", "Vintage", "Film Look", "Cinematic", "HDR", "Polaroid"]
  },
  {
    name: "🧠 Modern / AI-Focused",
    icon: <Brain className="w-4 h-4" />,
    styles: ["Photorealistic", "Hyperrealistic", "Isometric", "Cyberpunk", "Steampunk", "Synthwave / Retrowave", "Glitch Art", "Neon"]
  },
  {
    name: "🌍 Theme-Based",
    icon: <Globe className="w-4 h-4" />,
    styles: ["Nature / Landscape", "Sci-fi", "Dark Fantasy", "Utopian", "Post-Apocalyptic", "Mythological"]
  }
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('generator');

  const webhookUrl = 'https://n8n-latest-ug73.onrender.com/webhook/7aaaa7bd-25a4-4ad6-ba32-6f9ec0832852';

  const gridPatternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const finalPrompt = selectedStyle 
        ? `${prompt.trim()}, ${selectedStyle} style`
        : prompt.trim();

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "chatInput": finalPrompt
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      const data = await response.json();
      
      const imageUrl = data.imageUrl;
      
      if (imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          prompt: prompt.trim(),
          style: selectedStyle || 'Default',
          timestamp: Date.now(),
        };

        setGeneratedImages(prev => [newImage, ...prev]);
        setCurrentImageIndex(0);
      } else {
        throw new Error('No image URL received from the API. Response: ' + JSON.stringify(data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateImage = () => {
    if (currentImageIndex !== null && generatedImages[currentImageIndex]) {
      const currentImage = generatedImages[currentImageIndex];
      setPrompt(currentImage.prompt);
      setSelectedStyle(currentImage.style === 'Default' ? '' : currentImage.style);
      setTimeout(() => generateImage(), 100);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string, style: string) => {
    window.open(imageUrl, '_blank');
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const selectStyle = (style: string) => {
    setSelectedStyle(style);
    setIsStyleDropdownOpen(false);
  };

  const clearStyle = () => {
    setSelectedStyle('');
    setIsStyleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Professional background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 animate-float-slow"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-400/60 rounded-full animate-ping animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-pink-400/60 rounded-full animate-ping animation-delay-5000"></div>
        <div className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping animation-delay-7000"></div>
        
        {/* Grid pattern overlay */}
        <div className={`absolute inset-0 bg-[url('${gridPatternUrl}')] opacity-40`}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl animate-pulse hover:animate-spin transition-all duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white animate-fade-in">AI Studio</h1>
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveSection('generator')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'generator'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Generator
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'about'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {activeSection === 'generator' ? (
          <>
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl animate-bounce hover:animate-pulse transition-all duration-500 transform hover:scale-110">
                  <Wand2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
                AI Image Generator
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
                Create stunning, high-quality images with advanced AI technology and artistic precision
              </p>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {/* Input Section */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl animate-slide-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <div className="mb-6">
                  <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-4 flex items-center gap-3 animate-fade-in">
                    <Palette className="w-5 h-5" />
                    Describe Your Vision
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="A serene mountain landscape at golden hour with misty valleys..."
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none h-32 backdrop-blur-sm hover:bg-white/10 focus:scale-[1.02] transform"
                    disabled={isGenerating}
                  />
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-white mb-4 flex items-center gap-3 animate-fade-in animation-delay-200">
                    <Layers className="w-5 h-5" />
                    Art Style (Optional)
                  </label>
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                      className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white text-left flex items-center justify-between hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02] focus:scale-[1.02]"
                      disabled={isGenerating}
                    >
                      <span className={selectedStyle ? 'text-white' : 'text-gray-400'}>
                        {selectedStyle || 'Select a style...'}
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedStyle && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearStyle();
                            }}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isStyleDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isStyleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-down">
                        {styleCategories.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="p-4 border-b border-white/10 last:border-b-0">
                            <div className="flex items-center gap-2 text-gray-300 font-semibold mb-3">
                              {category.icon}
                              <span className="text-sm">{category.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {category.styles.map((style, styleIndex) => (
                                <button
                                  key={styleIndex}
                                  onClick={() => selectStyle(style)}
                                  className="p-3 text-left text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm transform hover:scale-105 hover:translate-x-1"
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-300 backdrop-blur-sm animate-shake">
                    {error}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-pulse-slow hover:animate-none"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Image
                      </>
                    )}
                  </button>

                  {currentImageIndex !== null && (
                    <button
                      onClick={regenerateImage}
                      disabled={isGenerating}
                      className="flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:rotate-180"
                    >
                      <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  )}
                </div>
              </div>

              {/* Generated Images Gallery */}
              {generatedImages.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Award className="w-6 h-6 text-blue-400" />
                    Generated Images
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                            onClick={() => setCurrentImageIndex(index)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 animate-gradient"></div>
                          
                          {/* Style badge */}
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium transform group-hover:scale-110 transition-transform duration-300 animate-fade-in">
                            {image.style}
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                            {image.prompt}
                          </p>
                          
                          <div className="flex items-center justify-between gap-3">
                            <button
                              onClick={() => copyPrompt(image.prompt)}
                              className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-110 hover:-translate-y-1"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                            
                            <button
                              onClick={() => downloadImage(image.url, image.prompt, image.style)}
                              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 hover:rotate-3"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {generatedImages.length === 0 && !isGenerating && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-sm animate-bounce hover:animate-spin transition-all duration-500">
                    <Sparkles className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 animate-fade-in-up">Ready to Create?</h3>
                  <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
                    Enter your creative prompt and let AI transform your ideas into stunning visuals
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* About Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl animate-bounce hover:animate-pulse transition-all duration-500 transform hover:scale-110">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
                About AI Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
                Crafted with passion for innovation and excellence in AI-powered creativity
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Developer Info */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-slide-left hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl animate-pulse hover:animate-spin transition-all duration-300">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Developer</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-lg text-white font-semibold">Vraj Sondagar</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <a 
                      href="mailto:vrajsondagar@gmail.com" 
                      className="text-lg text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      vrajsondagar@gmail.com
                    </a>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-300 leading-relaxed">
                    Passionate full-stack developer specializing in AI integration and modern web technologies. 
                    Dedicated to creating innovative solutions that bridge the gap between artificial intelligence and user experience.
                  </p>
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-slide-right hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl animate-pulse hover:animate-spin transition-all duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Project Features</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">AI-Powered Generation</h3>
                      <p className="text-gray-300 text-sm">Advanced AI models for high-quality image creation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Multiple Art Styles</h3>
                      <p className="text-gray-300 text-sm">Comprehensive collection of artistic styles and themes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Modern UI/UX</h3>
                      <p className="text-gray-300 text-sm">Modern, responsive design with smooth animations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">n8n Integration</h3>
                      <p className="text-gray-300 text-sm">Seamless workflow automation and API integration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-fade-in-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl animate-pulse hover:animate-spin transition-all duration-300">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Technology Stack</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'React', color: 'from-blue-400 to-blue-600' },
                  { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
                  { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' },
                  { name: 'n8n Workflows', color: 'from-purple-400 to-purple-600' },
                  { name: 'Vite', color: 'from-yellow-400 to-orange-500' },
                  { name: 'Lucide Icons', color: 'from-gray-400 to-gray-600' },
                  { name: 'AI APIs', color: 'from-green-400 to-green-600' },
                  { name: 'Modern Web', color: 'from-pink-400 to-pink-600' }
                ].map((tech, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${tech.color} p-3 rounded-xl text-white text-center font-semibold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in hover:rotate-3 hover:-translate-y-1`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10 backdrop-blur-xl animate-fade-in-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <h3 className="text-2xl font-bold text-white mb-4">Let's Connect</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Interested in collaborating or have questions about this project? Feel free to reach out!
                </p>
                <a
                  href="mailto:vrajsondagar@gmail.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-slow hover:animate-none hover:-translate-y-2"
                >
                  <Mail className="w-5 h-5" />
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-7000 { animation-delay: 7s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-left { animation: slide-left 0.8s ease-out; }
        .animate-slide-right { animation: slide-right 0.8s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;