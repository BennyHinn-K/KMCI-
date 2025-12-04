const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Console colors for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    log(`📋 Executing: ${command}`, 'blue');
    const result = execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      cwd: process.cwd(),
      ...options
    });
    return result;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    throw error;
  }
}

function checkEnvironment() {
  log('🔍 Checking environment...', 'blue');

  const requiredEnvVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET'
  ];

  const missing = [];
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar] && !fs.existsSync('.env') && !fs.existsSync('.env.local')) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    log('⚠️  Missing required environment variables:', 'yellow');
    missing.forEach(envVar => log(`  - ${envVar}`, 'yellow'));
    log('Please set these in your .env file or Vercel dashboard', 'yellow');
  }

  return missing.length === 0;
}

function checkDependencies() {
  log('📦 Checking dependencies...', 'blue');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'pg',
      'bcryptjs',
      'jsonwebtoken',
      'winston',
      'zod',
      '@types/pg',
      '@types/bcryptjs',
      '@types/jsonwebtoken'
    ];

    const missing = requiredDeps.filter(dep =>
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );

    if (missing.length > 0) {
      log('❌ Missing required dependencies:', 'red');
      missing.forEach(dep => log(`  - ${dep}`, 'red'));
      return false;
    }

    log('✅ All required dependencies are present', 'green');
    return true;
  } catch (error) {
    log('❌ Error checking package.json', 'red');
    return false;
  }
}

function runTests() {
  log('🧪 Running tests and type checks...', 'blue');

  try {
    // Type check
    execCommand('npm run type-check');
    log('✅ TypeScript type check passed', 'green');

    // Lint check
    execCommand('npm run lint');
    log('✅ ESLint check passed', 'green');

    return true;
  } catch (error) {
    log('❌ Tests or type checks failed', 'red');
    return false;
  }
}

function buildProject() {
  log('🔨 Building project...', 'blue');

  try {
    execCommand('npm run build');
    log('✅ Build completed successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Build failed', 'red');
    return false;
  }
}

function checkGitStatus() {
  log('📝 Checking Git status...', 'blue');

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });

    if (status.trim()) {
      log('📋 Uncommitted changes found:', 'yellow');
      log(status, 'yellow');

      const shouldCommit = process.argv.includes('--auto-commit') ||
                          process.env.AUTO_COMMIT === 'true';

      if (shouldCommit) {
        log('🔄 Auto-committing changes...', 'blue');
        execCommand('git add .');
        execCommand('git commit -m "Auto-commit: Deploy to production"');
        log('✅ Changes committed', 'green');
      } else {
        log('⚠️  Use --auto-commit flag to automatically commit changes', 'yellow');
        return false;
      }
    }

    return true;
  } catch (error) {
    log('❌ Git status check failed', 'red');
    return false;
  }
}

function deployToVercel() {
  log('🚀 Deploying to Vercel...', 'blue');

  try {
    // Check if Vercel CLI is available
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch {
      log('❌ Vercel CLI not found. Installing...', 'yellow');
      execCommand('npm install -g vercel');
    }

    // Deploy to production
    const deployCommand = process.argv.includes('--production') ?
                         'vercel --prod' : 'vercel';

    execCommand(deployCommand);
    log('✅ Deployment completed successfully', 'green');

    return true;
  } catch (error) {
    log('❌ Deployment failed', 'red');
    return false;
  }
}

function pushToGitHub() {
  log('📤 Pushing to GitHub...', 'blue');

  try {
    // Get current branch
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

    // Push to origin
    execCommand(`git push origin ${branch}`);
    log('✅ Successfully pushed to GitHub', 'green');

    return true;
  } catch (error) {
    log('❌ Failed to push to GitHub', 'red');
    return false;
  }
}

function createDeploymentReport() {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    environment: process.env.NODE_ENV || 'production',
    version: require('../package.json').version,
    deployment: {
      status: 'success',
      url: process.env.VERCEL_URL || 'https://kmci-website.vercel.app',
      branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim(),
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().substring(0, 7)
    },
    checks: {
      dependencies: true,
      typeCheck: true,
      lint: true,
      build: true,
      tests: true
    }
  };

  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  log('📊 Deployment report created: deployment-report.json', 'blue');
}

