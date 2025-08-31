/**
 * ActivityPub Learning Setup - Notification Simulation
 * 
 * Simulates the university use case: Professor uploads video -> Mastodon notification
 * This demonstrates how to integrate learning platforms with ActivityPub/Mastodon.
 */

const axios = require('axios');
const chalk = require('chalk');

/**
 * Simulate a learning platform detecting a new video upload
 * @param {Object} videoData - Information about the uploaded video
 * @returns {Object} Simulated webhook payload
 */
function simulateVideoUpload(videoData) {
  console.log(chalk.blue('📹 Simulating video upload to learning platform...'));
  
  const webhookPayload = {
    event: 'video.uploaded',
    timestamp: new Date().toISOString(),
    course: videoData.course,
    professor: videoData.professor,
    video: {
      id: videoData.id,
      title: videoData.title,
      description: videoData.description,
      duration: videoData.duration,
      url: videoData.url,
      thumbnail: videoData.thumbnail
    },
    enrolledStudents: videoData.enrolledStudents || []
  };
  
  console.log(chalk.green('✅ Video upload detected!'));
  console.log(chalk.yellow('📋 Webhook payload:'));
  console.log(JSON.stringify(webhookPayload, null, 2));
  
  return webhookPayload;
}

/**
 * Convert video upload to ActivityPub Note
 * @param {Object} webhookPayload - Video upload webhook data
 * @returns {Object} ActivityPub Note object
 */
function createActivityPubNote(webhookPayload) {
  console.log(chalk.blue('\n🔄 Converting to ActivityPub Note...'));
  
  const { video, course, professor } = webhookPayload;
  
  // Create hashtags from course name
  const courseHashtag = course.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  
  const note = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Note',
    id: `https://learning-platform.uni.edu/videos/${video.id}/activitypub`,
    published: webhookPayload.timestamp,
    attributedTo: `https://mastodon.social/users/${professor.mastodonHandle}`,
    content: `<p>🎬 <strong>New Video Available!</strong></p>
              <p>📚 <strong>Course:</strong> ${course.name}</p>
              <p>🎯 <strong>Title:</strong> ${video.title}</p>
              <p>📝 <strong>Description:</strong> ${video.description}</p>
              <p>⏱️ <strong>Duration:</strong> ${video.duration}</p>
              <p>🔗 <strong>Watch now:</strong> <a href="${video.url}">${video.url}</a></p>
              <p><a href="${video.thumbnail}">📸 Video Thumbnail</a></p>
              <p>#${courseHashtag} #UniversityLearning #NewContent</p>`,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`https://mastodon.social/users/${professor.mastodonHandle}/followers`],
    url: video.url,
    attachment: [
      {
        type: 'Document',
        mediaType: 'image/jpeg',
        url: video.thumbnail,
        name: `Thumbnail for ${video.title}`
      }
    ],
    tag: [
      {
        type: 'Hashtag',
        href: `https://mastodon.social/tags/${courseHashtag.toLowerCase()}`,
        name: `#${courseHashtag}`
      },
      {
        type: 'Hashtag',
        href: 'https://mastodon.social/tags/universitylearning',
        name: '#UniversityLearning'
      },
      {
        type: 'Hashtag',
        href: 'https://mastodon.social/tags/newcontent',
        name: '#NewContent'
      }
    ]
  };
  
  console.log(chalk.green('✅ ActivityPub Note created!'));
  console.log(chalk.yellow('📋 Note content:'));
  console.log(JSON.stringify(note, null, 2));
  
  return note;
}

/**
 * Create ActivityPub Create activity wrapping the Note
 * @param {Object} note - ActivityPub Note object
 * @param {string} professorId - Professor's ActivityPub actor ID
 * @returns {Object} ActivityPub Create activity
 */
