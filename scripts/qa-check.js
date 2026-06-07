#!/usr/bin/env node
/**
 * MysticDraw QA Check Script v3
 * Custom checks beyond ESLint (react-hooks/exhaustive-deps already covered)
 *
 * Checks ESLint CANNOT detect:
 * 1. setTimeout/setInterval without clear — runtime memory leak
 * 2. GSAP tween/timeline without kill() cleanup
 * 3. Scene transition layers without pointer-events-none during opacity fade
 * 4. Event chain: state changes without matching UI transitions
 * 5. useRef<Tween> without useEffect cleanup
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const ISSUES = [];

function walk(dir, pattern) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full, pattern));
    else if (pattern.test(entry.name)) results.push(full);
  }
  return results;
}

function addIssue(file, line, type, msg, sev = 'error') {
  ISSUES.push({
    file: path.relative(process.cwd(), file),
    line,
    type,
    message: msg,
    severity: sev,
  });
}

function lineNo(content, idx) {
  return content.slice(0, idx).split('\n').length;
}

/* ── Check 1: setTimeout/setInterval without clear ── */
function checkTimeouts(file, content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(
      /(?:const|let|var)\s+(\w+)[^=]*=\s*(?:window\.)?setTimeout|setInterval/
    );
    if (!m) continue;
    const hasClear = new RegExp(
      `clear(?:Timeout|Interval)\\s*\\(\\s*${m[1]}\\b`
    ).test(content);
    if (!hasClear) {
      addIssue(
        file,
        i + 1,
        'timeout-cleanup',
        `"${m[1]}" from setTimeout/setInterval never cleared — memory leak`,
        'error'
      );
    }
  }
}

/* ── Check 2: GSAP without cleanup ── */
function checkGsap(file, content) {
  const lines = content.split('\n');

  // Helper: is this gsap call inside a hook with return cleanup?
  function hasHookCleanup(gsapLineIdx) {
    const before = lines.slice(0, gsapLineIdx).join('\n');
    // Find nearest useEffect/useLayoutEffect
    const hookIdx = before.lastIndexOf('useEffect');
    const layoutIdx = before.lastIndexOf('useLayoutEffect');
    const start = Math.max(hookIdx, layoutIdx);
    if (start === -1) return false;
    const afterHook = content.slice(start);
    return /return\s*\(\s*\)\s*=>\s*\{[\s\S]{0,200}?kill/.test(afterHook);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // gsap.to/from without stored ref AND no hook cleanup
    if (/\bgsap\.(?:to|from|fromTo)\s*\(/.test(line)) {
      const hasAssignment =
        /(?:const|let|var)\s+\w+\s*=/.test(line) ||
        /\.\w+\.(?:to|from|fromTo)\s*\(/.test(line);
      if (!hasAssignment && !hasHookCleanup(i)) {
        addIssue(
          file,
          i + 1,
          'gsap-cleanup',
          `gsap.to/from() without stored ref or hook cleanup — may leak on unmount`,
          'warning'
        );
      }
    }

    // gsap.timeline without cleanup
    if (/\bgsap\.timeline\s*\(/.test(line) && !hasHookCleanup(i)) {
      addIssue(
        file,
        i + 1,
        'gsap-cleanup',
        `gsap.timeline() without hook cleanup — add kill() in useEffect return`,
        'warning'
      );
    }
  }
}

/* ── Check 3: pointer-events during scene transitions ── */
function checkPointerEvents(file, content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Only flag scene transition layers
    if (!/exitingScene|currentScene|exitingRef|currentRef/.test(line)) continue;
    // Check if opacity is being set (not GSAP tl.to which is animated)
    if (!/opacity\s*[:=]/.test(line)) continue;
    // Skip GSAP calls (tl.to, gsap.set) — they're animated, not static CSS
    if (/tl\.to\s*\(|gsap\.(?:set|to)\s*\(/.test(line)) continue;
    // Check nearby for pointer-events-none
    const nearby = lines
      .slice(Math.max(0, i - 2), Math.min(lines.length, i + 3))
      .join('\n');
    if (!/pointer-events-none/.test(nearby)) {
      addIssue(
        file,
        i + 1,
        'pointer-events',
        `Scene layer opacity without pointer-events-none — clicks may leak`,
        'warning'
      );
    }
  }
}

/* ── Check 4: event chain completeness ── */
function checkEventChain(file, content, filename) {
  if (!filename.includes('Controller')) return;
  const hasSceneChange = /setGameState\s*\([^)]*scene\s*:/.test(content);
  const hasTransition = /transitionTo\s*\(/.test(content);
  if (hasSceneChange && !hasTransition) {
    addIssue(
      file,
      1,
      'event-chain',
      `Scene state changes without transitionTo() — UI may desync`,
      'error'
    );
  }
}

/* ── Check 5: GSAP ref without cleanup ── */
function checkRefCleanup(file, content) {
  const hasTweenRef = /useRef\s*<\s*gsap\.core\.Tween/.test(content);
  const hasTimelineRef = /useRef\s*<\s*gsap\.core\.Timeline/.test(content);
  const hasCleanup =
    /use(?:Layout)?Effect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]{0,500}?return\s*\(\s*\)\s*=>/.test(
      content
    );
  if ((hasTweenRef || hasTimelineRef) && !hasCleanup) {
    addIssue(
      file,
      1,
      'ref-cleanup',
      `GSAP ref detected without useEffect cleanup — potential leak`,
      'warning'
    );
  }
}

/* ============================================================
   Main
   ============================================================ */
function main() {
  console.log('\n🔮 MysticDraw QA Check\n');

  const files = walk(SRC_DIR, /\.(tsx|ts)$/);
  console.log(`Scanning ${files.length} files...\n`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const filename = path.basename(file);
    checkTimeouts(file, content);
    checkGsap(file, content);
    checkPointerEvents(file, content);
    checkEventChain(file, content, filename);
    checkRefCleanup(file, content);
  }

  const errors = ISSUES.filter((i) => i.severity === 'error');
  const warnings = ISSUES.filter((i) => i.severity === 'warning');

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERROR(S):\n`);
    errors.forEach((i) => {
      console.log(`  ${i.file}:${i.line}  [${i.type}]`);
      console.log(`    → ${i.message}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} WARNING(S):\n`);
    warnings.forEach((i) => {
      console.log(`  ${i.file}:${i.line}  [${i.type}]`);
      console.log(`    → ${i.message}\n`);
    });
  }

  if (ISSUES.length === 0) {
    console.log('✅ All QA checks passed!\n');
    process.exit(0);
  } else {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total: ${errors.length} errors, ${warnings.length} warnings`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    process.exit(errors.length > 0 ? 1 : 0);
  }
}

main();
