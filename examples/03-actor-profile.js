/**
 * ActivityPub Learning Setup - Actor Profiles
 * 
 * Demonstrates how to fetch and analyze ActivityPub Actor objects.
 * Actors represent users, bots, or services in the ActivityPub network.
 */

const axios = require('axios');
const chalk = require('chalk');
const { discoverActor } = require('./01-webfinger-discovery');

/**
 * Fetch ActivityPub Actor object
 * @param {string} actorUrl - Direct URL to the ActivityPub actor
 * @returns {Promise<Object>} ActivityPub Actor object
 */
async function fetchActor(actorUrl) {
  console.log(chalk.blue(`🎭 Fetching ActivityPub actor: ${actorUrl}`));
  
  try {
    const response = await axios.get(actorUrl, {
      headers: {
        'Accept': 'application/activity+json, application/ld+json',
        'User-Agent': 'ActivityPub-Learning-Setup/1.0'
      },
      timeout: 10000
    });

    console.log(chalk.green('✅ Successfully fetched actor data'));
    return response.data;
    
  } catch (error) {
    console.error(chalk.red(`❌ Failed to fetch actor from ${actorUrl}:`));
    console.error(chalk.red(error.message));
    throw error;
  }
}

/**
 * Analyze and display ActivityPub Actor information
 * @param {Object} actor - ActivityPub Actor object
 */
function analyzeActor(actor) {
  console.log(chalk.yellow('\n🔍 ActivityPub Actor Analysis:'));
  console.log(chalk.cyan(`Type: ${actor.type}`));
  console.log(chalk.cyan(`ID: ${actor.id}`));
  console.log(chalk.cyan(`Name: ${actor.name || 'Not specified'}`));
  console.log(chalk.cyan(`Preferred Username: ${actor.preferredUsername}`));
  console.log(chalk.cyan(`Summary: ${actor.summary ? actor.summary.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'No bio'}`));
  
  // URLs and endpoints
  console.log(chalk.blue('\n🔗 URLs and Endpoints:'));
  console.log(chalk.white(`Profile URL: ${actor.url}`));
  
  if (actor.inbox) {
    console.log(chalk.white(`Inbox: ${actor.inbox}`));
  }
  
  if (actor.outbox) {
    console.log(chalk.white(`Outbox: ${actor.outbox}`));
  }
  
  if (actor.followers) {
    console.log(chalk.white(`Followers Collection: ${actor.followers}`));
  }
  
  if (actor.following) {
    console.log(chalk.white(`Following Collection: ${actor.following}`));
  }
  
  // Public key information (for verification)
  if (actor.publicKey) {
    console.log(chalk.green('\n🔐 Public Key Information:'));
    console.log(chalk.white(`Key ID: ${actor.publicKey.id}`));
    console.log(chalk.white(`Owner: ${actor.publicKey.owner}`));
    console.log(chalk.gray(`Key: ${actor.publicKey.publicKeyPem.substring(0, 50)}...`));
  }
  
  // Icon and images
  if (actor.icon) {
    console.log(chalk.magenta('\n🖼️ Avatar:'));
    console.log(chalk.white(`Type: ${actor.icon.type}`));
    console.log(chalk.white(`URL: ${actor.icon.url}`));
  }
  
  if (actor.image) {
    console.log(chalk.magenta('🎨 Header Image:'));
    console.log(chalk.white(`Type: ${actor.image.type}`));
    console.log(chalk.white(`URL: ${actor.image.url}`));
  }
  
  // Additional properties
  console.log(chalk.yellow('\n📋 Additional Properties:'));
  
  if (actor.discoverable !== undefined) {
    console.log(chalk.white(`Discoverable: ${actor.discoverable}`));
  }
  
  if (actor.manuallyApprovesFollowers !== undefined) {
    console.log(chalk.white(`Manually Approves Followers: ${actor.manuallyApprovesFollowers}`));
  }
  
  if (actor.attachment && actor.attachment.length > 0) {
    console.log(chalk.white('Profile Fields:'));
    actor.attachment.forEach((field, index) => {
      const name = field.name || `Field ${index + 1}`;
      const value = field.value ? field.value.replace(/<[^>]*>/g, '') : 'No value';
      console.log(chalk.gray(`  ${name}: ${value}`));
    });
  }
}

