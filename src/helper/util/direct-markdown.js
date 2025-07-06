/**
 * Direct Markdown Renderer
 * A simplified markdown to rich text converter for QuickApp
 */

/**
 * Convert markdown to QuickApp rich text format
 * @param {string} text - Markdown text
 * @return {string} - Text with QuickApp styling
 */
export function renderMarkdown(text) {
  if (!text) return '';
  
  // Process bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold;">$1</span>');
  text = text.replace(/__(.*?)__/g, '<span style="font-weight: bold;">$1</span>');
  
  // Process italic
  text = text.replace(/\*(.*?)\*/g, '<span style="font-style: italic;">$1</span>');
  text = text.replace(/_(.*?)_/g, '<span style="font-style: italic;">$1</span>');
  
  // Process code
  text = text.replace(/`(.*?)`/g, '<span style="font-family: monospace; background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</span>');
  
  return text;
}

/**
 * Check if text contains markdown formatting
 * @param {string} text - The text to check
 * @return {boolean} - True if the text contains markdown syntax
 */
export function containsMarkdown(text) {
  if (!text) return false;
  
  // Common markdown patterns
  const markdownPatterns = [
    /\*\*(.*?)\*\*/g,  // Bold **text**
    /\*(.*?)\*/g,      // Italic *text*
    /__(.*?)__/g,      // Bold __text__
    /_(.*?)_/g,        // Italic _text_
    /`(.*?)`/g,        // Inline code `code`
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}
