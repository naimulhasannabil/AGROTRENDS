class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will use mock responses.');
    }
  }

  async generateContent(prompt, context = 'farming') {
    if (!this.apiKey) {
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: this.buildPrompt(prompt, context)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getMockResponse(prompt);
    }
  }

  buildPrompt(userPrompt, context) {
    const contextPrompts = {
      farming: `You are an expert agricultural advisor with extensive knowledge in sustainable farming practices, crop management, livestock care, and modern agricultural technologies. Please provide helpful, accurate, and practical advice for farmers. User question: ${userPrompt}`,
      
      disease: `You are a plant pathology expert. Analyze the following description and provide disease diagnosis with treatment recommendations. Focus on organic and sustainable solutions when possible. User description: ${userPrompt}`,
      
      weather: `You are an agricultural meteorologist. Provide farming-specific weather insights and recommendations based on the following conditions. Include advice on optimal farming activities, risk assessments, and timing recommendations. Weather query: ${userPrompt}`,
      
      yield: `You are a crop yield specialist. Analyze the provided farming conditions and predict potential yields with recommendations for optimization. Consider factors like soil, weather, management practices, and crop variety. Yield query: ${userPrompt}`,
      
      general: `You are a comprehensive agricultural expert. Provide detailed, practical advice on the following farming topic. Include specific recommendations, best practices, and considerations for sustainable agriculture. Question: ${userPrompt}`
    };

    return contextPrompts[context] || contextPrompts.general;
  }

  getMockResponse(prompt) {
    const mockResponses = [
      "Based on your description, I recommend implementing integrated pest management (IPM) practices. Start with beneficial insects like ladybugs and lacewings, then consider organic treatments like neem oil if needed.",
      
      "For optimal soil health, I suggest testing your soil pH and organic matter content. Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0). Consider adding compost to improve soil structure.",
      
      "The weather conditions you described are ideal for fungal diseases. I recommend improving air circulation around plants, avoiding overhead watering, and applying preventive organic fungicides.",
      
      "Your crop rotation plan looks good! Adding legumes will help fix nitrogen naturally. Consider cover crops during off-seasons to prevent soil erosion and improve fertility.",
      
      "For sustainable livestock management, focus on rotational grazing to improve pasture health. Ensure adequate shelter, clean water access, and regular health monitoring.",
      
      "Based on current growing conditions and your management practices, I predict yields will be 10-15% above average this season. Continue with your current fertilization schedule."
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  async getChatResponse(message) {
    return await this.generateContent(message, 'farming');
  }

  async getDiseaseAnalysis(description, imageData = null) {
    let prompt = `Plant disease analysis: ${description}`;
    if (imageData) {
      prompt += ` (Image analysis would be performed here in a full implementation)`;
    }
    return await this.generateContent(prompt, 'disease');
  }

  async getWeatherInsights(weatherData) {
    const prompt = `Current weather: Temperature ${weatherData.temperature}°C, Humidity ${weatherData.humidity}%, Wind ${weatherData.windSpeed} km/h. Provide farming recommendations.`;
    return await this.generateContent(prompt, 'weather');
  }

  async predictYield(cropData) {
    const prompt = `Yield prediction for: Crop: ${cropData.crop}, Field size: ${cropData.fieldSize} acres, Planting date: ${cropData.plantingDate}, Soil type: ${cropData.soilType}`;
    return await this.generateContent(prompt, 'yield');
  }

  async getInsights() {
    const insights = await Promise.all([
      this.generateContent("What are the current disease risks for crops this season?", 'disease'),
      this.generateContent("What are optimal planting recommendations for this time of year?", 'farming'),
      this.generateContent("What are current market trends farmers should know about?", 'general')
    ]);

    return [
      {
        id: 1,
        type: 'alert',
        title: 'Disease Risk Alert',
        message: insights[0].substring(0, 100) + '...',
        priority: 'high',
        icon: '⚠️'
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'Planting Recommendations',
        message: insights[1].substring(0, 100) + '...',
        priority: 'medium',
        icon: '🌱'
      },
      {
        id: 3,
        type: 'market',
        title: 'Market Insights',
        message: insights[2].substring(0, 100) + '...',
        priority: 'low',
        icon: '📈'
      }
    ];
  }
}

export default new GeminiService();