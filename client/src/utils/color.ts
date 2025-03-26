export function HexToRgb(str: string) {
  const r = /^#?([0-9A-F]|[0-9a-f]){6}$/;
  //test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
  if (!r.test(str)) return [0, 0, 0];
  //replace替换查找的到的字符串
  str = str.replace("#", "");
  //match得到查询数组
  const hxs: (string|number)[] | null = str.match(/../g);
  if (hxs == null) return [0, 0, 0];
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i] as string, 16);
  return hxs as number[];
}

function RgbToHex(a: number, b: number, c: number) {
  if (a < 0 || a > 255 || b < 0 || b > 255 || c < 0 || c > 255) return '#000000';
  const hexs = [a.toString(16), b.toString(16), c.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
  return "#" + hexs.join("");
}

//得到hex颜色值为color的加深颜色值，level为加深的程度，限0-1之间
export function getDarkerColor(color: string, level: number) {
  const r = /^#?([0-9A-F]|[0-9a-f]){6}$/;
  if (!r.test(color) || level < 0 || level > 1) return color;
  const rgbc = HexToRgb(color);
  //floor 向下取整
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

//得到hex颜色值为color的减淡颜色值，level为减浅的程度，限0-1之间
export function getLighterColor(color: string, level: number) {
  const r = /^#?([0-9A-F]|[0-9a-f]){6}$/;
  if (!r.test(color) || level < 0 || level > 1) return color;
  const rgbc = HexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

/**
 * 获取颜色变量对应的 hex 颜色值
 * @param hexOrVar hex 颜色值或颜色变量
 * @return hex 颜色值；如果输入值不是颜色变量，则返回空
 */
export function getColorHex(hexOrVar?: string) {
  if (!hexOrVar) return '';
  if (hexOrVar.startsWith('#')) return hexOrVar;
  hexOrVar = hexOrVar.replace('var(', '').replace(')', '')
  return getComputedStyle(document.documentElement).getPropertyValue(hexOrVar);
}