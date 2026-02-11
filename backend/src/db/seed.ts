/**
 * Database Seed Script
 * 
 * This script populates the database with sample data for demonstration purposes.
 * It creates 5 technology roles with 3+ learning resources each.
 * 
 * Run this script with: npm run seed
 */

import { pool, testConnection, closePool } from './config';

/**
 * Sample roles data
 * Each role includes name, descriptions, responsibilities, and skills
 */
const SAMPLE_ROLES = [
  {
    name: 'Software Engineer',
    short_description: 'Design, develop, and maintain software applications and systems.',
    long_description: 'Software Engineers are the architects of the digital world. They write code to create applications, websites, and systems that solve real-world problems. This role involves designing software solutions, writing clean and efficient code, debugging issues, and collaborating with teams to bring ideas to life.',
    responsibilities: [
      'Write clean, maintainable code in various programming languages',
      'Design and implement software features and functionality',
      'Debug and fix software issues',
      'Collaborate with product managers and designers',
      'Participate in code reviews and testing',
      'Document code and technical processes'
    ],
    skills: [
      'Programming languages (Python, JavaScript, Java, etc.)',
      'Problem-solving and algorithmic thinking',
      'Version control (Git)',
      'Software design patterns',
      'Testing and debugging',
      'Communication and teamwork'
    ]
  },
  {
    name: 'QA Engineer',
    short_description: 'Ensure software quality through testing and quality assurance processes.',
    long_description: 'Quality Assurance Engineers are the guardians of software quality. They design and execute tests to find bugs before users do, ensuring that applications work correctly and provide a great user experience. QA Engineers think critically about how software might fail and create comprehensive test plans to catch issues early.',
    responsibilities: [
      'Design and execute test plans and test cases',
      'Identify, document, and track software defects',
      'Perform manual and automated testing',
      'Verify bug fixes and feature implementations',
      'Collaborate with developers to improve quality',
      'Maintain testing documentation and reports'
    ],
    skills: [
      'Testing methodologies and best practices',
      'Test automation tools (Selenium, Cypress)',
      'Attention to detail',
      'Analytical thinking',
      'Bug tracking systems (Jira)',
      'Basic programming knowledge'
    ]
  },
  {
    name: 'Data Scientist',
    short_description: 'Analyze complex data to extract insights and build predictive models.',
    long_description: 'Data Scientists are modern-day detectives who uncover patterns and insights hidden in data. They use statistics, machine learning, and programming to analyze large datasets, build predictive models, and help organizations make data-driven decisions. This role combines mathematics, programming, and business understanding.',
    responsibilities: [
      'Collect, clean, and analyze large datasets',
      'Build and train machine learning models',
      'Create data visualizations and reports',
      'Communicate findings to stakeholders',
      'Develop data pipelines and workflows',
      'Stay current with ML/AI advancements'
    ],
    skills: [
      'Python and data science libraries (pandas, scikit-learn)',
      'Statistics and probability',
      'Machine learning algorithms',
      'Data visualization (Matplotlib, Tableau)',
      'SQL and database querying',
      'Critical thinking and communication'
    ]
  },
  {
    name: 'UX/UI Designer',
    short_description: 'Create intuitive and visually appealing user interfaces and experiences.',
    long_description: 'UX/UI Designers are the artists and psychologists of the tech world. They research how users interact with products, design intuitive interfaces, and create beautiful visual designs that make technology accessible and enjoyable. This role requires both creative and analytical thinking to balance aesthetics with usability.',
    responsibilities: [
      'Conduct user research and usability testing',
      'Create wireframes, mockups, and prototypes',
      'Design user interfaces and visual elements',
      'Develop design systems and style guides',
      'Collaborate with developers and product teams',
      'Iterate designs based on user feedback'
    ],
    skills: [
      'Design tools (Figma, Sketch, Adobe XD)',
      'User research methodologies',
      'Visual design principles',
      'Prototyping and wireframing',
      'HTML/CSS basics',
      'Empathy and user-centered thinking'
    ]
  },
  {
    name: 'DevOps Engineer',
    short_description: 'Automate and optimize software deployment and infrastructure management.',
    long_description: 'DevOps Engineers are the bridge between development and operations. They automate deployment processes, manage cloud infrastructure, and ensure that applications run reliably and efficiently in production. This role combines software development skills with system administration knowledge to create seamless deployment pipelines.',
    responsibilities: [
      'Build and maintain CI/CD pipelines',
      'Manage cloud infrastructure (AWS, Azure, GCP)',
      'Automate deployment and scaling processes',
      'Monitor system performance and reliability',
      'Implement security best practices',
      'Troubleshoot production issues'
    ],
    skills: [
      'Cloud platforms (AWS, Azure, GCP)',
      'Containerization (Docker, Kubernetes)',
      'CI/CD tools (Jenkins, GitHub Actions)',
      'Scripting (Bash, Python)',
      'Infrastructure as Code (Terraform)',
      'System administration and networking'
    ]
  }
];

/**
 * Sample resources data
 * Each resource is associated with a role and includes metadata
 */
