/**
 * API Service for ShopGuard AI
 * Handles API communication with the backend
 */

import fetch from '@system.fetch'
import SYSTEM, { getSystemSetting } from './system-settings'

// API configuration
const API_CONFIG = {
  endpoint: getSystemSetting('API.endpoint') || 'http://localhost:8000/v1/chat/completions',
  model: getSystemSetting('API.model') || 'vivo-BlueLM-TB-Pro',
  timeout: SYSTEM.API_TIMEOUT,
  maxRetries: SYSTEM.MAX_RETRY,
}

/**
 * Call chatbot API with text and optional image data
 * @param {string} userInput - User text input
 * @param {Array} messageHistory - Previous messages in the conversation
 * @param {string} imageData - Optional base64 image data
 * @returns {Promise<string>} Bot response text
 */
export function callChatbotAPI(userInput, messageHistory = [], imageData = null) {
  return new Promise((resolve, reject) => {
    // Format message history for API
    const apiMessages = messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add current user message (with or without image)
    if (imageData && userInput) {
      // If both text and image are present
      apiMessages.push({
        role: "user",
        content: [
          { type: "text", text: userInput },
          { type: "image_url", image_url: { url: imageData } }
        ]
      });
    } else if (imageData) {
      // If only image is present
      apiMessages.push({
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageData } }
        ]
      });
    } else {
      // If only text is present
      apiMessages.push({ role: "user", content: userInput });
    }
    
    const requestBody = {
      model: API_CONFIG.model,
      messages: apiMessages,
    };

    const requestBodyString = JSON.stringify(requestBody);

    // Using system.fetch to make the API call
    fetch.fetch({
      url: API_CONFIG.endpoint,
      method: 'POST',
      data: requestBodyString,
      header: {
        'Content-Type': 'application/json'
      },
      timeout: API_CONFIG.timeout,
      success: function(response) {
        console.log(`API response status: ${response.code}`);
        
        if (response.code === 200) {
          try {
            const responseData = JSON.parse(response.data);
            
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
              resolve(responseData.choices[0].message.content);
            } else {
              reject(new Error("API response did not contain a valid choice."));
            }
          } catch (error) {
            console.error('Error parsing API response:', error);
            reject(new Error('Failed to parse API response'));
          }
        } else {
          reject(new Error(`API Error: ${response.code}`));
        }
      },
      fail: function(data, code) {
        console.error(`API request failed with code ${code}: ${data}`);
        reject(new Error(`Request failed: ${code}`));
      }
    });
  });
}

/**
 * Update API endpoint 
 * @param {string} newEndpoint - New API endpoint URL
 */
export function setAPIEndpoint(newEndpoint) {
  API_CONFIG.endpoint = newEndpoint;
  console.info('API endpoint updated:', newEndpoint);
}

/**
 * Update API model
 * @param {string} newModel - New model name
 */
export function setAPIModel(newModel) {
  API_CONFIG.model = newModel;
  console.info('API model updated:', newModel);
}

export default {
  callChatbotAPI,
  setAPIEndpoint,
  setAPIModel
}