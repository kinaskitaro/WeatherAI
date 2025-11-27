import { GoogleGenAI } from "@google/genai";
import { WeatherResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeatherForecast = async (city: string): Promise<WeatherResponse> => {
  try {
    // We use gemini-2.5-flash with googleSearch to get real-time data
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Hãy tìm kiếm thông tin thời tiết cho thành phố "${city}" trong hôm nay và 2 ngày tiếp theo (tổng cộng 3 ngày).
      
      Hãy trả về kết quả dưới dạng JSON thuần túy (được bọc trong markdown code block \`\`\`json).
      Cấu trúc JSON mong muốn:
      {
        "location": "Tên thành phố đầy đủ",
        "forecast": [
          {
            "date": "DD/MM",
            "dayName": "Tên thứ (ví dụ: Thứ Hai, hoặc Hôm nay)",
            "temp": "Nhiệt độ (ví dụ: 25°C - 30°C)",
            "condition": "Tình trạng ngắn gọn (Nắng/Mưa/Mây)",
            "description": "Mô tả ngắn gọn về thời tiết",
            "humidity": "Độ ẩm (nếu có)",
            "wind": "Gió (nếu có)"
          }
        ]
      }
      
      Đảm bảo mảng "forecast" có đúng 3 phần tử.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: 'application/json' cannot be used with googleSearch tool
      },
    });

    const text = response.text || "";
    
    // Extract Sources (Grounding Metadata)
    const sources: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    // Extract JSON from Markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
    let jsonString = jsonMatch[1] || text;
    
    // Simple cleanup if raw text has extra chars
    jsonString = jsonString.trim();
    if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7);
    if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3);

    const parsedData = JSON.parse(jsonString);

    return {
      location: parsedData.location || city,
      forecast: parsedData.forecast || [],
      sources: [...new Set(sources)] // Unique sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Không thể lấy thông tin thời tiết. Vui lòng thử lại.");
  }
};