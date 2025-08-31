/**
 * ActivityPub Learning Setup - Public Timeline
 * 
 * Demonstrates how to fetch and parse public timeline data from Mastodon instances.
 * This shows ActivityPub Note objects in action.
 */

const axios = require('axios');
const chalk = require('chalk');

/**
 * Fetch public timeline from a Mastodon instance
 * @param {string} instance - Mastodon instance domain
 * @param {number} limit - Number of posts to fetch (default: 5)
 * @returns {Promise<Array>} Array of ActivityPub Note objects
 */
async function fetchPublicTimeline(instance, limit = 5) {
  console.log(chalk.blue(`📰 Fetching public timeline from: ${instance}`));
  
  const timelineUrl = `https://${instance}/api/v1/timelines/public`;
  
  try {
    const response = await axios.get(timelineUrl, {
      params: {
        limit: limit,
        local: false // Include federated content
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ActivityPub-Learning-Setup/1.0'
      },
      timeout: 10000
    });

    console.log(chalk.green(`✅ Successfully fetched ${response.data.length} posts`));
    return response.data;
    
  } catch (error) {
    console.error(chalk.red(`❌ Failed to fetch timeline from ${instance}:`));
    console.error(chalk.red(error.message));
    throw error;
  }
}

/**
 * Parse and display ActivityPub Note information
 * @param {Object} post - Mastodon post object
 * @param {number} index - Post index for display
 */
function analyzePost(post, index) {
  console.log(chalk.yellow(`\n📝 Post #${index + 1}:`));
  console.log(chalk.cyan(`ID: ${post.id}`));
  console.log(chalk.cyan(`Author: @${post.account.username}@${new URL(post.account.url).hostname}`));
  console.log(chalk.cyan(`Created: ${new Date(post.created_at).toLocaleString()}`));
  console.log(chalk.cyan(`Visibility: ${post.visibility}`));
  console.log(chalk.cyan(`Language: ${post.language || 'unknown'}`));
  
  // Content (strip HTML for readability)
  const content = post.content.replace(/<[^>]*>/g, '').trim();
  const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;
  console.log(chalk.white(`Content: ${preview}`));
  
  // Engagement metrics
  console.log(chalk.green(`💬 Replies: ${post.replies_count} | 🔄 Boosts: ${post.reblogs_count} | ⭐ Favorites: ${post.favourites_count}`));
  
  // Media attachments
  if (post.media_attachments.length > 0) {
    console.log(chalk.magenta(`📎 Attachments: ${post.media_attachments.length}`));
    post.media_attachments.forEach((attachment, i) => {
      console.log(chalk.gray(`  ${i + 1}. ${attachment.type}: ${attachment.url}`));
    });
  }
  
  // ActivityPub specific fields
  console.log(chalk.blue(`🔗 ActivityPub URL: ${post.url}`));
  console.log(chalk.blue(`🌐 ActivityPub URI: ${post.uri}`));
}

/**
 * Convert Mastodon API response to ActivityPub Note format
 * @param {Object} post - Mastodon post object
 * @returns {Object} ActivityPub Note object
 */
function convertToActivityPubNote(post) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Note',
    id: post.uri,
    published: post.created_at,
    attributedTo: post.account.url,
    content: post.content,
    to: post.visibility === 'public' ? ['https://www.w3.org/ns/activitystreams#Public'] : [],
    cc: post.visibility === 'unlisted' ? ['https://www.w3.org/ns/activitystreams#Public'] : [],
    url: post.url,
    replies: {
      type: 'Collection',
      totalItems: post.replies_count
    },
    likes: {
      type: 'Collection', 
      totalItems: post.favourites_count
    },
    shares: {
      type: 'Collection',
      totalItems: post.reblogs_count
    },
    attachment: post.media_attachments.map(media => ({
      type: 'Document',
      mediaType: media.type === 'image' ? 'image/*' : 'unknown',
      url: media.url
    }))
  };
}

/**
 * Run public timeline analysis
 */
async function runTimelineAnalysis() {
  console.log(chalk.magenta('🚀 Starting Public Timeline Analysis\n'));
  
  const instances = ['mastodon.social', 'fosstodon.org'];
  
  for (const instance of instances) {
    try {
      console.log(chalk.blue('='.repeat(60)));
      
      const posts = await fetchPublicTimeline(instance, 3);
      
      console.log(chalk.yellow(`\n📊 Analyzing posts from ${instance}:`));
      
      posts.forEach((post, index) => {
        analyzePost(post, index);
      });
      
      // Show ActivityPub conversion example
      if (posts.length > 0) {
        console.log(chalk.magenta('\n🔄 Example ActivityPub Note conversion:'));
        const activityPubNote = convertToActivityPubNote(posts[0]);
        console.log(JSON.stringify(activityPubNote, null, 2));
      }
      
      console.log('\n');
      
    } catch (error) {
      console.log(chalk.red(`Skipping ${instance} due to error\n`));
    }
  }
}

// Educational information
function printTimelineInfo() {
  console.log(chalk.cyan('📚 ActivityPub Notes and Timelines:'));
  console.log(chalk.white('ActivityPub Note objects represent text-based content (posts, messages).'));
  console.log(chalk.white('Key concepts:'));
  console.log(chalk.white('- Notes are the most common ActivityPub object type'));
  console.log(chalk.white('- They contain content, attribution, and addressing information'));
  console.log(chalk.white('- Mastodon API responses can be mapped to ActivityPub objects'));
  console.log(chalk.white('- Public timelines show federated content from multiple instances\n'));
}

// Run if this file is executed directly
if (require.main === module) {
  printTimelineInfo();
  runTimelineAnalysis().catch(console.error);
}

module.exports = { fetchPublicTimeline, analyzePost, convertToActivityPubNote };