/**
 * ActivityPub Learning Setup - ActivityPub Objects
 * 
 * Demonstrates different types of ActivityPub objects and activities.
 * Shows the structure and relationships between various ActivityPub components.
 */

const chalk = require('chalk');

/**
 * Example ActivityPub objects for learning purposes
 */
const ActivityPubExamples = {
  
  // Basic Note object (like a tweet/toot)
  note: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Note',
    id: 'https://mastodon.social/users/professor/statuses/123456',
    published: '2024-01-15T10:30:00Z',
    attributedTo: 'https://mastodon.social/users/professor',
    content: '<p>📹 New video uploaded: Introduction to ActivityPub! Check it out on our learning platform.</p>',
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: ['https://mastodon.social/users/professor/followers'],
    url: 'https://mastodon.social/@professor/123456',
    tag: [
      {
        type: 'Hashtag',
        href: 'https://mastodon.social/tags/activitypub',
        name: '#activitypub'
      },
      {
        type: 'Hashtag', 
        href: 'https://mastodon.social/tags/learning',
        name: '#learning'
      }
    ]
  },
  
  // Create activity (when someone posts)
  create: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Create',
    id: 'https://mastodon.social/users/professor/statuses/123456/activity',
    actor: 'https://mastodon.social/users/professor',
    published: '2024-01-15T10:30:00Z',
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: ['https://mastodon.social/users/professor/followers'],
    object: {
      type: 'Note',
      id: 'https://mastodon.social/users/professor/statuses/123456',
      published: '2024-01-15T10:30:00Z',
      attributedTo: 'https://mastodon.social/users/professor',
      content: '<p>📹 New video uploaded: Introduction to ActivityPub!</p>',
      to: ['https://www.w3.org/ns/activitystreams#Public'],
      cc: ['https://mastodon.social/users/professor/followers']
    }
  },
  
  // Follow activity
  follow: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Follow',
    id: 'https://mastodon.social/users/student/follows/456',
    actor: 'https://mastodon.social/users/student',
    object: 'https://mastodon.social/users/professor',
    published: '2024-01-15T11:00:00Z'
  },
  
  // Accept activity (accepting a follow request)
  accept: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Accept',
    id: 'https://mastodon.social/users/professor/accepts/789',
    actor: 'https://mastodon.social/users/professor',
    object: {
      type: 'Follow',
      id: 'https://mastodon.social/users/student/follows/456',
      actor: 'https://mastodon.social/users/student',
      object: 'https://mastodon.social/users/professor'
    },
    published: '2024-01-15T11:05:00Z'
  },
  
  // Like activity (favoriting a post)
  like: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Like',
    id: 'https://mastodon.social/users/student/likes/101112',
    actor: 'https://mastodon.social/users/student',
    object: 'https://mastodon.social/users/professor/statuses/123456',
    published: '2024-01-15T12:00:00Z'
  },
  
  // Announce activity (boosting/retweeting)
  announce: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Announce',
    id: 'https://mastodon.social/users/student/announces/131415',
    actor: 'https://mastodon.social/users/student',
    object: 'https://mastodon.social/users/professor/statuses/123456',
    published: '2024-01-15T12:30:00Z',
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: ['https://mastodon.social/users/student/followers']
  },
  
  // Delete activity
  delete: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Delete',
    id: 'https://mastodon.social/users/professor/deletes/161718',
    actor: 'https://mastodon.social/users/professor',
    object: 'https://mastodon.social/users/professor/statuses/123456',
    published: '2024-01-15T15:00:00Z'
  },
  
  // Actor object (user profile)
  actor: {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1'
    ],
    type: 'Person',
    id: 'https://mastodon.social/users/professor',
    preferredUsername: 'professor',
    name: 'Dr. ActivityPub',
    summary: '<p>Teaching distributed social networks and federated protocols. 🎓 #ActivityPub #Education</p>',
    url: 'https://mastodon.social/@professor',
    inbox: 'https://mastodon.social/users/professor/inbox',
    outbox: 'https://mastodon.social/users/professor/outbox',
    followers: 'https://mastodon.social/users/professor/followers',
    following: 'https://mastodon.social/users/professor/following',
    publicKey: {
      id: 'https://mastodon.social/users/professor#main-key',
      owner: 'https://mastodon.social/users/professor',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----'
    },
    icon: {
      type: 'Image',
      mediaType: 'image/png',
      url: 'https://mastodon.social/system/accounts/avatars/professor.png'
    }
  },
  
  // Collection object (for followers, following, etc.)
  collection: {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'OrderedCollection',
    id: 'https://mastodon.social/users/professor/followers',
    totalItems: 1337,
    first: 'https://mastodon.social/users/professor/followers?page=1',
    last: 'https://mastodon.social/users/professor/followers?page=45'
  }
};