function createActivityPubActivity(note, professorId) {
  console.log(chalk.blue('\n🎯 Creating ActivityPub Create activity...'));
  
  const createActivity = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Create',
    id: `${note.id}/activity`,
    actor: professorId,
    published: note.published,
    to: note.to,
    cc: note.cc,
    object: note
  };
  
  console.log(chalk.green('✅ Create activity generated!'));
  console.log(chalk.yellow('📋 Activity:'));
  console.log(JSON.stringify(createActivity, null, 2));
  
  return createActivity;
}

/**
 * Simulate sending the activity to Mastodon (educational purposes)
 * Note: This doesn't actually send to a real Mastodon instance
 * @param {Object} activity - ActivityPub Create activity
 * @param {string} mastodonInstance - Target Mastodon instance
 */
async function simulateMastodonDelivery(activity, mastodonInstance) {
  console.log(chalk.blue(`\n📤 Simulating delivery to ${mastodonInstance}...`));
  
  // In a real implementation, this would:
  // 1. Sign the HTTP request with the professor's private key
  // 2. POST to the professor's Mastodon inbox
  // 3. Mastodon would then distribute to followers
  
  const deliveryData = {
    method: 'POST',
    url: `https://${mastodonInstance}/users/${activity.actor.split('/').pop()}/inbox`,
    headers: {
      'Content-Type': 'application/activity+json',
      'Date': new Date().toUTCString(),
      'Host': mastodonInstance,
      'Signature': 'keyId="...",headers="...",signature="..."' // Simplified
    },
    body: activity
  };
  
  console.log(chalk.yellow('📋 Delivery simulation:'));
  console.log(chalk.white(`Target: ${deliveryData.url}`));
  console.log(chalk.white(`Method: ${deliveryData.method}`));
  console.log(chalk.white(`Content-Type: ${deliveryData.headers['Content-Type']}`));
  console.log(chalk.gray('📝 Note: In production, this requires proper HTTP signatures'));
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(chalk.green('✅ Delivery simulation complete!'));
  console.log(chalk.cyan('📢 Students would now see the notification in their Mastodon feeds'));
}

/**
 * Simulate student reactions to the notification
 * @param {Object} originalNote - The original Note object
 */
function simulateStudentReactions(originalNote) {
  console.log(chalk.blue('\n👥 Simulating student reactions...'));
  
  const students = [
    { name: 'Alice', handle: 'alice_cs' },
    { name: 'Bob', handle: 'bob_student' },
    { name: 'Carol', handle: 'carol_learns' }
  ];
  
  students.forEach((student, index) => {
    setTimeout(() => {
      const reactions = ['Like', 'Announce', 'Create']; // Like, Boost, Reply
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      
      console.log(chalk.green(`💬 ${student.name} (@${student.handle}) ${reaction}d the video notification`));
      
      if (reaction === 'Create') {
        console.log(chalk.gray(`   "Thanks for the new video! Looking forward to watching it 📚"`));
      }
    }, (index + 1) * 500);
  });
}

/**
 * Complete workflow simulation
 */
