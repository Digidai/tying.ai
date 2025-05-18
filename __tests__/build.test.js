const fs = require('fs');
const { execSync } = require('child_process');

describe('build command', () => {
  test('creates dist/index.html', () => {
    execSync('npm run build', { stdio: 'inherit' });
    expect(fs.existsSync('dist/index.html')).toBe(true);
    fs.rmSync('dist', { recursive: true, force: true });
  });
});
