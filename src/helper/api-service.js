/**
 * API Service for ShopGuard AI
 * Handles API communication with the backend
 */

import fetch from '@system.fetch';
import file from '@system.file';
import SYSTEM, { getSystemSetting } from './system-settings';

// API configuration
const API_CONFIG = {
  endpoint: getSystemSetting('API.endpoint') || 'http://localhost:8000/v1/chat/completions',
  model: getSystemSetting('API.model') || 'vivo-BlueLM-TB-Pro',
  timeout: SYSTEM.API_TIMEOUT,
  timeoutImage: SYSTEM.API_TIMEOUT_IMAGE,
  timeoutMax: SYSTEM.API_TIMEOUT_MAX,
  maxRetries: SYSTEM.MAX_RETRY,
}

/**
 * Custom base64 encoder function since btoa() is not available in QuickApp
 * @param {string} input - The binary string to encode
 * @returns {string} - Base64 encoded string
 */
function customBase64Encode(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  
  while (i < input.length) {
    const chr1 = input.charCodeAt(i++);
    const chr2 = i < input.length ? input.charCodeAt(i++) : 0;
    const chr3 = i < input.length ? input.charCodeAt(i++) : 0;
    
    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    const enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    const enc4 = chr3 & 63;
    
    output += chars.charAt(enc1) + chars.charAt(enc2) + 
              (isNaN(chr2) ? '=' : chars.charAt(enc3)) + 
              (isNaN(chr3) ? '=' : chars.charAt(enc4));
  }
  
  return output;
}

/**
 * Convert a file URI to base64 data URL
 * @param {string} uri - The URI of the image file
 * @returns {Promise<string>} - A promise that resolves to a base64 data URL
 */
export function fileUriToBase64DataUrl(uri) {
  return new Promise((resolve, reject) => {
    console.log('Starting image conversion from:', uri);
    // Read the file as ArrayBuffer
    file.readArrayBuffer({
      uri: uri,
      success: function(data) {
        try {
          const fileSizeBytes = data.buffer.length;
          const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
          console.log(`File read success, buffer size: ${fileSizeBytes} bytes (${fileSizeMB} MB)`);
          
          // Warn about large files
          if (fileSizeBytes > 5 * 1024 * 1024) { // 5MB
            console.warn(`Large image detected: ${fileSizeMB}MB. This may cause slower processing.`);
          }
          
          // Convert ArrayBuffer to base64
          const uint8Array = new Uint8Array(data.buffer);
          let binary = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          // Use our custom base64 encoder instead of btoa
          const base64String = customBase64Encode(binary);
          
          // Determine mime type from file extension
          let mimeType = 'image/jpeg'; // Default
          if (uri.toLowerCase().endsWith('.png')) {
            mimeType = 'image/png';
          } else if (uri.toLowerCase().endsWith('.gif')) {
            mimeType = 'image/gif';
          } else if (uri.toLowerCase().endsWith('.webp')) {
            mimeType = 'image/webp';
          }
          
          // Format as data URL
          const dataUrl = `data:${mimeType};base64,${base64String}`;
          console.log('Conversion successful, data URL length:', dataUrl.length);
          resolve(dataUrl);
        } catch (e) {
          console.error('Error converting to base64:', e);
          reject(e);
        }
      },
      fail: function(data, code) {
        console.error(`Failed to read file: ${code}`, data);
        reject(new Error(`Failed to read file: ${code}`));
      }
    });
  });
}

/**
 * Call chatbot API with text and optional image data
 * @param {string} userInput - User text input
 * @param {Array} messageHistory - Previous messages in the conversation
 * @param {string} imageData - Optional image URI or base64 data URL
 * @returns {Promise<string>} Bot response text
 */
export function callChatbotAPI(userInput, messageHistory = [], imageData = null) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('callChatbotAPI called with:', { 
        userInput, 
        hasMessageHistory: messageHistory.length > 0,
        hasImageData: imageData !== null,
        imageDataType: imageData ? (imageData.startsWith('data:') ? 'base64 data URL' : 'URI') : 'none'
      });

      // If imageData is a file URI (starts with "internal://"), convert it to base64 data URL
      if (imageData && typeof imageData === 'string' && imageData.startsWith('internal://')) {
        console.log('Converting image URI to base64 data URL:', imageData);
        try {
          imageData = await fileUriToBase64DataUrl(imageData);
          console.log('Image converted to base64 data URL successfully, length:', imageData.length);
          console.log('Data URL starts with:', imageData.substring(0, 50) + '...');
        } catch (error) {
          console.error('Failed to convert image:', error);
          // Continue without the image if conversion fails
          imageData = null;
        }
      } else if (imageData) {
        console.log('Image data is already in format:', imageData.substring(0, 30) + '...');
      }
      
      // Format message history for API
      const apiMessages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log('Adding current message to API messages');
      // Add current user message (with or without image)
      if (imageData && userInput) {
        // If both text and image are present
        console.log('Adding both text and image to message');
        apiMessages.push({
          role: "user",
          content: [
            { type: "text", text: userInput },
            { type: "image_url", image_url: { url: imageData } }
          ]
        });
      } else if (imageData) {
        // If only image is present
        console.log('Adding only image to message');
        apiMessages.push({
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageData } }
          ]
        });
      } else {
        // If only text is present
        console.log('Adding only text to message');
        apiMessages.push({ role: "user", content: userInput });
      }
      
      const requestBody = {
        model: API_CONFIG.model,
        messages: apiMessages,
      };

      const requestBodyString = JSON.stringify(requestBody);
      console.log('Sending API request with payload:', requestBody);

      // Determine timeout based on whether image is present and its size
      let requestTimeout = imageData ? API_CONFIG.timeoutImage : API_CONFIG.timeout;
      
      // For large images, increase timeout dynamically
      if (imageData) {
        const imageSizeKB = imageData.length / 1024;
        if (imageSizeKB > 5000) { // More than 5MB
          // Add extra time for very large images: 2 minutes per MB over 5MB
          const extraMB = (imageSizeKB - 5000) / 1024;
          const extraTime = Math.ceil(extraMB) * 120000; // 2 minutes per MB
          requestTimeout = Math.min(requestTimeout + extraTime, API_CONFIG.timeoutMax); // Max 15 minutes
          console.log(`Large image detected (${(imageSizeKB/1024).toFixed(2)}MB), extending timeout to ${(requestTimeout/1000/60).toFixed(1)} minutes`);
        }
      }
      
      console.log(`Using timeout: ${requestTimeout}ms (${imageData ? 'image' : 'text'} request)`);
      console.log(`Platform timeouts: connectTimeout=30s, readTimeout=15min, writeTimeout=3min`);
      
      // Log request size information
      const requestSize = (requestBodyString.length / 1024).toFixed(2);
      console.log(`Request size: ${requestSize} KB`);
      if (imageData) {
        const imageSize = (imageData.length / 1024).toFixed(2);
        console.log(`Image data size: ${imageSize} KB`);
      }

      // Using system.fetch to make the API call
      fetch.fetch({
        url: API_CONFIG.endpoint,
        method: 'POST',
        data: requestBodyString,
        header: {
          'Content-Type': 'application/json'
        },
        timeout: requestTimeout,
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
    } catch (error) {
      console.error('Error in callChatbotAPI:', error);
      reject(error);
    }
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