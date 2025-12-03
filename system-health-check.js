#!/usr/bin/env node

/**
 * KMCI System Health Check & Verification Script
 * Comprehensive automated testing and verification of all system components
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class SystemHealthCheck {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
    this.startTime = Date.now();
    this.requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    this.requiredDependencies = [
      '@supabase/supabase-js',
      '@supabase/ssr',
      '@tanstack/react-query',
      'next',
      'react',
      'lucide-react',
      'sonner'
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const typeColors = {
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red,
      header: colors.magenta
    };

    console.log(`${typeColors[type]}${message}${colors.reset}`);
  }

  addResult(test, status, message, details = null) {
    this.results.details.push({
      test,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });

    if (status === 'PASS') {
      this.results.passed++;
      this.log(`✅ ${test}: ${message}`, 'success');
    } else if (status === 'FAIL') {
      this.results.failed++;
      this.log(`❌ ${test}: ${message}`, 'error');
      if (details) this.log(`   Details: ${details}`, 'error');
    } else if (status === 'WARN') {
      this.results.warnings++;
      this.log(`⚠️  ${test}: ${message}`, 'warning');
      if (details) this.log(`   Details: ${details}`, 'warning');
    }
  }

  async checkProjectStructure() {
    this.log('\n📁 Checking Project Structure...', 'header');

    const requiredDirs = [
      'app',
      'components',
      'lib',
      'providers',
      'hooks'
    ];

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.mjs',
      'app/layout.tsx',
      'lib/supabase/client.ts',
      'components/admin/sermon-dialog.tsx',
      'components/admin/image-upload.tsx'
    ];

    // Check directories
    for (const dir of requiredDirs) {
      if (fs.existsSync(dir)) {
        this.addResult('Directory Structure', 'PASS', `${dir} directory exists`);
      } else {
        this.addResult('Directory Structure', 'FAIL', `${dir} directory missing`);
      }
    }

    // Check files
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.addResult('File Structure', 'PASS', `${file} exists`);
      } else {
        this.addResult('File Structure', 'FAIL', `${file} missing`);
      }
    }
  }

  async checkPackageJson() {
    this.log('\n📦 Checking package.json...', 'header');

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

      // Check required scripts
      const requiredScripts = ['build', 'dev', 'start', 'lint'];
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.addResult('Package Scripts', 'PASS', `${script} script defined`);
        } else {
          this.addResult('Package Scripts', 'FAIL', `${script} script missing`);
        }
      }

      // Check dependencies
      for (const dep of this.requiredDependencies) {
        const inDeps = packageJson.dependencies && packageJson.dependencies[dep];
        const inDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];

        if (inDeps || inDevDeps) {
          this.addResult('Dependencies', 'PASS', `${dep} installed`);
        } else {
          this.addResult('Dependencies', 'FAIL', `${dep} missing`);
        }
      }

      // Check Node.js version requirement
      if (packageJson.engines && packageJson.engines.node) {
        this.addResult('Node Version', 'PASS', `Node.js requirement specified: ${packageJson.engines.node}`);
      } else {
        this.addResult('Node Version', 'WARN', 'Node.js version requirement not specified');
      }

    } catch (error) {
      this.addResult('Package.json', 'FAIL', 'Cannot read or parse package.json', error.message);
    }
  }

  async checkEnvironmentVariables() {
    this.log('\n🔐 Checking Environment Variables...', 'header');

    // Check for .env files
    const envFiles = ['.env.local', '.env', '.env.example'];
    let hasEnvFile = false;

    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        this.addResult('Environment Files', 'PASS', `${envFile} exists`);
        hasEnvFile = true;
      }
    }

    if (!hasEnvFile) {
      this.addResult('Environment Files', 'WARN', 'No environment files found');
    }

    // Check required environment variables
    for (const envVar of this.requiredEnvVars) {
      if (process.env[envVar]) {
        const value = process.env[envVar];
        if (envVar.includes('URL') && !value.startsWith('http')) {
          this.addResult('Environment Variables', 'WARN', `${envVar} may be invalid URL format`);
        } else if (envVar.includes('KEY') && value.length < 10) {
          this.addResult('Environment Variables', 'WARN', `${envVar} appears too short`);
        } else {
          this.addResult('Environment Variables', 'PASS', `${envVar} is set`);
        }
      } else {
        this.addResult('Environment Variables', 'FAIL', `${envVar} not set`);
      }
    }
  }

  async checkTypeScriptConfiguration() {
    this.log('\n🔧 Checking TypeScript Configuration...', 'header');

    try {
      const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

      // Check compiler options
      const requiredOptions = {
        'strict': true,
        'esModuleInterop': true,
        'skipLibCheck': true,
        'jsx': 'preserve'
      };

      for (const [option, expectedValue] of Object.entries(requiredOptions)) {
        if (tsconfig.compilerOptions && tsconfig.compilerOptions[option] === expectedValue) {
          this.addResult('TypeScript Config', 'PASS', `${option} correctly set`);
        } else {
          this.addResult('TypeScript Config', 'WARN', `${option} not set to ${expectedValue}`);
        }
      }

      // Check path mapping
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
        this.addResult('TypeScript Config', 'PASS', 'Path mapping configured for @/*');
      } else {
        this.addResult('TypeScript Config', 'WARN', 'Path mapping for @/* not configured');
      }

    } catch (error) {
      this.addResult('TypeScript Config', 'FAIL', 'Cannot read or parse tsconfig.json', error.message);
    }
  }

  async checkNextJSConfiguration() {
    this.log('\n⚡ Checking Next.js Configuration...', 'header');

    try {
      // Check if next.config.mjs exists and is readable
      if (fs.existsSync('next.config.mjs')) {
        const configContent = fs.readFileSync('next.config.mjs', 'utf8');

        // Check for important configurations
        if (configContent.includes('images')) {
          this.addResult('Next.js Config', 'PASS', 'Image configuration found');
        } else {
          this.addResult('Next.js Config', 'WARN', 'No image configuration found');
        }

        if (configContent.includes('eslint')) {
          this.addResult('Next.js Config', 'PASS', 'ESLint configuration found');
        }

        if (configContent.includes('typescript')) {
          this.addResult('Next.js Config', 'PASS', 'TypeScript configuration found');
        }

        this.addResult('Next.js Config', 'PASS', 'next.config.mjs exists and readable');
      } else {
        this.addResult('Next.js Config', 'WARN', 'next.config.mjs not found');
      }

      // Check app directory structure
      const appDirs = ['app', 'app/admin', 'app/api'];
      for (const dir of appDirs) {
        if (fs.existsSync(dir)) {
          this.addResult('Next.js Structure', 'PASS', `${dir} directory exists`);
        } else {
          this.addResult('Next.js Structure', 'WARN', `${dir} directory missing`);
        }
      }

    } catch (error) {
      this.addResult('Next.js Config', 'FAIL', 'Error checking Next.js configuration', error.message);
    }
  }

  async checkSupabaseConnection() {
    this.log('\n🗄️  Checking Supabase Connection...', 'header');

    try {
      // Dynamic import for ES modules
      const { createClient } = await import('@supabase/supabase-js');

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        this.addResult('Supabase Connection', 'FAIL', 'Supabase credentials missing');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Test basic connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);

        if (error) {
          if (error.code === 'PGRST106') {
            this.addResult('Supabase Connection', 'WARN', 'Connected but profiles table not found');
          } else {
            this.addResult('Supabase Connection', 'FAIL', `Connection error: ${error.message}`);
          }
        } else {
          this.addResult('Supabase Connection', 'PASS', 'Successfully connected to Supabase');
        }
      } catch (connectionError) {
        this.addResult('Supabase Connection', 'FAIL', 'Failed to connect to Supabase', connectionError.message);
      }

      // Test critical tables
      const criticalTables = ['profiles', 'sermons', 'products', 'events', 'blog_posts'];
      for (const table of criticalTables) {
        try {
          const { data, error } = await supabase.from(table).select('count').limit(1);
          if (error) {
            this.addResult('Database Tables', 'WARN', `${table} table not accessible: ${error.message}`);
          } else {
            this.addResult('Database Tables', 'PASS', `${table} table accessible`);
          }
        } catch (tableError) {
          this.addResult('Database Tables', 'FAIL', `Error checking ${table} table`, tableError.message);
        }
      }

    } catch (importError) {
      this.addResult('Supabase Connection', 'FAIL', 'Cannot import Supabase client', importError.message);
    }
  }

  async checkDatabaseSchema() {
    this.log('\n🗃️  Checking Database Schema...', 'header');

    try {
      const { createClient } = await import('@supabase/supabase-js');

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseServiceKey) {
        this.addResult('Database Schema', 'WARN', 'Service role key not available for schema check');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Check for speaker column in sermons table
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('speaker')
          .limit(1);

        if (error) {
          if (error.message.includes('speaker')) {
            this.addResult('Database Schema', 'FAIL', 'Speaker column missing from sermons table');
          } else {
            this.addResult('Database Schema', 'WARN', `Sermons table issue: ${error.message}`);
          }
        } else {
          this.addResult('Database Schema', 'PASS', 'Speaker column exists in sermons table');
        }
      } catch (schemaError) {
        this.addResult('Database Schema', 'FAIL', 'Error checking sermons schema', schemaError.message);
      }

      // Check storage buckets
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
          this.addResult('Storage Buckets', 'WARN', `Cannot check storage buckets: ${error.message}`);
        } else {
          const requiredBuckets = ['product-images', 'sermon-images', 'general-uploads'];
          const existingBuckets = buckets.map(b => b.name);

          for (const bucket of requiredBuckets) {
            if (existingBuckets.includes(bucket)) {
              this.addResult('Storage Buckets', 'PASS', `${bucket} bucket exists`);
            } else {
              this.addResult('Storage Buckets', 'WARN', `${bucket} bucket missing`);
            }
          }
        }
      } catch (storageError) {
        this.addResult('Storage Buckets', 'FAIL', 'Error checking storage buckets', storageError.message);
      }

    } catch (error) {
      this.addResult('Database Schema', 'FAIL', 'Cannot perform schema check', error.message);
    }
  }

  async checkComponents() {
    this.log('\n🧩 Checking React Components...', 'header');

    const criticalComponents = [
      'components/admin/sermon-dialog.tsx',
      'components/admin/image-upload.tsx',
      'components/ui/sonner.tsx',
      'app/layout.tsx',
      'lib/supabase/client.ts'
    ];

    for (const component of criticalComponents) {
      if (fs.existsSync(component)) {
        try {
          const content = fs.readFileSync(component, 'utf8');

          // Basic syntax checks
          if (content.includes('export')) {
            this.addResult('Component Structure', 'PASS', `${component} has exports`);
          } else {
            this.addResult('Component Structure', 'WARN', `${component} may not export anything`);
          }

          // Check for common issues
          if (component.includes('sermon-dialog') && !content.includes('speaker')) {
            this.addResult('Component Issues', 'FAIL', 'sermon-dialog.tsx missing speaker field');
          }

          if (component.includes('image-upload') && content.includes('getSupabaseBrowserClient')) {
            this.addResult('Component Structure', 'PASS', 'image-upload.tsx has Supabase integration');
          }

        } catch (error) {
          this.addResult('Component Structure', 'FAIL', `Cannot read ${component}`, error.message);
        }
      } else {
        this.addResult('Component Structure', 'FAIL', `${component} missing`);
      }
    }
  }

  async checkBuild() {
    this.log('\n🔨 Checking Build Process...', 'header');

    try {
      // Check if build can be performed
      this.log('Running type check...', 'info');
      execSync('npm run type-check', { stdio: 'pipe', timeout: 30000 });
      this.addResult('Build Process', 'PASS', 'TypeScript compilation successful');
    } catch (error) {
      this.addResult('Build Process', 'FAIL', 'TypeScript compilation failed', error.message.substring(0, 200));
    }

    try {
      // Check linting
      this.log('Running linter...', 'info');
      execSync('npm run lint', { stdio: 'pipe', timeout: 30000 });
      this.addResult('Build Process', 'PASS', 'Linting passed');
    } catch (error) {
      this.addResult('Build Process', 'WARN', 'Linting issues found', error.message.substring(0, 200));
    }
  }

  async checkSecurity() {
    this.log('\n🔒 Checking Security Configuration...', 'header');

    // Check for exposed secrets
    const sensitiveFiles = ['.env.local', '.env'];
    for (const file of sensitiveFiles) {
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');

          // Check for proper secret handling
          if (content.includes('sk_live_') || content.includes('pk_live_')) {
            this.addResult('Security', 'WARN', `${file} contains live API keys`);
          }

          if (content.includes('localhost') || content.includes('127.0.0.1')) {
            this.addResult('Security', 'PASS', `${file} uses local development URLs`);
          }

        } catch (error) {
          this.addResult('Security', 'WARN', `Cannot read ${file} for security check`);
        }
      }
    }

    // Check git ignore
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      if (gitignore.includes('.env')) {
        this.addResult('Security', 'PASS', '.env files properly ignored in git');
      } else {
        this.addResult('Security', 'FAIL', '.env files not ignored in git');
      }
    } else {
      this.addResult('Security', 'WARN', '.gitignore file missing');
    }
  }

  async checkPerformance() {
    this.log('\n⚡ Checking Performance Configuration...', 'header');

    // Check Next.js optimizations
    if (fs.existsSync('next.config.mjs')) {
      const config = fs.readFileSync('next.config.mjs', 'utf8');

      if (config.includes('images')) {
        this.addResult('Performance', 'PASS', 'Image optimization configured');
      } else {
        this.addResult('Performance', 'WARN', 'Image optimization not configured');
      }

      if (config.includes('compress')) {
        this.addResult('Performance', 'PASS', 'Compression enabled');
      }
    }

    // Check for React Query configuration
    if (fs.existsSync('providers/query-provider.tsx')) {
      const queryConfig = fs.readFileSync('providers/query-provider.tsx', 'utf8');
      if (queryConfig.includes('staleTime')) {
        this.addResult('Performance', 'PASS', 'React Query caching configured');
      } else {
        this.addResult('Performance', 'WARN', 'React Query caching may not be optimized');
      }
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);

    this.log('\n📊 SYSTEM HEALTH REPORT', 'header');
    this.log('================================', 'header');
    this.log(`Total Tests: ${this.results.passed + this.results.failed + this.results.warnings}`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, 'error');
    this.log(`⚠️  Warnings: ${this.results.warnings}`, 'warning');
    this.log(`⏱️  Duration: ${duration}s`, 'info');

    // Calculate health score
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const score = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    this.log(`\n📈 System Health Score: ${score}%`, score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error');

    // Recommendations
    this.log('\n💡 RECOMMENDATIONS:', 'header');

    if (this.results.failed > 0) {
      this.log('🚨 CRITICAL: Fix all failed tests immediately', 'error');
    }

    if (this.results.warnings > 5) {
      this.log('⚠️  HIGH: Address warnings to improve system stability', 'warning');
    }

    if (score >= 90) {
      this.log('🎉 EXCELLENT: System is in great condition!', 'success');
    } else if (score >= 80) {
      this.log('✅ GOOD: System is healthy with minor improvements needed', 'success');
    } else if (score >= 60) {
      this.log('⚠️  FAIR: System needs attention to prevent issues', 'warning');
    } else {
      this.log('🚨 POOR: System requires immediate attention', 'error');
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      score,
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        total
      },
      details: this.results.details
    };

    fs.writeFileSync('system-health-report.json', JSON.stringify(report, null, 2));
    this.log(`\n📄 Detailed report saved to: system-health-report.json`, 'info');

    return score >= 80;
  }

  async runAllChecks() {
    this.log('🚀 KMCI SYSTEM HEALTH CHECK STARTING...', 'header');
    this.log('=====================================', 'header');

    try {
      await this.checkProjectStructure();
      await this.checkPackageJson();
      await this.checkEnvironmentVariables();
      await this.checkTypeScriptConfiguration();
      await this.checkNextJSConfiguration();
      await this.checkSupabaseConnection();
      await this.checkDatabaseSchema();
      await this.checkComponents();
      await this.checkBuild();
      await this.checkSecurity();
      await this.checkPerformance();
    } catch (error) {
      this.log(`\n💥 CRITICAL ERROR: ${error.message}`, 'error');
      this.addResult('System Check', 'FAIL', 'Health check interrupted by critical error', error.message);
    }

    return this.generateReport();
  }
}

// Auto-run if called directly
if (require.main === module) {
  const healthCheck = new SystemHealthCheck();

  healthCheck.runAllChecks()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

module.exports = SystemHealthCheck;
