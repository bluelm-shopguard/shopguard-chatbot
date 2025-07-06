/**
 * Markdown Utilities for QuickApp
 * A lightweight markdown parser that converts basic markdown syntax to simple 
 * text formatting that can be rendered in QuickApp text components.
 */

/**
 * Detects if text contains markdown formatting
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
    /```([\s\S]*?)```/g, // Code block ```code```
    /^#+\s+.+$/m,     // Headings # Heading
    /^\s*[-*+]\s+.+$/m, // Unordered lists
    /^\s*\d+\.\s+.+$/m, // Ordered lists
    /\[.+?\]\(.+?\)/g, // Links [text](url)
    /!\[.+?\]\(.+?\)/g, // Images ![alt](url)
    /^\s*>\s+.+$/m    // Blockquotes > text
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}

/**
 * Parses markdown text and returns a formatted string
 * @param {string} text - Markdown text to parse
 * @return {string} - Text with simple formatting markers
 */
export function parseMarkdown(text) {
  if (!text) return '';
  
  // Just use our renderSimpleMarkdown function to do the parsing
  return renderSimpleMarkdown(text);
}

/**
 * Renders markdown text as a string with simple formatting
 * Uses styles that are more visually distinctive instead of markers
 * @param {string} text - Markdown text to render
 * @return {string} - Formatted text for QuickApp display
 */
export function renderSimpleMarkdown(text) {
  if (!text) return '';
  
  let result = text;
  
  // Process code blocks first (multi-line)
  result = result.replace(/```([\s\S]*?)```/g, function(match, codeContent) {
    return '\n\n' + codeContent.trim() + '\n\n';
  });
  
  // Process block elements
  const lines = result.split('\n');
  let inList = false;
  let listType = '';
  let formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Heading level 1
    if (/^# (.+)$/.test(line)) {
      line = line.replace(/^# (.+)$/, '$1');
      inList = false;
    } 
    // Heading level 2
    else if (/^## (.+)$/.test(line)) {
      line = line.replace(/^## (.+)$/, '$1');
      inList = false;
    } 
    // Heading level 3
    else if (/^### (.+)$/.test(line)) {
      line = line.replace(/^### (.+)$/, '$1');
      inList = false;
    }
    // Blockquotes
    else if (/^> (.+)$/.test(line)) {
      line = line.replace(/^> (.+)$/, '$1');
      inList = false;
    }
    // Unordered list
    else if (/^[\s-]*[-*+] (.+)$/.test(line)) {
      if (!inList || listType !== 'ul') {
        inList = true;
        listType = 'ul';
      }
      line = line.replace(/^[\s-]*[-*+] (.+)$/, '• $1');
    }
    // Ordered list
    else if (/^[\s-]*\d+\. (.+)$/.test(line)) {
      const num = line.match(/^[\s-]*(\d+)\./)[1];
      if (!inList || listType !== 'ol') {
        inList = true;
        listType = 'ol';
      }
      line = line.replace(/^[\s-]*\d+\. (.+)$/, num + '. $1');
    }
    
    formattedLines.push(line);
  }
  
  result = formattedLines.join('\n');
  
  // Process inline formatting
  
  // Bold (apply both ** and __ patterns)
  result = result.replace(/\*\*(.*?)\*\*/g, '*$1*');
  result = result.replace(/__(.*?)__/g, '*$1*');
  
  // Italic (apply both * and _ patterns) - we'll use an underscore instead
  result = result.replace(/\*([^*]+?)\*/g, '_$1_');
  result = result.replace(/_([^_]+?)_/g, '_$1_');
  
  // Inline code - we'll use quotes to make it stand out
  result = result.replace(/`(.*?)`/g, '"$1"');
  
  // Links - just show the text since QuickApp text components can't have clickable links
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
  
  return result;
}