/**
 * Analyze the structure of an ActivityPub object
 * @param {Object} obj - ActivityPub object to analyze
 * @param {string} title - Title for the analysis
 */
function analyzeObject(obj, title) {
  console.log(chalk.yellow(`\n🔍 ${title}:`));
  console.log(chalk.blue('='.repeat(50)));
  
  // Basic properties
  console.log(chalk.cyan(`Type: ${obj.type}`));
  console.log(chalk.cyan(`ID: ${obj.id}`));
  
  if (obj.actor) {
    console.log(chalk.cyan(`Actor: ${obj.actor}`));
  }
  
  if (obj.published) {
    console.log(chalk.cyan(`Published: ${new Date(obj.published).toLocaleString()}`));
  }
  
  // Object content
  if (obj.object) {
    if (typeof obj.object === 'string') {
      console.log(chalk.green(`Object (reference): ${obj.object}`));
    } else {
      console.log(chalk.green(`Object (embedded): ${obj.object.type} - ${obj.object.id}`));
    }
  }
  
  if (obj.content) {
    const content = obj.content.replace(/<[^>]*>/g, '');
    console.log(chalk.white(`Content: ${content}`));
  }
  
  // Addressing
  if (obj.to && obj.to.length > 0) {
    console.log(chalk.magenta(`To: ${obj.to.join(', ')}`));
  }
  
  if (obj.cc && obj.cc.length > 0) {
    console.log(chalk.magenta(`CC: ${obj.cc.join(', ')}`));
  }
  
  // Special properties
  if (obj.preferredUsername) {
    console.log(chalk.cyan(`Username: ${obj.preferredUsername}`));
  }
  
  if (obj.name) {
    console.log(chalk.cyan(`Name: ${obj.name}`));
  }
  
  if (obj.summary) {
    const summary = obj.summary.replace(/<[^>]*>/g, '');
    console.log(chalk.white(`Bio: ${summary}`));
  }
  
  if (obj.totalItems !== undefined) {
    console.log(chalk.green(`Total Items: ${obj.totalItems}`));
  }
  
  // JSON-LD context
  if (obj['@context']) {
    console.log(chalk.gray(`Context: ${Array.isArray(obj['@context']) ? obj['@context'].join(', ') : obj['@context']}`));
  }
  
  console.log(chalk.gray('\nFull JSON:'));
  console.log(JSON.stringify(obj, null, 2));
}

/**
 * Demonstrate ActivityPub object relationships
 */
