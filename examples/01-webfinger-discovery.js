/**
 * ActivityPub Learning Setup - WebFinger Discovery
 * 
 * WebFinger is used to discover ActivityPub actors from their handle (e.g., @user@instance.com)
 * This is the first step in ActivityPub communication.
 */

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const MASTODON_INSTANCES = [
  'mastodon.social',
  'mastodon.world',
  'fosstodon.org',
  'mstdn.social'
];

/**
 * Discover ActivityPub actor using WebFinger
 * @param {string} handle - ActivityPub handle (e.g., "username@instance.com")
 * @returns {Promise<Object>} WebFinger response
 */
async function discoverActor(handle) {
  console.log(chalk.blue(`🔍 Discovering actor: ${handle}`));
  
  // Parse handle
  const [username, domain] = handle.split('@');
  if (!username || !domain) {
    throw new Error('Invalid handle format. Use: username@domain.com');
  }

  // Construct WebFinger URL
  const webfingerUrl = `https://${domain}/.well-known/webfinger?resource=acct:${handle}`;
  
  try {
    console.log(chalk.gray(`📡 Making request to: ${webfingerUrl}`));
    
    const response = await axios.get(webfingerUrl, {
      headers: {
        'Accept': 'application/jrd+json',
        'User-Agent': 'ActivityPub-Learning-Setup/1.0'
      },
      timeout: 10000
    });

    console.log(chalk.green('✅ WebFinger discovery successful!'));
    console.log(chalk.yellow('📋 Response data:'));
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract ActivityPub actor URL
    const actorUrl = response.data.links?.find(
      link => link.type === 'application/activity+json'
    )?.href;
    
    if (actorUrl) {
      console.log(chalk.cyan(`🎭 Actor URL found: ${actorUrl}`));
    }
    
    return {
      handle,
      webfingerData: response.data,
      actorUrl
    };
    
  } catch (error) {
    console.error(chalk.red(`❌ WebFinger discovery failed for ${handle}:`));
    console.error(chalk.red(error.message));
    
    if (error.response) {
      console.error(chalk.red(`Status: ${error.response.status}`));
      console.error(chalk.red(`Response: ${JSON.stringify(error.response.data, null, 2)}`));
    }
    
    throw error;
  }
}

/**
 * Test WebFinger discovery with multiple examples
 */
async function runWebFingerTests() {
  console.log(chalk.magenta('🚀 Starting WebFinger Discovery Tests\n'));
  
  // Test accounts (using public figures who likely have ActivityPub accounts)
  const testAccounts = [
    'Gargron@mastodon.social',  // Mastodon creator
    'dansup@pixelfed.social',   // Pixelfed creator
  ];
  
  for (const account of testAccounts) {
    try {
      console.log(chalk.blue('='.repeat(50)));
      await discoverActor(account);
      console.log('\n');
    } catch (error) {
      console.log(chalk.red(`Skipping ${account} due to error\n`));
    }
  }
  
  // Interactive mode - let user test their own handle
  console.log(chalk.magenta('💡 To test your own handle, modify the testAccounts array in this file.'));
  console.log(chalk.gray('Example: Add your Mastodon handle like "yourname@mastodon.social"'));
}

// Educational information
function printWebFingerInfo() {
  console.log(chalk.cyan('📚 WebFinger in ActivityPub:'));
  console.log(chalk.white('WebFinger (RFC 7033) is used to discover information about ActivityPub actors.'));
  console.log(chalk.white('Key concepts:'));
  console.log(chalk.white('- Maps human-readable identifiers to machine-readable resources'));
  console.log(chalk.white('- Returns JSON Resource Descriptor (JRD) with links'));
  console.log(chalk.white('- ActivityPub actors are found via "application/activity+json" link type'));
  console.log(chalk.white('- Used for federation between different ActivityPub instances\n'));
}

// Run if this file is executed directly
if (require.main === module) {
  printWebFingerInfo();
  runWebFingerTests().catch(console.error);
}

module.exports = { discoverActor };