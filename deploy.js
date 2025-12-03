#!/usr/bin/env node

/**
 * KMCI Website Deployment Script
 * Automated deployment with health checks
 */

const { execSync } = require('child_process');

async function deploy() {
  console.log('🚀 Starting KMCI Website Deployment...');

  try {
    // Run health check
    console.log('1. Running system health check...');
    execSync('node system-health-check.js', { stdio: 'inherit' });

    // Build the application
    console.log('2. Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Run tests
    console.log('3. Running tests...');
    execSync('npm run type-check', { stdio: 'inherit' });

    // Deploy to Vercel
    console.log('4. Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('✅ Deployment completed successfully!');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();