function demonstrateObjectRelationships() {
  console.log(chalk.magenta('🔗 ActivityPub Object Relationships:'));
  console.log(chalk.white('Understanding how ActivityPub objects relate to each other:\n'));
  
  console.log(chalk.yellow('1. Actor creates a Note:'));
  console.log(chalk.white('   - Actor: Dr. ActivityPub (professor)'));
  console.log(chalk.white('   - Creates: Note about new video'));
  console.log(chalk.white('   - Wrapped in: Create activity'));
  
  console.log(chalk.yellow('\n2. Student follows Professor:'));
  console.log(chalk.white('   - Actor: Student'));
  console.log(chalk.white('   - Action: Follow activity'));
  console.log(chalk.white('   - Object: Professor\'s actor ID'));
  
  console.log(chalk.yellow('\n3. Professor accepts follow:'));
  console.log(chalk.white('   - Actor: Professor'));
  console.log(chalk.white('   - Action: Accept activity'));
  console.log(chalk.white('   - Object: Original Follow activity'));
  
  console.log(chalk.yellow('\n4. Student interacts with Note:'));
  console.log(chalk.white('   - Like activity: Student likes the Note'));
  console.log(chalk.white('   - Announce activity: Student boosts the Note'));
  
  console.log(chalk.yellow('\n5. Collections manage relationships:'));
  console.log(chalk.white('   - Followers collection: Who follows the Professor'));
  console.log(chalk.white('   - Following collection: Who the Professor follows'));
  console.log(chalk.white('   - Outbox collection: Professor\'s activities'));
}

/**
 * Simulate a university notification workflow
 */
function simulateUniversityWorkflow() {
  console.log(chalk.magenta('\n🎓 University Learning Platform Integration:'));
  console.log(chalk.blue('='.repeat(60)));
  
  console.log(chalk.yellow('Scenario: Professor uploads a new video'));
  console.log(chalk.white('1. Learning platform detects new video upload'));
  console.log(chalk.white('2. Platform creates ActivityPub Note about the video'));
  console.log(chalk.white('3. Platform sends Create activity to Professor\'s Mastodon instance'));
  console.log(chalk.white('4. Mastodon distributes to followers (students)'));
  console.log(chalk.white('5. Students receive notifications about new educational content\n'));
  
  // Show the actual objects that would be created
  const videoNote = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Note',
    id: 'https://learning-platform.uni.edu/videos/activitypub-intro/note',
    published: new Date().toISOString(),
    attributedTo: 'https://mastodon.social/users/professor',
    content: `<p>🎬 New video available: "Introduction to ActivityPub"</p>
              <p>📚 Course: Distributed Systems</p>
              <p>🔗 Watch: <a href="https://learning-platform.uni.edu/videos/activitypub-intro">learning-platform.uni.edu/videos/activitypub-intro</a></p>
              <p>#ActivityPub #DistributedSystems #UniversityEducation</p>`,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: ['https://mastodon.social/users/professor/followers'],
    tag: [
      { type: 'Hashtag', name: '#ActivityPub' },
      { type: 'Hashtag', name: '#DistributedSystems' },
      { type: 'Hashtag', name: '#UniversityEducation' }
    ]
  };
  
  console.log(chalk.cyan('Example Note that would be created:'));
  console.log(JSON.stringify(videoNote, null, 2));
}

/**
 * Run all object demonstrations
 */
function runObjectDemonstrations() {
  console.log(chalk.magenta('🚀 ActivityPub Objects Learning Module\n'));
  
  // Analyze each example object
  Object.entries(ActivityPubExamples).forEach(([key, obj]) => {
    const title = key.charAt(0).toUpperCase() + key.slice(1) + ' Object';
    analyzeObject(obj, title);
  });
  
  console.log('\n' + '='.repeat(80));
  demonstrateObjectRelationships();
  
  console.log('\n' + '='.repeat(80));
  simulateUniversityWorkflow();
}

// Educational information
function printObjectInfo() {
  console.log(chalk.cyan('📚 ActivityPub Objects and Activities:'));
  console.log(chalk.white('ActivityPub uses JSON-LD objects to represent content and actions.'));
  console.log(chalk.white('Key concepts:'));
  console.log(chalk.white('- Objects: Things like Notes, Images, Videos'));
  console.log(chalk.white('- Activities: Actions performed on objects (Create, Like, Follow)'));
  console.log(chalk.white('- Actors: Entities that perform activities'));
  console.log(chalk.white('- Collections: Groups of objects or activities\n'));
}

// Run if this file is executed directly
if (require.main === module) {
  printObjectInfo();
  runObjectDemonstrations();
}

module.exports = { ActivityPubExamples, analyzeObject, demonstrateObjectRelationships, simulateUniversityWorkflow };