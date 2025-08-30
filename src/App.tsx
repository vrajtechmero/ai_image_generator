import React, { useState } from 'react';
import { ImageIcon, Wand2, Download, Eye, Settings, Palette, Sparkles, Share2, FileText, Copy, Check } from 'lucide-react';

interface ImageGenerationParams {
  prompt: string;
  model: string;
  size: string;
  n: number;
  style: string;
}

interface SocialMediaContent {
  platform: string;
  caption: string;
  hashtags: string[];
}
const App: React.FC = () => {
  const [params, setParams] = useState<ImageGenerationParams>({
    prompt: '',
    model: 'img3',
    size: '1024x1024',
    n: 1,
    style: 'realistic'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [socialContent, setSocialContent] = useState<SocialMediaContent[]>([]);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
  const [copiedContent, setCopiedContent] = useState<string>('');

  const modelOptions = [
    { value: 'img4', label: 'IMG4', description: 'Latest model with superior detail and accuracy' },
    { value: 'img3', label: 'IMG3', description: 'Balanced performance and quality' },
    { value: 'qwen', label: 'Qwen', description: 'Fast generation with excellent results' },
    { value: 'uncen', label: 'Uncen', description: 'Uncensored model for creative freedom' }
  ];

  const sizeOptions = [
    { value: '1024x1024', label: 'Square', description: '1024×1024 pixels (1:1)' },
    { value: '1792x1024', label: 'Landscape', description: '1792×1024 pixels (16:9)' },
    { value: '1024x1792', label: 'Portrait', description: '1024×1792 pixels (9:16)' }
  ];

  const styleOptions = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic images', emoji: '📸' },
    { value: 'artistic', label: 'Artistic', description: 'Creative and stylized', emoji: '🎨' },
    { value: 'anime', label: 'Anime', description: 'Japanese animation style', emoji: '🌸' },
    { value: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork', emoji: '💻' },
    { value: 'oil-painting', label: 'Oil Painting', description: 'Classic oil painting style', emoji: '🖼️' },
    { value: 'watercolor', label: 'Watercolor', description: 'Soft watercolor effect', emoji: '🌊' },
    { value: 'sketch', label: 'Sketch', description: 'Hand-drawn sketch style', emoji: '✏️' },
    { value: 'cyberpunk', label: 'Cyberpunk', description: 'Futuristic neon aesthetic', emoji: '🌆' },
    { value: 'fantasy', label: 'Fantasy', description: 'Magical and mystical themes', emoji: '🧙‍♂️' },
    { value: 'sci-fi', label: 'Sci-Fi', description: 'Science fiction themes', emoji: '🚀' },
    { value: 'horror', label: 'Horror', description: 'Dark and spooky atmosphere', emoji: '👻' },
    { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic feel', emoji: '📻' },
    { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple design', emoji: '⚪' },
    { value: 'baroque', label: 'Baroque', description: 'Ornate and dramatic style', emoji: '👑' },
    { value: 'impressionist', label: 'Impressionist', description: 'Soft brushstrokes and light', emoji: '🌅' },
    { value: 'pop-art', label: 'Pop Art', description: 'Bold colors and comic style', emoji: '💥' },
    { value: 'surreal', label: 'Surreal', description: 'Dreamlike and abstract', emoji: '🌀' },
    { value: 'noir', label: 'Film Noir', description: 'Black and white dramatic', emoji: '🎬' },
    { value: 'steampunk', label: 'Steampunk', description: 'Victorian-era technology', emoji: '⚙️' },
    { value: 'gothic', label: 'Gothic', description: 'Dark medieval architecture', emoji: '🏰' },
    { value: 'art-deco', label: 'Art Deco', description: 'Geometric luxury design', emoji: '💎' },
    { value: 'graffiti', label: 'Graffiti', description: 'Urban street art style', emoji: '🎯' },
    { value: 'pixel-art', label: 'Pixel Art', description: '8-bit retro gaming style', emoji: '🕹️' },
    { value: 'neon', label: 'Neon', description: 'Bright glowing effects', emoji: '⚡' },
    { value: 'pastel', label: 'Pastel', description: 'Soft dreamy colors', emoji: '🌈' },
    { value: 'monochrome', label: 'Monochrome', description: 'Single color variations', emoji: '⚫' },
    { value: 'comic-book', label: 'Comic Book', description: 'Bold comic illustration', emoji: '💥' },
    { value: 'renaissance', label: 'Renaissance', description: 'Classical European art', emoji: '🏛️' },
    { value: 'abstract', label: 'Abstract', description: 'Non-representational art', emoji: '🎭' },
    { value: 'photojournalism', label: 'Photojournalism', description: 'Documentary photography', emoji: '📰' },
    { value: 'fashion', label: 'Fashion', description: 'High-end fashion photography', emoji: '👗' },
    { value: 'architectural', label: 'Architectural', description: 'Building and structure focus', emoji: '🏗️' }
  ];

  const samplePrompts = [
    "A majestic mountain landscape at sunset with golden light",
    "Futuristic cyberpunk city at night with neon lights",
    "A cute cat wearing a wizard hat WITH TEXT [Magic Kitty]",
    "Abstract geometric patterns in vibrant colors",
    "A serene forest path with sunlight filtering through trees",
    "Elegant woman in vintage dress dancing in the rain",
    "Steampunk airship floating above clouds",
    "Mystical dragon perched on ancient castle ruins",
    "Robot chef cooking in a modern kitchen",
    "Underwater palace with glowing coral gardens"
  ];

  const handleInputChange = (field: keyof ImageGenerationParams, value: string | number) => {
    setParams(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!params.prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return false;
    }
    if (params.prompt.length < 10) {
      setError('Please provide a more detailed prompt (at least 10 characters)');
      return false;
    }
    return true;
  };

  const generateImages = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedImages([]);

    try {
      // Add style to prompt if not realistic
      const finalPrompt = params.style !== 'realistic' 
        ? `${params.prompt.trim()} in ${params.style} style`
        : params.prompt.trim();

      const requestBody = {
        model: params.model,
        prompt: finalPrompt,
        n: params.n,
        size: params.size
      };

      const webhookUrl = 'https://n8n-latest-ug73.onrender.com/webhook/7aaaa7bd-25a4-4ad6-ba32-6f9ec0832852';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the specific webhook response format
      if (Array.isArray(result) && result.length > 0) {
        const responseData = result[0];
        if (responseData.debug?.apiResponse?.data && Array.isArray(responseData.debug.apiResponse.data)) {
          const imageUrls = responseData.debug.apiResponse.data.map((item: any) => item.url);
          setGeneratedImages(imageUrls.filter(Boolean)); // Filter out any undefined URLs
        } else {
          throw new Error('No image data found in response');
        }
      } else {
        throw new Error('Unexpected response format from webhook');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  const getJsonPreview = () => {
    const finalPrompt = params.style !== 'realistic' 
      ? `${params.prompt.trim()} in ${params.style} style`
      : params.prompt.trim();

    return {
      model: params.model,
      prompt: finalPrompt,
      n: params.n,
      size: params.size
    };
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-${params.style}-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  const generateSocialContent = async () => {
    if (!params.prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    setIsGeneratingSocial(true);
    setError('');

    try {
      // Generate content for different platforms
      const platforms = ['LinkedIn', 'Instagram', 'Facebook'];
      const content: SocialMediaContent[] = [];

      for (const platform of platforms) {
        let caption = '';
        let hashtags: string[] = [];

        switch (platform) {
          case 'LinkedIn':
            caption = `🚀 Excited to share this AI-generated artwork! Created using advanced AI technology with the prompt: "${params.prompt}". The intersection of creativity and artificial intelligence continues to amaze me. What do you think about AI's role in creative industries?`;
            hashtags = ['#AIArt', '#ArtificialIntelligence', '#DigitalArt', '#Innovation', '#Technology', '#Creativity', '#AIGenerated', '#FutureOfArt'];
            break;
          case 'Instagram':
            caption = `✨ AI magic at work! This stunning piece was created with just a few words: "${params.prompt}". Swipe to see the creative process! 🎨`;
            hashtags = ['#AIArt', '#DigitalArt', '#AIGenerated', '#ArtificialIntelligence', '#CreativeAI', '#TechArt', '#Innovation', '#DigitalCreativity', '#AIArtist', '#FutureArt', '#MachineLearning', '#GenerativeAI'];
            break;
          case 'Facebook':
            caption = `🎨 Check out this incredible AI-generated artwork! I used the prompt "${params.prompt}" and the results are absolutely stunning. It's amazing how technology can bring our imagination to life. What would you create with AI?`;
            hashtags = ['#AIArt', '#ArtificialIntelligence', '#DigitalArt', '#Technology', '#Innovation', '#CreativeAI', '#AIGenerated'];
            break;
        }

        content.push({ platform, caption, hashtags });
      }

      setSocialContent(content);
    } catch (err) {
      setError('Failed to generate social media content');
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContent(platform);
      setTimeout(() => setCopiedContent(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return;

    for (let i = 0; i < generatedImages.length; i++) {
      await downloadImage(generatedImages[i], i);
      // Add small delay between downloads
      if (i < generatedImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full transform hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 animate-gradient">
            AI Image Generator
          </h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Transform your imagination into stunning visuals with cutting-edge AI technology
          </p>
        </div>

        {/* Generation Parameters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 animate-slide-up">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generation Parameters</h2>
            </div>

            <div className="space-y-8">
              {/* Prompt Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                  ✨ Image Description
                </label>
                <textarea
                  value={params.prompt}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Describe your image in detail (e.g., 'Futuristic cyberpunk city at night with neon lights')"
                  className="w-full h-36 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all duration-300 hover:bg-white/15 focus:bg-white/20"
                />
                <div className="mt-2 flex items-center text-xs text-purple-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2 animate-pulse"></div>
                  💡 Tip: Use "WITH TEXT [your text here]\" to add text overlays
                </div>
              </div>

              {/* Sample Prompts */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                  🚀 Quick Start Examples
                </label>
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                  {samplePrompts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('prompt', sample)}
                      className="text-left p-4 text-sm bg-white/5 hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/10 hover:border-purple-400/50 transform hover:scale-[1.02] hover:shadow-lg group"
                    >
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 mt-2 group-hover:animate-pulse"></div>
                        <span className="text-purple-100 group-hover:text-white transition-colors duration-200">{sample}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Model Selection */}
                <div className="group">
                  <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                    🤖 AI Model
                  </label>
                  <select
                    value={params.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 cursor-pointer"
                  >
                    {modelOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-purple-300 mt-2 flex items-center">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    {modelOptions.find(opt => opt.value === params.model)?.description}
                  </p>
                </div>

                {/* Image Size */}
                <div className="group">
                  <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                    📐 Image Dimensions
                  </label>
                  <select
                    value={params.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 cursor-pointer"
                  >
                    {sizeOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-purple-300 mt-2 flex items-center">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    {sizeOptions.find(opt => opt.value === params.size)?.description}
                  </p>
                </div>
              </div>

              {/* Style Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                  <Palette className="w-4 h-4 inline mr-2" />
                  🎨 Art Style
                </label>
                <select
                  value={params.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 cursor-pointer"
                >
                  {styleOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.emoji} {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-purple-300 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                  {styleOptions.find(opt => opt.value === params.style)?.description}
                </p>
              </div>

              {/* Number of Images */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3 group-hover:text-white transition-colors duration-200">
                  🖼️ Number of Images: {params.n}
                </label>
                <div className="flex items-center space-x-6">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={params.n}
                    onChange={(e) => handleInputChange('n', parseInt(e.target.value))}
                    className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => handleInputChange('n', num)}
                        className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                          params.n === num
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/30'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateImages}
                disabled={isGenerating || !params.prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-5 px-8 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center space-x-3 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 animate-bounce" />
                    <span>Generate Images</span>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </button>

              {/* JSON Preview Toggle */}
              <button
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="w-full text-sm text-purple-300 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-white/5"
              >
                <Eye className="w-4 h-4" />
                <span>{showJsonPreview ? 'Hide' : 'Show'} API Payload</span>
              </button>

              {/* JSON Preview */}
              {showJsonPreview && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fade-in">
                  <h3 className="text-sm font-semibold text-purple-200 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    API Request Payload:
                  </h3>
                  <pre className="text-xs text-green-300 overflow-x-auto font-mono bg-black/20 p-4 rounded-lg">
                    {JSON.stringify(getJsonPreview(), null, 2)}
                  </pre>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 animate-shake">
                  <p className="text-red-200 text-sm flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Masterpieces Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 animate-slide-up animation-delay-400">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generated Masterpieces</h2>
            </div>

            {generatedImages.length === 0 && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 text-purple-200 animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
                  <ImageIcon className="w-20 h-20 relative z-10" />
                </div>
                <p className="text-xl font-semibold mb-2">Ready to Create</p>
                <p className="text-sm text-center max-w-xs">Configure your parameters above and click generate to bring your imagination to life</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-6">
                    <Wand2 className="w-12 h-12 text-white animate-bounce" />
                  </div>
                </div>
                <p className="text-white text-xl font-semibold mb-2">Crafting Your Vision</p>
                <p className="text-purple-200 text-sm text-center">Our AI is working its magic...</p>
                <div className="mt-6 flex space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            )}

            {generatedImages.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-purple-200 text-sm">
                    ✨ Generated {generatedImages.length} image{generatedImages.length > 1 ? 's' : ''} successfully
                  </p>
                </div>
                <div className={`grid gap-6 ${
                  generatedImages.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                  generatedImages.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
                }`}>
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group animate-scale-in" style={{animationDelay: `${index * 200}ms`}}>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform group-hover:scale-[1.02]">
                        <img
                          src={imageUrl}
                          alt={`Generated image ${index + 1}: ${params.prompt}`}
                          className="w-full h-auto object-cover"
                          onError={() => setError(`Failed to load image ${index + 1}`)}
                          onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <p className="text-white text-sm font-medium truncate mb-2">
                            {params.prompt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-purple-200">
                              {params.model.toUpperCase()} • {params.size} • {styleOptions.find(s => s.value === params.style)?.label}
                            </div>
                            <button
                              onClick={() => downloadImage(imageUrl, index)}
                              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Download All Button */}
                {generatedImages.length > 1 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={downloadAllImages}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download All Images</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social Media Content Generation */}
        {generatedImages.length > 0 && (
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Social Media Content</h2>
                </div>
                <button
                  onClick={generateSocialContent}
                  disabled={isGeneratingSocial}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                >
                  {isGeneratingSocial ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>

              {socialContent.length === 0 && !isGeneratingSocial && (
                <div className="flex flex-col items-center justify-center h-48 text-purple-200 animate-fade-in">
                  <Share2 className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">Ready to Share</p>
                  <p className="text-sm text-center max-w-xs">Generate optimized captions and hashtags for your social media posts</p>
                </div>
              )}

              {socialContent.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {socialContent.map((content, index) => (
                    <div key={content.platform} className="bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 150}ms`}}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                          {content.platform === 'LinkedIn' && <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>}
                          {content.platform === 'Instagram' && <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-2"></div>}
                          {content.platform === 'Facebook' && <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>}
                          {content.platform}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(`${content.caption}\n\n${content.hashtags.join(' ')}`, content.platform)}
                          className="text-purple-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                        >
                          {copiedContent === content.platform ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-purple-300 mb-2">Caption</label>
                          <p className="text-sm text-purple-100 leading-relaxed bg-black/20 p-3 rounded-lg">
                            {content.caption}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-purple-300 mb-2">Hashtags</label>
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-2 py-1 rounded-full border border-purple-400/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="text-center mt-16 text-purple-300 text-sm animate-fade-in animation-delay-1000">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Powered by Advanced AI Models</span>
            <Sparkles className="w-4 h-4 animate-pulse animation-delay-500" />
          </div>
          <p>Generate up to 4 stunning images simultaneously</p>
        </div>
      </div>
    </div>
  );
};

export default App;