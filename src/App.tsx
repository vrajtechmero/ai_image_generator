import React, { useState, useEffect } from 'react';
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
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [copyStatus, setCopyStatus] = useState<{[key: string]: 'idle' | 'copying' | 'success' | 'error'}>({});
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('generator');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleVisibility = () => setIsVisible(true);
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Voice recognition error. Please try again.');
      };
      
      setRecognition(recognitionInstance);
    }
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleVisibility, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const webhookUrl = 'https://n8n-latest-ug73.onrender.com/webhook/7aaaa7bd-25a4-4ad6-ba32-6f9ec0832852';

  const gridPatternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
    const webhookUrl = 'https://n8n-latest-ug73.onrender.com/webhook/7aaaa7bd-25a4-4ad6-ba32-6f9ec0832852';
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
          chatInput: finalPrompt
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
        setError(data.message || data.error || 'Failed to generate image');
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

  const startVoiceRecognition = () => {
    if (recognition && !isListening) {
      setError('');
      recognition.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Save project functionality
  const saveProject = () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const projectData = {
        prompt,
        selectedStyle,
        generatedImages,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      // Save to localStorage
      localStorage.setItem('ai-studio-project', JSON.stringify(projectData));
      
      // Simulate save delay for better UX
      setTimeout(() => {
        setIsSaving(false);
        setSaveMessage('Project saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      }, 1000);
      
    } catch (error) {
      setIsSaving(false);
      setSaveMessage('Failed to save project. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Load project on component mount
  useEffect(() => {
    try {
      const savedProject = localStorage.getItem('ai-studio-project');
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        setPrompt(projectData.prompt || '');
        setSelectedStyle(projectData.selectedStyle || '');
        setGeneratedImages(projectData.generatedImages || []);
      }
    } catch (error) {
      console.error('Failed to load saved project:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Only show background animations when dropdown is closed */}
        {!isStyleDropdownOpen && (
          <>
            {/* Floating orbs with parallax */}
            <div 
              className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
                top: '10%',
                left: '10%'
              }}
            ></div>
            <div 
              className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"
              style={{
                transform: `translateY(${scrollY * 0.3}px)`,
                top: '60%',
                right: '10%'
              }}
            ></div>
            <div 
              className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"
              style={{
                transform: `translateY(${scrollY * 0.7}px)`,
                top: '40%',
                left: '70%'
              }}
            ></div>

            {/* Animated particles */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse"></div>
          </>
        )}
        
        {/* Grid pattern overlay */}
        <div 
          className={`absolute inset-0 bg-[url('${gridPatternUrl}')] opacity-40 animate-grid-shift`}
          style={{ transform: `translateX(${scrollY * 0.02}px) translateY(${scrollY * 0.01}px)` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ${scrollY > 50 ? 'bg-white/10 shadow-2xl' : ''} animate-slide-down`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl animate-pulse hover:animate-spin transition-all duration-300 animate-glow hover:animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white animate-fade-in animate-text-shimmer">AI Studio</h1>
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveSection('generator')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-slide-in-right ${
                  activeSection === 'generator'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-glow-blue'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Generator
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-slide-in-right animation-delay-200 ${
                  activeSection === 'about'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-glow-blue'
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
            <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl animate-bounce hover:animate-pulse transition-all duration-500 transform hover:scale-110 animate-glow animate-rotate-slow">
                  <Wand2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in-up animate-scale-in">
                AI Image Generator
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500 animate-typewriter">
                Create stunning, high-quality images with advanced AI technology and artistic precision
              </p>
            </div>

            {/* Main Content */}
            <div className={`max-w-4xl mx-auto ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              {/* Input Section */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl animate-slide-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-border-glow hover:animate-float-gentle">
                <div className="mb-6">
                  <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-4 flex items-center gap-3 animate-fade-in animate-slide-in-left">
                    <Palette className="w-5 h-5" />
                    Describe Your Vision
                  </label>
                  <div className="relative">
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="A serene mountain landscape at golden hour with misty valleys..."
                      className="w-full p-4 pr-16 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none h-32 backdrop-blur-sm hover:bg-white/10 focus:scale-[1.02] transform animate-border-pulse focus:animate-glow-blue hover:animate-subtle-bounce"
                      disabled={isGenerating}
                    />
                    <button
                      onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                      disabled={isGenerating || !recognition}
                      className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                        isListening 
                          ? 'bg-red-500/20 text-red-400 animate-pulse' 
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={isListening ? 'Stop voice input' : 'Start voice input'}
                    >
                      {isListening ? (
                        <div className="w-5 h-5 bg-red-400 rounded-full animate-pulse"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-white mb-4 flex items-center gap-3 animate-fade-in animation-delay-200 animate-slide-in-left animation-delay-300">
                    <Layers className="w-5 h-5" />
                    Art Style (Optional)
                  </label>
                  
                  <div className={`relative ${isStyleDropdownOpen ? 'z-50' : 'z-10'}`}>
                    <button
                      onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                      className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white text-left flex items-center justify-between hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02] focus:scale-[1.02] animate-border-pulse hover:animate-subtle-bounce focus:animate-glow-blue"
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

                    {/* Dropdown with improved positioning and scrolling support */}
                    {isStyleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-down animate-scale-in"
                           style={{ position: 'absolute' }}>
                        {styleCategories.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="p-4 border-b border-gray-700 last:border-b-0 animate-fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                            <div className="flex items-center gap-2 text-gray-300 font-semibold mb-3 animate-slide-in-left">
                              {category.icon}
                              <span className="text-sm">{category.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {category.styles.map((style, styleIndex) => (
                                <button
                                  key={styleIndex}
                                  onClick={() => selectStyle(style)}
                                  className="p-3 text-left text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm transform hover:scale-105 hover:translate-x-1 animate-fade-in hover:animate-glow-subtle animate-slide-in-right"
                                  style={{ animationDelay: `${(categoryIndex * 10 + styleIndex) * 50}ms` }}
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
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-pulse-slow hover:animate-none animate-glow hover:animate-bounce-gentle animate-gradient-shift"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin animate-pulse"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 animate-pulse" />
                        Generate Image
                      </>
                    )}
                  </button>
                  <button
                    onClick={saveProject}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-right animation-delay-400"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-300/30 border-t-green-300 rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>

                  {currentImageIndex !== null && (
                    <button
                      onClick={regenerateImage}
                      disabled={isGenerating}
                      className="flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:rotate-180 animate-slide-in-right animate-border-pulse hover:animate-glow-subtle"
                    >
                      <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin animate-pulse' : 'animate-rotate-slow'}`} />
                      Regenerate
                    </button>
                  )}
                </div>
              </div>

              {/* Generated Images Gallery */}
              {generatedImages.length > 0 && (
                <div 
                  className="animate-fade-in-up transition-all duration-300 ease-in-out"
                  style={{ 
                    marginTop: isStyleDropdownOpen ? '320px' : '0px',
                    transform: isStyleDropdownOpen ? 'translateY(20px)' : 'translateY(0px)'
                  }}
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-slide-up animation-delay-500 animate-border-glow hover:animate-float-gentle">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 animate-fade-in-up animate-text-shimmer">
                      <Award className="w-6 h-6 text-blue-400" />
                      Generated Images
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedImages.map((image, index) => (
                        <div
                          key={image.id}
                          className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-fade-in animate-scale-in hover:animate-glow-subtle animate-border-pulse"
                          style={{ animationDelay: `${index * 200}ms` }}
                        >
                          <div className="aspect-square relative overflow-hidden animate-shimmer">
                            <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1 animate-fade-in hover:animate-subtle-zoom"
                              onClick={() => setCurrentImageIndex(index)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 animate-gradient animate-shimmer-overlay"></div>
                            
                            {/* Style badge */}
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium transform group-hover:scale-110 transition-transform duration-300 animate-fade-in animate-slide-in-left animate-glow-subtle">
                              {image.style}
                            </div>
                          </div>

                          <div className="p-4 animate-slide-in-up animation-delay-300">
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed animate-fade-in animation-delay-400">
                              {image.prompt}
                            </p>
                            
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => copyPrompt(image.prompt)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-110 hover:-translate-y-1 animate-slide-in-left animation-delay-500 hover:animate-bounce-gentle animate-border-pulse"
                              >
                                <Copy className="w-4 h-4 animate-pulse" />
                                Copy
                              </button>
                              
                              <button
                                onClick={() => downloadImage(image.url, image.prompt, image.style)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 hover:rotate-3 animate-slide-in-right animation-delay-500 hover:animate-bounce-gentle animate-glow animate-gradient-shift"
                              >
                                <Download className="w-4 h-4 animate-pulse" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {generatedImages.length === 0 && !isGenerating && (
                <div className="text-center py-16 animate-fade-in animate-scale-in">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-sm animate-bounce hover:animate-spin transition-all duration-500 animate-glow animate-morph">
                    <Sparkles className="w-12 h-12 text-blue-400 animate-pulse animate-rotate-slow" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 animate-fade-in-up animate-text-shimmer">Ready to Create?</h3>
                  <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed animate-fade-in-up animation-delay-300 animate-typewriter">
                    Enter your creative prompt and let AI transform your ideas into stunning visuals
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* About Section */
          <div className={`max-w-4xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16 animate-scale-in">
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl animate-bounce hover:animate-pulse transition-all duration-500 transform hover:scale-110 animate-glow animate-rotate-slow">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up animate-text-shimmer animate-scale-in">
                About AI Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500 animate-typewriter">
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
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-slide-right hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-border-glow hover:animate-float-gentle">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl animate-pulse hover:animate-spin transition-all duration-300 animate-glow">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white animate-slide-in-left animate-text-shimmer">Project Features</h2>
                </div>
                
                <div className="space-y-4 animate-fade-in animation-delay-300">
                  <div className="flex items-start gap-3 animate-slide-in-right animation-delay-400">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">AI-Powered Generation</h3>
                      <p className="text-gray-300 text-sm">Advanced AI models for high-quality image creation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 animate-slide-in-right animation-delay-500">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Multiple Art Styles</h3>
                      <p className="text-gray-300 text-sm">Comprehensive collection of artistic styles and themes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 animate-slide-in-right animation-delay-600">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Modern UI/UX</h3>
                      <p className="text-gray-300 text-sm">Modern, responsive design with smooth animations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 animate-slide-in-right animation-delay-650">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Voice Input</h3>
                      <p className="text-gray-300 text-sm">Speak your prompts with accurate voice recognition</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 animate-slide-in-right animation-delay-700">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">n8n Integration</h3>
                      <p className="text-gray-300 text-sm">Seamless workflow automation and API integration</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Save Message */}
              {saveMessage && (
                <div className={`mt-2 text-center text-sm font-medium animate-fade-in ${
                  saveMessage.includes('successfully') ? 'text-green-300' : 'text-red-300'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>

            {/* Technology Stack */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-fade-in-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-border-glow hover:animate-float-gentle">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl animate-pulse hover:animate-spin transition-all duration-300 animate-glow">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white animate-slide-in-right animate-text-shimmer">Technology Stack</h2>
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
                    className={`bg-gradient-to-r ${tech.color} p-3 rounded-xl text-white text-center font-semibold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in hover:rotate-3 hover:-translate-y-1 animate-scale-in hover:animate-bounce-gentle animate-glow-subtle animate-gradient-shift`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10 backdrop-blur-xl animate-fade-in-up hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-border-glow hover:animate-float-gentle">
                <h3 className="text-2xl font-bold text-white mb-4 animate-text-shimmer animate-scale-in">Let's Connect</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto animate-typewriter animation-delay-300">
                  Interested in collaborating or have questions about this project? Feel free to reach out!
                </p>
                <a
                  href="mailto:vrajsondagar@gmail.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-slow hover:animate-none hover:-translate-y-2 animate-glow hover:animate-bounce-gentle animate-gradient-shift"
                >
                  <Mail className="w-5 h-5 animate-pulse" />
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Animation Delays */
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-7000 { animation-delay: 7s; }
        
        /* Floating Animations */
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
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        /* Fade Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Slide Animations */
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
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Scale Animations */
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Rotation Animations */
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Morphing Animations */
        @keyframes morph {
          0%, 100% { border-radius: 50%; }
          25% { border-radius: 40% 60% 70% 30%; }
          50% { border-radius: 60% 40% 30% 70%; }
          75% { border-radius: 30% 70% 40% 60%; }
        }
        
        @keyframes morph-delayed {
          0%, 100% { border-radius: 60% 40% 30% 70%; }
          25% { border-radius: 30% 70% 40% 60%; }
          50% { border-radius: 50%; }
          75% { border-radius: 40% 60% 70% 30%; }
        }
        
        @keyframes morph-slow {
          0%, 100% { border-radius: 30% 70% 40% 60%; }
          33% { border-radius: 50%; }
          66% { border-radius: 40% 60% 70% 30%; }
        }
        
        /* Drift Animations */
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, -20px); }
          75% { transform: translate(-10px, -5px); }
        }
        
        @keyframes drift-reverse {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, 10px); }
          50% { transform: translate(5px, 20px); }
          75% { transform: translate(10px, 5px); }
        }
        
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, -5px); }
        }
        
        @keyframes drift-fast {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -15px); }
          50% { transform: translate(-10px, -25px); }
          75% { transform: translate(-15px, -10px); }
        }
        
        @keyframes drift-diagonal {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes drift-circular {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(0, -20px); }
          75% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        /* Glow Animations */
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.5); }
        }
        
        @keyframes glow-blue {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes glow-subtle {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); }
        }
        
        /* Border Animations */
        @keyframes border-glow {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.3); }
        }
        
        @keyframes border-pulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.2); }
          50% { border-color: rgba(147, 51, 234, 0.4); }
        }
        
        /* Text Animations */
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        /* Background Animations */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes grid-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 5px); }
        }
        
        /* Shimmer Animations */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes shimmer-overlay {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.1; }
        }
        
        /* Bounce Animations */
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes subtle-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Error Animations */
        @keyframes pulse-error {
          0%, 100% { background-color: rgba(239, 68, 68, 0.1); }
          50% { background-color: rgba(239, 68, 68, 0.2); }
        }
        
        /* Shake Animation */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        /* Pulse Animations */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Animation Classes */
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-left { animation: slide-left 0.8s ease-out; }
        .animate-slide-right { animation: slide-right 0.8s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        
        .animate-scale-in { animation: scale-in 0.8s ease-out; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        
        .animate-morph { animation: morph 8s ease-in-out infinite; }
        .animate-morph-delayed { animation: morph-delayed 10s ease-in-out infinite; }
        .animate-morph-slow { animation: morph-slow 12s ease-in-out infinite; }
        
        .animate-drift { animation: drift 6s ease-in-out infinite; }
        .animate-drift-reverse { animation: drift-reverse 7s ease-in-out infinite; }
        .animate-drift-slow { animation: drift-slow 8s ease-in-out infinite; }
        .animate-drift-fast { animation: drift-fast 4s ease-in-out infinite; }
        .animate-drift-diagonal { animation: drift-diagonal 5s ease-in-out infinite; }
        .animate-drift-circular { animation: drift-circular 6s ease-in-out infinite; }
        
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-glow-blue { animation: glow-blue 2s ease-in-out infinite; }
        .animate-glow-subtle { animation: glow-subtle 4s ease-in-out infinite; }
        
        .animate-border-glow { animation: border-glow 3s ease-in-out infinite; }
        .animate-border-pulse { animation: border-pulse 2s ease-in-out infinite; }
        
        .animate-text-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: text-shimmer 3s ease-in-out infinite;
        }
        
        .animate-typewriter { 
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end);
        }
        
        .animate-gradient-shift { 
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .animate-grid-shift { animation: grid-shift 10s ease-in-out infinite; }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-shimmer-overlay { animation: shimmer-overlay 3s ease-in-out infinite; }
        
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-subtle-bounce { animation: subtle-bounce 0.3s ease-in-out; }
        .animate-subtle-zoom { animation: subtle-zoom 0.3s ease-in-out; }
        
        .animate-pulse-error { animation: pulse-error 1s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        /* Utility Classes */
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