#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import dayjs from 'dayjs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'docs', 'src');
const postsRoot = path.join(docsRoot, 'posts');

const RAW_ARGS = process.argv.slice(2);
const { positional, flags } = parseArgs(RAW_ARGS);

if (!positional.length) {
  logError('请传入要创建的 markdown 路径，例如：npm run posts -- "posts/nest/fastify + Prisma 入门.md"');
  process.exit(1);
}

const providedPath = positional[0];
const isForce = Boolean(flags.force);

let normalizedRelative = normalizeRelativePath(providedPath);
const absoluteTarget = path.resolve(postsRoot, normalizedRelative);

if (!absoluteTarget.startsWith(postsRoot)) {
  logError('目标文件必须位于 docs/src/posts 目录下');
  process.exit(1);
}

const now = dayjs();
const headingTitle = formatTitle(flags.title ?? path.basename(normalizedRelative, '.md'));
const desc = flags.desc ?? '';
const tags = flags.tags ?? '';
const outline = flags.outline ?? 'deep';

const frontMatter = [
  '---',
  `updateTime: "${now.format('YYYY-MM-DD HH:mm')}"`,
  `date: "${now.format('YYYY-MM-DD')}"`,
  `desc: ${JSON.stringify(desc)}`,
  `tags: ${JSON.stringify(tags)}`,
  `outline: ${outline}`,
  '---',
  '',
  `# ${headingTitle}`,
  '',
  '> TODO: 简要描述这篇文章',
  ''
].join('\n');

const targetDir = path.dirname(absoluteTarget);

try {
  await fs.mkdir(targetDir, { recursive: true });
  if (!isForce) {
    await assertFileNotExists(absoluteTarget);
  }
  await fs.writeFile(absoluteTarget, frontMatter, 'utf8');
  console.log(`已创建：${path.relative(repoRoot, absoluteTarget)}`);
} catch (error) {
  logError(error.message || String(error));
  process.exit(1);
}

function normalizeRelativePath(input) {
  let relative = input.trim().replace(/\\/g, '/');
  relative = relative.replace(/^\.?\/*/, '');

  if (relative.startsWith('docs/')) {
    relative = relative.replace(/^docs\/src\//, '');
  }

  if (relative.startsWith('posts/')) {
    relative = relative.slice('posts/'.length);
  }

  if (!relative.endsWith('.md')) {
    relative = `${relative}.md`;
  }

  if (!relative.length || relative === '.md') {
    throw new Error('请输入合法的文件名');
  }

  return relative;
}

async function assertFileNotExists(filePath) {
  try {
    await fs.access(filePath);
    throw new Error(`目标文件已存在：${filePath}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function formatTitle(rawTitle) {
  return rawTitle.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseArgs(args) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    if (!current.startsWith('--')) {
      positional.push(current);
      continue;
    }

    const eqIndex = current.indexOf('=');
    if (eqIndex !== -1) {
      const key = current.slice(2, eqIndex);
      const value = current.slice(eqIndex + 1);
      flags[key] = value;
      continue;
    }

    const key = current.slice(2);
    const next = args[i + 1];
    if (next && !next.startsWith('--')) {
      flags[key] = next;
      i += 1;
    } else {
      flags[key] = true;
    }
  }

  return { positional, flags };
}

function logError(message) {
  console.error(`\n[create-post] ${message}\n`);
}
