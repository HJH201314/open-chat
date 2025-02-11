// @ts-ignore
import { definer as highlightJsVueDefiner } from 'highlightjs-vue';
import MarkdownIt from 'markdown-it';
import MarkdownItHighlightJs from 'markdown-it-highlightjs';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

const markdownIt = MarkdownIt({
  // typographer: true,
  // html: true,
}).use(MarkdownItHighlightJs, {
  inline: true,
  auto: true,
  register: {
    vue: highlightJsVueDefiner,
  },
});
function useMarkdownIt(text: MaybeRefOrGetter<string>) {
  const result = computed(() => {
    let value = <string>toValue(text);
    // console.log(value)
    value = value.replace(/<br>/g, '\n');
    // console.log(value)
    let res = markdownIt.render(value);
    res = res.substring(0, res.length - 1); // 删除最后一个莫名其妙的字符
    return res;
  });

  return {
    result,
  };
}

export default useMarkdownIt;
