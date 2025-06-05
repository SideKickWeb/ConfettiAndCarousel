import { defineEventHandler } from 'h3'
import prisma from '../utils/prisma'

// Instagram API configuration
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID

// Helper function to sanitize caption text and handle emojis properly
const sanitizeText = (text: string | null): string => {
  if (!text) return '';
  
  // Simple cleanup without complex regex to ensure maximum compatibility
  return text
    // Remove escaped unicode sequences
    .replace(/\\u[\dA-F]{4}/gi, '')
    // Remove null characters and control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Trim extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

// Process captions to extract meaningful title
const processCaption = (text: string | null): { title: string, description: string } => {
  if (!text) return { title: 'Instagram Post', description: '' };
  
  const sanitized = sanitizeText(text);
  
  // Get the first sentence or first 60 characters for title
  let title = '';
  let description = sanitized;
  
  // Try to get first sentence (ends with period, exclamation, or question mark)
  const sentenceMatch = sanitized.match(/^[^.!?]*[.!?]/);
  if (sentenceMatch && sentenceMatch[0]) {
    title = sentenceMatch[0].trim();
  } else {
    // If no sentence ending found, use first line or first 60 chars
    const firstLine = sanitized.split('\n')[0];
    title = firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
  }
  
  return { title, description };
};

export default defineEventHandler(async (event) => {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      throw new Error('Instagram credentials not configured')
    }

    // Dynamic Prisma import

    let allPosts: any[] = [];
    let nextPageUrl = `https://graph.instagram.com/v12.0/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=25`;

    // Fetch all available posts using pagination
    while (nextPageUrl) {
      const response = await fetch(nextPageUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram data');
      }

      const data = await response.json();
      allPosts = [...allPosts, ...data.data];
      
      // Check if there are more pages
      nextPageUrl = data.paging?.next || null;
    }

    // Transform Instagram data to match our gallery format
    const galleryItems = allPosts
      .filter((item: any) => item.media_type === 'IMAGE')
      .map((item: any) => {
        const { title, description } = processCaption(item.caption);
        
        return {
          id: item.id,
          title: title,
          description: description,
          image: item.media_url,
          link: item.permalink,
          timestamp: item.timestamp,
          username: item.username
        };
      })
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first

    return {
      success: true,
      data: galleryItems
    }
  } catch (error) {
    console.error('Instagram API Error:', error)
    return {
      success: false,
      error: 'Failed to fetch Instagram posts'
    }
  }
}) 