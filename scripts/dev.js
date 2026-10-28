import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('🚀 Khởi động Nga Pijama Mẹ & Bé (Client + Server)...');

const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true,
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'client'),
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  console.log('\n🛑 Đang dừng các tiến trình...');
  server.kill();
  client.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