/**
 * Fetch actor's outbox to see their recent activities
 * @param {string} outboxUrl - URL to the actor's outbox
 * @param {number} limit - Number of activities to fetch
 */
async function fetchActorOutbox(outboxUrl, limit = 5) {
  if (!outboxUrl) {
    console.log(chalk.yellow('⚠️ No outbox URL available'));
    return;
  }
  
  console.log(chalk.blue(`📤 Fetching actor's outbox: ${outboxUrl}`));
  
  try {
    const response = await axios.get(outboxUrl, {
      headers: {
        'Accept': 'application/activity+json, application/ld+json',
        'User-Agent': 'ActivityPub-Learning-Setup/1.0'
      },
      timeout: 10000
    });
    
    const outbox = response.data;
    console.log(chalk.green(`✅ Outbox fetched - Total items: ${outbox.totalItems || 'unknown'}`));
    
    if (outbox.first) {
      console.log(chalk.blue(`📄 First page: ${outbox.first}`));
      
      // Fetch first page of activities
      try {
        const firstPageResponse = await axios.get(outbox.first, {
          headers: {
            'Accept': 'application/activity+json, application/ld+json',
            'User-Agent': 'ActivityPub-Learning-Setup/1.0'
          },
          timeout: 10000
        });
        
        const activities = firstPageResponse.data.orderedItems || firstPageResponse.data.items || [];
        console.log(chalk.yellow(`\n🎯 Recent Activities (showing ${Math.min(limit, activities.length)}):`));
        
        activities.slice(0, limit).forEach((activity, index) => {
          console.log(chalk.cyan(`\n${index + 1}. Activity Type: ${activity.type}`));
          console.log(chalk.white(`   Published: ${activity.published}`));
          if (activity.object && activity.object.type) {
            console.log(chalk.white(`   Object Type: ${activity.object.type}`));
            if (activity.object.content) {
              const content = activity.object.content.replace(/<[^>]*>/g, '').substring(0, 80);
              console.log(chalk.gray(`   Content: ${content}...`));
            }
          }
        });
        
      } catch (error) {
        console.log(chalk.red('❌ Could not fetch outbox activities'));
      }
    }
    
  } catch (error) {
    console.error(chalk.red(`❌ Failed to fetch outbox: ${error.message}`));
  }
}

/**
 * Complete actor analysis workflow
 * @param {string} handle - ActivityPub handle (e.g., "username@instance.com")
 */
async function analyzeActorComplete(handle) {
  try {
    console.log(chalk.magenta(`🚀 Complete Actor Analysis for: ${handle}`));
    console.log(chalk.blue('='.repeat(60)));
    
    // Step 1: WebFinger discovery
    const discovery = await discoverActor(handle);
    
    if (!discovery.actorUrl) {
      console.log(chalk.red('❌ No ActivityPub actor URL found in WebFinger response'));
      return;
    }
    
    // Step 2: Fetch actor object
    const actor = await fetchActor(discovery.actorUrl);
    
    // Step 3: Analyze actor
    analyzeActor(actor);
    
    // Step 4: Fetch recent activities
    await fetchActorOutbox(actor.outbox, 3);
    
  } catch (error) {
    console.error(chalk.red(`❌ Actor analysis failed: ${error.message}`));
  }
}

/**
 * Run actor profile tests
 */
async function runActorTests() {
  console.log(chalk.magenta('🚀 Starting ActivityPub Actor Analysis\n'));
  
  const testAccounts = [
    'Gargron@mastodon.social',
  ];
  
  for (const account of testAccounts) {
    await analyzeActorComplete(account);
    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// Educational information
function printActorInfo() {
  console.log(chalk.cyan('📚 ActivityPub Actors:'));
  console.log(chalk.white('Actors represent entities (users, bots, services) in ActivityPub.'));
  console.log(chalk.white('Key concepts:'));
  console.log(chalk.white('- Actors have unique IDs and can send/receive activities'));
  console.log(chalk.white('- They have inboxes (receive) and outboxes (send) for activities'));
  console.log(chalk.white('- Public keys enable cryptographic verification'));
  console.log(chalk.white('- Followers/Following collections manage social relationships\n'));
}

// Run if this file is executed directly
if (require.main === module) {
  printActorInfo();
  runActorTests().catch(console.error);
}

module.exports = { fetchActor, analyzeActor, fetchActorOutbox, analyzeActorComplete };