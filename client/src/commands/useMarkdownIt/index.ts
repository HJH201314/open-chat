import MarkdownIt from 'markdown-it';
import MarkdownItHighlightJs from 'markdown-it-highlightjs';
import MarkdownItKatex from './mditKatex.ts';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
// @ts-ignore
import highlightJsVueDefiner from './highlightVue';

const markdownIt = MarkdownIt({
  linkify: true,
  // typographer: true,
  // html: true,
})
  .use(MarkdownItHighlightJs, {
    inline: true,
    auto: true,
    register: {
      vue: highlightJsVueDefiner,
    },
  })
  .use(MarkdownItKatex, {
    output: 'mathml',
  });

// 获取 MarkdownItHighlightJs 设置的渲染函数并替换
const highlightJsRender = markdownIt.renderer.rules.fence;
markdownIt.renderer.rules.fence = function (tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const lang = token.info;
  const highlighted = highlightJsRender?.(tokens, idx, options, env, slf) || '';

  return `<div class="cus-code-container">
            <section style="user-select: none;">
              <span class="lang-name">${lang}</span>
              <button type="button" class="copy-button">复制</button>
            </section>
            ${highlighted}
          </div>`;
};

export const renderMarkdown = (text?: string) => {
  if (!text) return '';

  console.log('[renderMarkdown1]', text);
  text = text.replaceAll(/<br>/g, '\n');
  let res = markdownIt.render(text);
  res = res.substring(0, res.length - 1); // 删除最后一个莫名其妙的字符
  return res;
};

function useMarkdownIt(text: MaybeRefOrGetter<string>) {
  const result = computed(() => renderMarkdown(<string>toValue(text)));

  return {
    result,
  };
}

export default useMarkdownIt;