async function runCompleteWorkflow() {
  console.log(chalk.magenta('🚀 University Learning Platform + ActivityPub Integration Simulation'));
  console.log(chalk.blue('='.repeat(80)));
  
  // Step 1: Simulate video upload
  const videoData = {
    id: 'activitypub-intro-2024',
    title: 'Introduction to ActivityPub Protocol',
    description: 'Learn the basics of decentralized social networking with ActivityPub',
    duration: '15:42',
    url: 'https://learning-platform.uni.edu/courses/distributed-systems/videos/activitypub-intro',
    thumbnail: 'https://learning-platform.uni.edu/thumbnails/activitypub-intro.jpg',
    course: {
      id: 'CS-480',
      name: 'Distributed Systems'
    },
    professor: {
      id: 'prof-smith',
      name: 'Dr. Sarah Smith',
      mastodonHandle: 'dr_smith'
    },
    enrolledStudents: ['alice_cs', 'bob_student', 'carol_learns']
  };
  
  const webhookPayload = simulateVideoUpload(videoData);
  
  // Step 2: Convert to ActivityPub
  const note = createActivityPubNote(webhookPayload);
  
  // Step 3: Wrap in Create activity
  const professorActorId = `https://mastodon.social/users/${videoData.professor.mastodonHandle}`;
  const createActivity = createActivityPubActivity(note, professorActorId);
  
  // Step 4: Simulate delivery to Mastodon
  await simulateMastodonDelivery(createActivity, 'mastodon.social');
  
  // Step 5: Simulate student reactions
  simulateStudentReactions(note);
  
  // Educational summary
  console.log(chalk.magenta('\n📚 What happened in this simulation:'));
  console.log(chalk.white('1. Learning platform detected new video upload'));
  console.log(chalk.white('2. System converted video metadata to ActivityPub Note'));
  console.log(chalk.white('3. Note was wrapped in a Create activity'));
  console.log(chalk.white('4. Activity was "sent" to professor\'s Mastodon instance'));
  console.log(chalk.white('5. Mastodon would distribute to all student followers'));
  console.log(chalk.white('6. Students receive real-time notifications about new content'));
  
  console.log(chalk.cyan('\n🔧 Implementation requirements:'));
  console.log(chalk.white('- Learning platform needs ActivityPub client library'));
  console.log(chalk.white('- Professor needs Mastodon account linked to platform'));
  console.log(chalk.white('- HTTP signature verification for security'));
  console.log(chalk.white('- Students follow professor\'s Mastodon account'));
}

/**
 * Show integration architecture
 */
function showIntegrationArchitecture() {
  console.log(chalk.magenta('\n🏗️ Integration Architecture:'));
  console.log(chalk.blue('='.repeat(50)));
  
  console.log(chalk.yellow('Learning Platform Components:'));
  console.log(chalk.white('├── 📹 Video Upload Service'));
  console.log(chalk.white('├── 🔗 ActivityPub Client'));
  console.log(chalk.white('├── 🔐 HTTP Signature Service'));
  console.log(chalk.white('└── 📊 Notification Analytics'));
  
  console.log(chalk.yellow('\nMastodon Integration:'));
  console.log(chalk.white('├── 👤 Professor\'s Mastodon Account'));
  console.log(chalk.white('├── 📥 ActivityPub Inbox'));
  console.log(chalk.white('├── 📤 Federation to Student Instances'));
  console.log(chalk.white('└── 📱 Student Mobile/Web Clients'));
  
  console.log(chalk.yellow('\nData Flow:'));
  console.log(chalk.white('1. Video Upload → Webhook → ActivityPub Note'));
  console.log(chalk.white('2. Note → Create Activity → HTTP Signature'));
  console.log(chalk.white('3. Signed Activity → Mastodon Inbox'));
  console.log(chalk.white('4. Mastodon → Student Followers → Notifications'));
}

// Educational information
function printNotificationInfo() {
  console.log(chalk.cyan('📚 ActivityPub Notifications in Education:'));
  console.log(chalk.white('ActivityPub enables real-time educational content distribution.'));
  console.log(chalk.white('Benefits:'));
  console.log(chalk.white('- Decentralized: Students use any ActivityPub client'));
  console.log(chalk.white('- Real-time: Immediate notifications for new content'));
  console.log(chalk.white('- Interactive: Students can like, boost, and reply'));
  console.log(chalk.white('- Federated: Works across different university instances\n'));
}

// Run if this file is executed directly
if (require.main === module) {
  printNotificationInfo();
  runCompleteWorkflow().then(() => {
    showIntegrationArchitecture();
  }).catch(console.error);
}

module.exports = { 
  simulateVideoUpload, 
  createActivityPubNote, 
  createActivityPubActivity, 
  simulateMastodonDelivery,
  simulateStudentReactions
};