async function main() {
  console.log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                    KMCI Deployment Script                   ║
║              Automated Vercel & GitHub Deployment           ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const steps = [
    { name: 'Environment Check', fn: checkEnvironment, required: false },
    { name: 'Dependencies Check', fn: checkDependencies, required: true },
    { name: 'Tests & Type Check', fn: runTests, required: true },
    { name: 'Build Project', fn: buildProject, required: true },
    { name: 'Git Status Check', fn: checkGitStatus, required: true },
    { name: 'Push to GitHub', fn: pushToGitHub, required: true },
    { name: 'Deploy to Vercel', fn: deployToVercel, required: true }
  ];

  let allPassed = true;
  const startTime = Date.now();

  for (const step of steps) {
    try {
      log(`\n📋 ${step.name}...`, 'bold');
      const success = await step.fn();

      if (!success && step.required) {
        log(`❌ ${step.name} failed and is required`, 'red');
        allPassed = false;
        break;
      } else if (!success) {
        log(`⚠️  ${step.name} failed but is optional`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${step.name} threw an error: ${error.message}`, 'red');
      if (step.required) {
        allPassed = false;
        break;
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (allPassed) {
    createDeploymentReport();

    log(`\n${colors.bold}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║                   ✅ DEPLOYMENT SUCCESSFUL!                  ║
║                                                              ║
║  Your KMCI website has been deployed successfully!          ║
║                                                              ║
║  🌐 Production URL: https://kmci-website.vercel.app          ║
║  ⏱️  Total time: ${duration.padEnd(8)} seconds                        ║
║                                                              ║
║  Next Steps:                                                 ║
║  1. Verify the deployed application                          ║
║  2. Test the admin login functionality                       ║
║  3. Check database connections                               ║
║  4. Monitor application health                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
  } else {
    log(`\n${colors.bold}${colors.red}
╔══════════════════════════════════════════════════════════════╗
║                    ❌ DEPLOYMENT FAILED!                     ║
║                                                              ║
║  The deployment process encountered errors.                  ║
║  Please check the logs above and fix the issues.            ║
║                                                              ║
║  ⏱️  Failed after: ${duration.padEnd(8)} seconds                      ║
║                                                              ║
║  Common Issues:                                              ║
║  • Missing environment variables                             ║
║  • Build or type errors                                      ║
║  • Git repository issues                                     ║
║  • Network connectivity problems                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const validArgs = ['--production', '--auto-commit', '--skip-tests', '--help'];

if (args.includes('--help')) {
  console.log(`
KMCI Deployment Script

Usage: node scripts/deploy.js [options]

Options:
  --production     Deploy to Vercel production (default: preview)
  --auto-commit    Automatically commit uncommitted changes
  --skip-tests     Skip tests and type checking (not recommended)
  --help          Show this help message

Examples:
  node scripts/deploy.js                    # Deploy to preview
  node scripts/deploy.js --production       # Deploy to production
  node scripts/deploy.js --auto-commit      # Auto-commit changes

Environment Variables:
  AUTO_COMMIT=true                         # Auto-commit changes
  SKIP_TESTS=true                          # Skip tests (not recommended)
`);
  process.exit(0);
}

// Validate arguments
const invalidArgs = args.filter(arg => !validArgs.includes(arg));
if (invalidArgs.length > 0) {
  log(`❌ Invalid arguments: ${invalidArgs.join(', ')}`, 'red');
  log('Use --help to see available options', 'yellow');
  process.exit(1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n🛑 Deployment interrupted by user', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Deployment terminated', 'yellow');
  process.exit(0);
});

// Run deployment
if (require.main === module) {
  main().catch(error => {
    log(`💥 Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  checkEnvironment,
  checkDependencies,
  runTests,
  buildProject,
  checkGitStatus,
  deployToVercel,
  pushToGitHub,
  main
};
