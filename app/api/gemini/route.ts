import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ message: "Server is missing GEMINI_API_KEY." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Check if it's form data (image) or JSON (text)
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle image upload
      const formData = await request.formData();
      const image = formData.get('image') as File;
      const message = formData.get('message') as string;
      const language = formData.get('language') as string;

      if (!image) {
        return Response.json({ message: "No image provided" }, { status: 400 });
      }

      // Convert image to base64 and send to Python model
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const base64Image = imageBuffer.toString('base64');

      try {
        // Send to Python model
        const modelResponse = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image
          })
        });

        const modelResult = await modelResponse.json();

        // Create prompt with model results
        const prompt = language === 'hi' 
          ? `आप एक सहायक पशु चिकित्सक हैं। आपको केवल देवनागरी लिपि में हिंदी में जवाब देना है।

इमेज एनालिसिस रिजल्ट:
- पशु की स्वास्थ्य स्थिति: ${modelResult.prediction}
- विश्वसनीयता: ${modelResult.confidence}%
${message ? `- किसान का प्रश्न: ${message}` : ''}

कृपया इस रिपोर्ट के आधार पर:
- 100 शब्दों में सलाह दें
- यदि बीमारी है तो इलाज के सुझाव दें
- यदि स्वस्थ है तो बचाव के उपाय बताएं
- व्यावहारिक सुझाव दें
- केवल हिंदी में जवाब दें`
          
          : `You are a helpful veterinary assistant. You MUST respond ONLY in English.

Image Analysis Results:
- Animal Health Status: ${modelResult.prediction}
- Confidence: ${modelResult.confidence}%
${message ? `- Farmer's Question: ${message}` : ''}

Based on this diagnosis, please provide:
- Response under 100 words
- If diseased: treatment recommendations
- If healthy: preventive measures
- Practical farming advice
- MANDATORY: Use English language only`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return Response.json({ message: text });

      } catch (modelError) {
        console.error("Python model error:", modelError);
        const fallbackMessage = language === 'hi' 
          ? "इमेज एनालिसिस में समस्या है। कृपया मॉडल सर्वर चालू करें और फिर कोशिश करें।"
          : "Image analysis failed. Please make sure the Python model server is running and try again.";
        
        return Response.json({ message: fallbackMessage });
      }

    } else {
      // Handle text message
      const { message, language } = await request.json();

      const prompt = language === 'hi' 
        ? `आप एक सहायक कृषि सलाहकार हैं। आपको केवल देवनागरी लिपि में हिंदी में जवाब देना है।
      
      उपयोगकर्ता का संदेश: ${message}
      
      महत्वपूर्ण: आपका जवाब केवल हिंदी भाषा में देवनागरी लिपि में होना चाहिए।
      
      अपना जवाब रखें:
      - 100 शब्दों के अंदर
      - सरल हिंदी भाषा में
      - व्यावहारिक सुझाव दें
      - पड़ोसी किसान की तरह बात करें
      - अनिवार्य: केवल हिंदी में जवाब दें`
        
        : `You are a helpful farming assistant. You MUST respond ONLY in English language.
      
      User message: ${message}
      
      IMPORTANT: Your response must be in English language only.
      
      Keep your response:
      - Under 100 words
      - Simple language
      - Practical steps only
      - Talk like you're helping a neighbor farmer
      - MANDATORY: Use English language only`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return Response.json({ message: text });
    }

  } catch (error) {
    console.error("Gemini route error:", error);
    
    // Try to get language from request for error message
    let language = 'en';
    try {
      const body = await request.json();
      language = body.language || 'en';
    } catch {
      // Default to English if can't parse
    }
    
    const errorMessage = language === 'hi' 
      ? "कनेक्शन में समस्या है। फिर से कोशिश करें।"
      : "I'm having trouble connecting. Please try again.";
    
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}
