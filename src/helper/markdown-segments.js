/**
 * Enhanced Markdown Utility Functions
 * Provides advanced markdown processing capabilities for QuickApp
 */

import { renderSimpleMarkdown } from './util/markdown-utils';

/**
 * Parse formatted text with markers into segments with styles
 * @param {string} text - Text containing markdown format markers
 * @return {Array} - Array of segments with style information
 */
export function parseFormattedText(text) {
  if (!text) {
    return [];
  }
  
  const segments = [];
  
  // Define patterns for all our markers
  const patterns = [
    { 
      regex: /【粗体】(.*?)【粗体结束】/g, 
      style: 'text-bold',
      startMarker: '【粗体】',
      endMarker: '【粗体结束】'
    },
    { 
      regex: /【斜体】(.*?)【斜体结束】/g, 
      style: 'text-italic',
      startMarker: '【斜体】',
      endMarker: '【斜体结束】'
    },
    { 
      regex: /【代码】(.*?)【代码结束】/g, 
      style: 'text-code',
      startMarker: '【代码】',
      endMarker: '【代码结束】'
    },
    { 
      regex: /【代码块】([\s\S]*?)【代码块结束】/g, 
      style: 'text-code-block',
      startMarker: '【代码块】',
      endMarker: '【代码块结束】'
    },
    { 
      regex: /【标题1】(.*?)【标题结束】/g, 
      style: 'text-h1',
      startMarker: '【标题1】',
      endMarker: '【标题结束】'
    },
    { 
      regex: /【标题2】(.*?)【标题结束】/g, 
      style: 'text-h2',
      startMarker: '【标题2】',
      endMarker: '【标题结束】'
    },
    { 
      regex: /【标题3】(.*?)【标题结束】/g, 
      style: 'text-h3',
      startMarker: '【标题3】',
      endMarker: '【标题结束】'
    },
    { 
      regex: /【引用】(.*?)【引用结束】/g, 
      style: 'text-quote',
      startMarker: '【引用】',
      endMarker: '【引用结束】'
    }
  ];
  
  // We'll rebuild the text, processing each marker in order
  const positions = [];
  
  // Find all markers in the text and their positions
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;
      const content = match[1];
      
      positions.push({
        index: startIndex,
        isStart: true,
        marker: pattern.startMarker,
        style: pattern.style,
        length: pattern.startMarker.length
      });
      
      positions.push({
        index: endIndex - pattern.endMarker.length,
        isStart: false,
        marker: pattern.endMarker,
        style: pattern.style,
        length: pattern.endMarker.length
      });
    }
  });
  
  // Sort positions by index
  positions.sort((a, b) => a.index - b.index);
  
  // If no markers were found, return the whole text as a single segment
  if (positions.length === 0) {
    return [{ text: text, style: 'text-normal' }];
  }
  
  // Process the text by iterating through the positions
  let lastIndex = 0;
  let currentStyles = [];
  
  // Handle text before first marker
  if (positions[0].index > 0) {
    segments.push({
      text: text.substring(0, positions[0].index),
      style: 'text-normal'
    });
  }
  
  // Process each position
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    
    // If there's a gap between the last marker and this one, add that text
    if (pos.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, pos.index),
        style: currentStyles.length > 0 ? currentStyles.join(' ') : 'text-normal'
      });
    }
    
    // Update styles based on marker type
    if (pos.isStart) {
      currentStyles.push(pos.style);
      lastIndex = pos.index + pos.length;
    } else {
      // Find and remove the matching style
      const styleIndex = currentStyles.indexOf(pos.style);
      if (styleIndex !== -1) {
        currentStyles.splice(styleIndex, 1);
      }
      lastIndex = pos.index + pos.length;
    }
    
    // If this is the last marker or there's text between this and next marker
    if (i === positions.length - 1 || positions[i+1].index > lastIndex) {
      const nextPos = i < positions.length - 1 ? positions[i+1].index : text.length;
      if (nextPos > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, nextPos),
          style: currentStyles.length > 0 ? currentStyles.join(' ') : 'text-normal'
        });
        lastIndex = nextPos;
      }
    }
  }
  
  // Add any remaining text after the last marker
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      style: currentStyles.length > 0 ? currentStyles.join(' ') : 'text-normal'
    });
  }
  
  return segments;
}

/**
 * Process markdown content into segments for display
 * @param {string} content - Original markdown content
 * @return {Array} - Array of text segments with style information
 */
export function getMarkdownSegments(content) {
  if (!content) {
    return [];
  }
  
  // First, convert markdown to our special format with markers
  const formattedText = renderSimpleMarkdown(content);
  
  // Then parse the formatted text into segments
  return parseFormattedText(formattedText);
}
