/**
 * Chat History Manager for ShopGuard
 * 
 * Handles saving, loading, and managing chat conversations on device storage
 * Uses internal://files/ for persistent storage
 */

import file from '@system.file';

const STORAGE_DIR = 'internal://files/shopguard/conversations/';
const INDEX_FILE = 'internal://files/shopguard/conversation-index.json';

/**
 * Initialize storage directory for conversations
 * @returns {Promise} Promise that resolves when storage is ready
 */
export async function initializeStorage() {
  return new Promise((resolve, reject) => {
    // Check if directory exists
    file.access({
      uri: STORAGE_DIR,
      success: () => {
        // Directory already exists
        resolve(true);
      },
      fail: () => {
        // Create directory
        file.mkdir({
          uri: STORAGE_DIR,
          recursive: true,
          success: () => {
            console.log('Created conversation storage directory');
            resolve(true);
          },
          fail: (data, code) => {
            console.error(`Failed to create storage directory: ${code}`, data);
            reject(new Error(`Failed to create storage directory: ${code}`));
          }
        });
      }
    });
  });
}

/**
 * Save conversation to storage
 * @param {Object} conversation - The conversation object
 * @returns {Promise} Promise that resolves when conversation is saved
 */
export async function saveConversation(conversation) {
  if (!conversation || !conversation.id) {
    throw new Error('Invalid conversation object');
  }

  try {
    await initializeStorage();
    
    // Save the conversation file
    await saveConversationFile(conversation);
    
    // Update the index file
    await updateConversationIndex(conversation);
    
    return conversation.id;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

/**
 * Save conversation to individual file
 * @param {Object} conversation - The conversation object
 * @returns {Promise} Promise that resolves when file is saved
 */
async function saveConversationFile(conversation) {
  return new Promise((resolve, reject) => {
    const filePath = `${STORAGE_DIR}${conversation.id}.json`;
    
    // Convert conversation to JSON string
    const conversationJson = JSON.stringify(conversation);
    
    file.writeText({
      uri: filePath,
      text: conversationJson,
      success: () => {
        console.log(`Conversation saved to ${filePath}`);
        resolve();
      },
      fail: (data, code) => {
        console.error(`Failed to save conversation: ${code}`, data);
        reject(new Error(`Failed to save conversation: ${code}`));
      }
    });
  });
}

/**
 * Update conversation index file
 * @param {Object} conversation - The conversation object to update in the index
 * @returns {Promise} Promise that resolves when index is updated
 */
async function updateConversationIndex(conversation) {
  // Get current index
  let index = await loadConversationIndex();
  
  // Extract minimal data for index
  const indexEntry = {
    id: conversation.id,
    title: conversation.title,
    preview: conversation.preview,
    timestamp: conversation.timestamp,
    updatedAt: new Date().toISOString()
  };
  
  // Remove existing entry if present
  index = index.filter(entry => entry.id !== conversation.id);
  
  // Add the new entry at the beginning (for recent-first ordering)
  index.unshift(indexEntry);
  
  // Write the updated index
  return new Promise((resolve, reject) => {
    file.writeText({
      uri: INDEX_FILE,
      text: JSON.stringify(index),
      success: () => {
        resolve();
      },
      fail: (data, code) => {
        console.error(`Failed to update conversation index: ${code}`, data);
        reject(new Error(`Failed to update conversation index: ${code}`));
      }
    });
  });
}

/**
 * Load conversation index
 * @returns {Promise<Array>} Promise that resolves with conversation index
 */
export async function loadConversationIndex() {
  try {
    await initializeStorage();
    
    return new Promise((resolve, reject) => {
      file.readText({
        uri: INDEX_FILE,
        success: (data) => {
          try {
            const index = JSON.parse(data.text);
            resolve(Array.isArray(index) ? index : []);
          } catch (e) {
            console.log('Index file exists but is not valid JSON, returning empty array');
            resolve([]);
          }
        },
        fail: (data, code) => {
          if (code === 301) {
            // File doesn't exist yet, return empty array
            console.log('Conversation index does not exist yet, creating empty index');
            resolve([]);
          } else {
            console.error(`Failed to load conversation index: ${code}`, data);
            reject(new Error(`Failed to load conversation index: ${code}`));
          }
        }
      });
    });
  } catch (error) {
    console.error('Error initializing storage:', error);
    return [];
  }
}

/**
 * Load a specific conversation
 * @param {string} id - The conversation ID
 * @returns {Promise<Object>} Promise that resolves with the conversation object
 */
export async function loadConversation(id) {
  return new Promise((resolve, reject) => {
    const filePath = `${STORAGE_DIR}${id}.json`;
    
    file.readText({
      uri: filePath,
      success: (data) => {
        try {
          const conversation = JSON.parse(data.text);
          resolve(conversation);
        } catch (e) {
          reject(new Error('Invalid conversation format'));
        }
      },
      fail: (data, code) => {
        reject(new Error(`Failed to load conversation: ${code}`));
      }
    });
  });
}

/**
 * Delete a conversation
 * @param {string} id - The conversation ID
 * @returns {Promise} Promise that resolves when conversation is deleted
 */
export async function deleteConversation(id) {
  try {
    // Delete the conversation file
    await deleteConversationFile(id);
    
    // Update the index
    await removeFromConversationIndex(id);
    
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

/**
 * Delete conversation file
 * @param {string} id - The conversation ID
 * @returns {Promise} Promise that resolves when file is deleted
 */
async function deleteConversationFile(id) {
  return new Promise((resolve, reject) => {
    const filePath = `${STORAGE_DIR}${id}.json`;
    
    file.delete({
      uri: filePath,
      success: () => {
        resolve();
      },
      fail: (data, code) => {
        if (code === 301) {
          // File already doesn't exist
          resolve();
        } else {
          reject(new Error(`Failed to delete conversation: ${code}`));
        }
      }
    });
  });
}

/**
 * Remove conversation from index
 * @param {string} id - The conversation ID
 * @returns {Promise} Promise that resolves when index is updated
 */
async function removeFromConversationIndex(id) {
  // Get current index
  let index = await loadConversationIndex();
  
  // Remove the entry
  index = index.filter(entry => entry.id !== id);
  
  // Write the updated index
  return new Promise((resolve, reject) => {
    file.writeText({
      uri: INDEX_FILE,
      text: JSON.stringify(index),
      success: () => {
        resolve();
      },
      fail: (data, code) => {
        reject(new Error(`Failed to update conversation index: ${code}`));
      }
    });
  });
}

/**
 * Generate a unique ID for a new conversation
 * @returns {string} A unique ID
 */
export function generateConversationId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `conv-${timestamp}-${random}`;
}

/**
 * Generate a title for a conversation based on the first message
 * @param {Array} messages - Array of message objects
 * @returns {string} A title for the conversation
 */
export function generateConversationTitle(messages) {
  if (!messages || !messages.length) {
    return '新对话';
  }
  
  // Find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (!firstUserMessage) {
    return '新对话';
  }
  
  // Extract plain text from content (remove any HTML/markdown)
  let content = firstUserMessage.content;
  
  // Replace HTML tags with spaces
  content = content.replace(/<[^>]*>/g, ' ');
  
  // Truncate to first 15 characters
  let title = content.trim().substring(0, 15);
  
  // Add ellipsis if truncated
  if (content.length > 15) {
    title += '...';
  }
  
  // If no text or only contains image
  if (!title || title.trim().length === 0) {
    return firstUserMessage.imageData ? '图片对话' : '新对话';
  }
  
  return title;
}

/**
 * Generate preview text for a conversation
 * @param {Array} messages - Array of message objects
 * @returns {string} Preview text for the conversation
 */
export function generateConversationPreview(messages) {
  if (!messages || !messages.length) {
    return '无消息';
  }
  
  // Get the last message
  const lastMessage = messages[messages.length - 1];
  
  // Extract plain text from content
  let content = lastMessage.content;
  
  // Replace HTML tags with spaces
  content = content.replace(/<[^>]*>/g, ' ');
  
  // Truncate to first 25 characters
  let preview = content.trim().substring(0, 25);
  
  // Add ellipsis if truncated
  if (content.length > 25) {
    preview += '...';
  }
  
  // If no text or only contains image
  if (!preview || preview.trim().length === 0) {
    return lastMessage.imageData ? '[图片]' : '';
  }
  
  // Add role indicator
  const rolePrefix = lastMessage.role === 'user' ? '我: ' : 'AI: ';
  return rolePrefix + preview;
}

/**
 * Format a timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted date
 */
export function formatConversationDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Today's date at midnight
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Format time as HH:MM
  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  // Check if date is today
  if (date >= today) {
    return `今天 ${timeStr}`;
  }
  
  // Check if date is yesterday
  if (date >= yesterday) {
    return `昨天 ${timeStr}`;
  }
  
  // Otherwise, return full date
  return `${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`;
}
