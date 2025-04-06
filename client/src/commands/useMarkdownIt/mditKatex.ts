/**
 * MarkdownIt 结合 Katex 渲染
 * 修改源码以实现 \[ 和 \] 表示的块级公式
 * @source https://github.com/waylonflinn/markdown-it-katex
 */
import { type KatexOptions, renderToString } from 'katex';
import type MarkdownIt from 'markdown-it';
import type StateCore from 'markdown-it/lib/rules_core/state_core';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';

// 定义分隔符验证结果的类型
interface DelimiterValidation {
  can_open: boolean;
  can_close: boolean;
}

// 验证分隔符有效性
function isValidDelim(state: StateCore, pos: number): DelimiterValidation {
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  const nextChar = pos + 1 <= state.posMax ? state.src.charCodeAt(pos + 1) : -1;

  let can_open = true;
  let can_close = true;

  if (prevChar === 0x20 || prevChar === 0x09 || (nextChar >= 0x30 && nextChar <= 0x39)) {
    can_close = false;
  }
  if (nextChar === 0x20 || nextChar === 0x09) {
    can_open = false;
  }

  return { can_open, can_close };
}

// 行内数学公式处理
function math_inline(state: StateInline, silent: boolean): boolean {
  if (state.src[state.pos] !== '$') return false;

  const res = isValidDelim(state, state.pos);
  if (!res.can_open) {
    if (!silent) state.pending += '$';
    state.pos++;
    return true;
  }

  let start = state.pos + 1;
  let match = start;

  while ((match = state.src.indexOf('$', match)) !== -1) {
    let pos = match - 1;
    while (state.src[pos] === '\\') pos--;
    if ((match - pos) % 2 === 1) break;
    match++;
  }

  if (match === -1) {
    if (!silent) state.pending += '$';
    state.pos = start;
    return true;
  }

  if (match - start === 0) {
    if (!silent) state.pending += '$$';
    state.pos = start + 1;
    return true;
  }

  const endRes = isValidDelim(state, match);
  if (!endRes.can_close) {
    if (!silent) state.pending += '$';
    state.pos = start;
    return true;
  }

  if (!silent) {
    const token = state.push('math_inline', 'math', 0);
    token.markup = '$';
    token.content = state.src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

// 块级数学公式处理
function math_block(state: StateBlock, start: number, end: number, silent: boolean): boolean {
  let pos = state.bMarks[start] + state.tShift[start];
  const max = state.eMarks[start];

  if (pos + 2 > max || state.src.slice(pos, pos + 2) !== '\\[') return false;

  pos += 2;
  let firstLine = state.src.slice(pos, max);
  let found = false;
  let next: number;

  if (silent) return true;

  if (firstLine.trim().endsWith('\\]')) {
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }

  for (next = start; !found; next++) {
    if (next >= end) break;

    pos = state.bMarks[next] + state.tShift[next];
    const currentMax = state.eMarks[next];

    if (pos < currentMax && state.tShift[next] < state.blkIndent) break;

    const content = state.src.slice(pos, currentMax);
    if (content.trim().endsWith('\\]')) {
      const lastPos = content.lastIndexOf('\\]');
      const lastLine = content.slice(0, lastPos);
      found = true;
    }
  }

  state.line = next + 1;
  const token = state.push('math_block', 'math', 0);
  token.block = true;
  token.content =
    (firstLine.trim() ? firstLine + '\n' : '') + state.getLines(start + 1, next, state.tShift[start], true);
  token.map = [start, state.line];
  token.markup = '$$';
  return true;
}

// 插件主函数
export default function mathPlugin(md: MarkdownIt, options?: KatexOptions) {
  const opts = options || {};

  const katexInline = (latex: string) => {
    opts.displayMode = false;
    try {
      return renderToString(latex, opts);
    } catch (error) {
      if (opts.throwOnError) console.error(error);
      return latex;
    }
  };

  const inlineRenderer = (tokens: any[], idx: number) => katexInline(tokens[idx].content);

  const katexBlock = (latex: string) => {
    opts.displayMode = true;
    try {
      return `<p>${renderToString(latex, opts)}</p>`;
    } catch (error) {
      if (opts.throwOnError) console.error(error);
      return latex;
    }
  };

  const blockRenderer = (tokens: any[], idx: number) => katexBlock(tokens[idx].content) + '\n';

  md.inline.ruler.after('escape', 'math_inline', math_inline);
  md.block.ruler.after('blockquote', 'math_block', math_block, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });
  md.renderer.rules.math_inline = inlineRenderer;
  md.renderer.rules.math_block = blockRenderer;
}
