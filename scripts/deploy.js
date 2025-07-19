#!/usr/bin/env node

const fs = require('fs-extra');
const { execSync } = require('child_process');
const chalk = require('chalk');

class Deployer {
  constructor() {
    this.steps = [];
    this.errors = [];
  }

  async addStep(name, action) {
    this.steps.push({ name, action });
  }

  async runStep(step) {
    try {
      console.log(chalk.blue(`🔄 ${step.name}...`));
      await step.action();
      console.log(chalk.green(`✅ ${step.name} completed`));
    } catch (error) {
      console.error(chalk.red(`❌ ${step.name} failed:`), error.message);
      this.errors.push({ step: step.name, error: error.message });
      throw error;
    }
  }

  async run() {
    console.log(chalk.yellow('🚀 Starting deployment process...'));
    
    // 添加部署步骤
    await this.addStep('Install dependencies', async () => {
      execSync('npm install', { stdio: 'inherit' });
    });

    await this.addStep('Generate SEO files', async () => {
      execSync('npm run generate-seo', { stdio: 'inherit' });
    });

    await this.addStep('Run SEO audit', async () => {
      execSync('npm run seo-audit', { stdio: 'inherit' });
    });

    await this.addStep('Build project', async () => {
      execSync('npm run build', { stdio: 'inherit' });
    });

    await this.addStep('Validate build', async () => {
      const distExists = await fs.pathExists('dist');
      if (!distExists) {
        throw new Error('Build directory not found');
      }
      
      const files = await fs.readdir('dist');
      if (files.length === 0) {
        throw new Error('Build directory is empty');
      }
      
      console.log(chalk.green(`✅ Build contains ${files.length} files`));
    });

    await this.addStep('Create deployment report', async () => {
      const report = {
        timestamp: new Date().toISOString(),
        status: 'success',
        steps: this.steps.map(s => s.name),
        errors: this.errors,
        buildInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        }
      };
      
      await fs.writeFile('deployment-report.json', JSON.stringify(report, null, 2));
      console.log(chalk.green('✅ Deployment report created'));
    });

    // 执行所有步骤
    for (const step of this.steps) {
      await this.runStep(step);
    }

    if (this.errors.length > 0) {
      console.log(chalk.red('\n❌ Deployment completed with errors:'));
      this.errors.forEach(error => {
        console.log(chalk.red(`  - ${error.step}: ${error.error}`));
      });
      process.exit(1);
    } else {
      console.log(chalk.green('\n🎉 Deployment completed successfully!'));
      console.log(chalk.blue('\n📋 Deployment Summary:'));
      console.log(chalk.blue(`  - Steps completed: ${this.steps.length}`));
      console.log(chalk.blue(`  - Errors: ${this.errors.length}`));
      console.log(chalk.blue(`  - Build directory: dist/`));
      console.log(chalk.blue(`  - SEO files updated`));
    }
  }
}

// 运行部署器
const deployer = new Deployer();
deployer.run(); 