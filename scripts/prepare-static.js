const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing project for static export...');

// 1. Remover a pasta dashboard (não necessária em produção/Netlify)
const dashboardPath = path.join(__dirname, '..', 'src', 'app', 'dashboard');
if (fs.existsSync(dashboardPath)) {
  console.log('Removing dashboard folder for production build...');
  fs.rmSync(dashboardPath, { recursive: true, force: true });
}

// 2. Remover a diretiva 'use server' de imovel-server-actions.ts
const serverActionsPath = path.join(__dirname, '..', 'src', 'app', 'actions', 'imovel-server-actions.ts');
if (fs.existsSync(serverActionsPath)) {
  console.log('Removing "use server" directive from server actions...');
  let content = fs.readFileSync(serverActionsPath, 'utf8');
  content = content.replace(/'use server'/g, '// use server');
  content = content.replace(/"use server"/g, '// use server');
  fs.writeFileSync(serverActionsPath, content, 'utf8');
}

console.log('Preparation complete. Running next build...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
