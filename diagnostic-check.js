// Run this script in your project root: node diagnostic-check.js
const fs = require('fs');
const path = require('path');

console.log('\n🔍 PORTFOLIO BACKEND MIGRATION - DIAGNOSTIC CHECK\n');
console.log('='.repeat(60));

// Check 1: jsconfig.json
console.log('\n1️⃣ Checking jsconfig.json...');
const jsconfigPath = path.join(process.cwd(), 'jsconfig.json');
if (fs.existsSync(jsconfigPath)) {
  const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));
  console.log('✅ jsconfig.json exists');
  console.log('Config:', JSON.stringify(jsconfig, null, 2));
  
  if (jsconfig.compilerOptions?.paths?.['@/*']) {
    console.log('✅ Path alias @/* is configured');
  } else {
    console.log('❌ Path alias @/* is NOT configured');
  }
} else {
  console.log('❌ jsconfig.json NOT FOUND');
}

// Check 2: Required files
console.log('\n2️⃣ Checking required files...');
const requiredFiles = [
  'lib/db.js',
  'lib/email.js',
  'models/Newsletter.js',
  'models/Contact.js',
  'models/Blog.js',
  'app/api/contact/route.js',
  'app/api/newsletter/route.js',
  'app/api/newsletter/unsubscribe/route.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} MISSING`);
  }
});

// Check 3: package.json dependencies
console.log('\n3️⃣ Checking dependencies...');
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const required = ['mongoose', 'nodemailer'];
  
  required.forEach(dep => {
    if (pkg.dependencies?.[dep]) {
      console.log(`✅ ${dep}: ${pkg.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} NOT INSTALLED`);
    }
  });
}

// Check 4: Environment variables
console.log('\n4️⃣ Checking environment variables...');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['MONGODB_URI', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is MISSING`);
    }
  });
} else {
  console.log('❌ .env.local NOT FOUND');
}

console.log('\n' + '='.repeat(60));
console.log('\n✨ Diagnostic check complete!\n');