const SAMPLE_RESOURCES = [
  // Software Engineer resources
  { role_name: 'Software Engineer', title: 'CS50: Introduction to Computer Science', url: 'https://cs50.harvard.edu/', resource_type: 'Course', difficulty: 'Beginner' },
  { role_name: 'Software Engineer', title: 'freeCodeCamp: Learn to Code', url: 'https://www.freecodecamp.org/', resource_type: 'Course', difficulty: 'Beginner' },
  { role_name: 'Software Engineer', title: 'The Odin Project', url: 'https://www.theodinproject.com/', resource_type: 'Course', difficulty: 'Intermediate' },
  { role_name: 'Software Engineer', title: 'Clean Code by Robert Martin', url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882', resource_type: 'Article', difficulty: 'Intermediate' },
  
  // QA Engineer resources
  { role_name: 'QA Engineer', title: 'Software Testing Tutorial', url: 'https://www.guru99.com/software-testing.html', resource_type: 'Article', difficulty: 'Beginner' },
  { role_name: 'QA Engineer', title: 'Test Automation University', url: 'https://testautomationu.applitools.com/', resource_type: 'Course', difficulty: 'Intermediate' },
  { role_name: 'QA Engineer', title: 'Introduction to Selenium', url: 'https://www.selenium.dev/documentation/', resource_type: 'Article', difficulty: 'Intermediate' },
  { role_name: 'QA Engineer', title: 'Cypress Testing Tutorial', url: 'https://www.youtube.com/watch?v=u8vMu7viCm8', resource_type: 'Video', difficulty: 'Intermediate' },
  
  // Data Scientist resources
  { role_name: 'Data Scientist', title: 'Python for Data Science', url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai', resource_type: 'Course', difficulty: 'Beginner' },
  { role_name: 'Data Scientist', title: 'Introduction to Machine Learning', url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU', resource_type: 'Video', difficulty: 'Beginner' },
  { role_name: 'Data Scientist', title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', resource_type: 'Course', difficulty: 'Intermediate' },
  { role_name: 'Data Scientist', title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', resource_type: 'Course', difficulty: 'Advanced' },
  
  // UX/UI Designer resources
  { role_name: 'UX/UI Designer', title: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', resource_type: 'Course', difficulty: 'Beginner' },
  { role_name: 'UX/UI Designer', title: 'Laws of UX', url: 'https://lawsofux.com/', resource_type: 'Article', difficulty: 'Beginner' },
  { role_name: 'UX/UI Designer', title: 'Figma Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', resource_type: 'Video', difficulty: 'Beginner' },
  { role_name: 'UX/UI Designer', title: 'Nielsen Norman Group Articles', url: 'https://www.nngroup.com/articles/', resource_type: 'Article', difficulty: 'Intermediate' },
  
  // DevOps Engineer resources
  { role_name: 'DevOps Engineer', title: 'Docker Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', resource_type: 'Video', difficulty: 'Beginner' },
  { role_name: 'DevOps Engineer', title: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', resource_type: 'Course', difficulty: 'Beginner' },
  { role_name: 'DevOps Engineer', title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/', resource_type: 'Article', difficulty: 'Intermediate' },
  { role_name: 'DevOps Engineer', title: 'CI/CD Pipeline Tutorial', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', resource_type: 'Video', difficulty: 'Intermediate' },
];

/**
 * Main seed function
 * Inserts sample roles and resources into the database
 */
async function seed() {
  console.log('Starting database seeding...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Cannot proceed with seeding - database connection failed');
    process.exit(1);
  }

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM resources');
    await pool.query('DELETE FROM roles');
    await pool.query('ALTER SEQUENCE roles_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE resources_id_seq RESTART WITH 1');
    console.log('✓ Existing data cleared');

    // Insert roles
    console.log('\nInserting roles...');
    const roleIds: { [key: string]: number } = {};
    
    for (const role of SAMPLE_ROLES) {
      const result = await pool.query(
        `INSERT INTO roles (name, short_description, long_description, responsibilities, skills)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [role.name, role.short_description, role.long_description, role.responsibilities, role.skills]
      );
      roleIds[role.name] = result.rows[0].id;
      console.log(`  ✓ ${role.name} (ID: ${result.rows[0].id})`);
    }

    // Insert resources
    console.log('\nInserting resources...');
    let resourceCount = 0;
    
    for (const resource of SAMPLE_RESOURCES) {
      const roleId = roleIds[resource.role_name];
      await pool.query(
        `INSERT INTO resources (role_id, title, url, resource_type, difficulty)
         VALUES ($1, $2, $3, $4, $5)`,
        [roleId, resource.title, resource.url, resource.resource_type, resource.difficulty]
      );
      resourceCount++;
    }
    console.log(`  ✓ ${resourceCount} resources inserted`);

    console.log('\n✓ Seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - ${SAMPLE_ROLES.length} roles created`);
    console.log(`  - ${resourceCount} resources created`);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run seed if this script is executed directly
if (require.main === module) {
  seed();
}

export { seed };
