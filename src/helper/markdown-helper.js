/**
 * Markdown Helper
 * Provides convenience methods for handling markdown content in QuickApp
 */

import { containsMarkdown, renderSimpleMarkdown } from './util/markdown-utils';
import { renderMarkdown, containsMarkdown as directContainsMarkdown } from './util/direct-markdown';

/**
 * Check if text contains markdown formatting
 * @param {string} text - The text to check
 * @return {boolean} - True if the text contains markdown syntax
 */
export function isMarkdown(text) {
  return directContainsMarkdown(text);
}

/**
 * Format message content with markdown support
 * @param {string} content - Message content
 * @return {string} - Formatted content
 */
export function formatMessageContent(content) {
  // Don't process empty messages
  if (!content) {
    return '';
  }
  
  content = content.trim();
  
  // Check if the content contains markdown
  const hasMarkdown = isMarkdown(content);
  
  if (hasMarkdown) {
    // For markdown content, use our direct renderer
    return renderMarkdown(content);
  } else {
    // For non-markdown content, apply simple text formatting for better display
    return formatPlainText(content);
  }
}

/**
 * Format plain text for better display
 * @param {string} content - Text content
 * @return {string} - Formatted text
 */
function formatPlainText(content) {
  let result = "";
  const words = content.split(" ");
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // If adding this word would make the line too long, add a line break
    if (currentLine.length + word.length > 40 && currentLine.length > 0) {
      result += currentLine.trim() + "\n";
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  // Add the final line
  if (currentLine.length > 0) {
    result += currentLine.trim();
  }
  
  return result;
}