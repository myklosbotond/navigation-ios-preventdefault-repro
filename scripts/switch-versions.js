/**
 * Version switching script for react-navigation packages.
 *
 * Usage:
 *   node scripts/switch-versions.js working     # Last working versions (before PR #12845)
 *   node scripts/switch-versions.js just-broke   # First broken versions (includes PR #12845 commit 146cb8d5)
 *   node scripts/switch-versions.js latest        # Latest stable versions
 */

const fs = require('fs');
const path = require('path');

const presets = {
  // Last working versions — before PR #12845 was merged (Nov 14 2025)
  working: {
    '@react-navigation/native': '7.1.19',
    '@react-navigation/stack': '7.6.3',
    '@react-navigation/elements': '2.8.1',
  },
  // First broken versions — the release that includes PR #12845 (commit 146cb8d5)
  // PR #12845: "refactor: migrate stack card to function component (backport)"
  // Published Nov 14, 2025
  'just-broke': {
    '@react-navigation/native': '7.1.20',
    '@react-navigation/stack': '7.6.4',
    '@react-navigation/elements': '2.8.2',
  },
  // Latest stable versions (as of writing)
  latest: {
    '@react-navigation/native': '7.1.28',
    '@react-navigation/stack': '7.7.1',
    '@react-navigation/elements': '2.9.5',
  },
};

const preset = process.argv[2];

if (!preset || !presets[preset]) {
  console.error(`\nUsage: node scripts/switch-versions.js <preset>\n`);
  console.error(`Available presets:`);
  console.error(`  working    — @react-navigation/stack@7.6.3  (before PR #12845)`);
  console.error(`  just-broke — @react-navigation/stack@7.6.4  (includes PR #12845)`);
  console.error(`  latest     — @react-navigation/stack@7.7.1  (latest stable)\n`);
  process.exit(1);
}

const versions = presets[preset];
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

for (const [name, version] of Object.entries(versions)) {
  if (pkg.dependencies[name]) {
    pkg.dependencies[name] = version;
  }
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`\n✅ Switched to "${preset}" preset:\n`);
for (const [name, version] of Object.entries(versions)) {
  console.log(`   ${name}@${version}`);
}
console.log(`\nRun \`yarn install\` and then \`cd ios && bundle exec pod install\` to apply.\n`);
