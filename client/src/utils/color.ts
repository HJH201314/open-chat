import tinycolor from 'tinycolor2';

//得到hex颜色值为color的加深颜色值，level为加深的程度，限0-1之间
export function getDarkerColor(color: string, level: number) {
  return tinycolor.mix(color, '#000', level * 100).toHexString();
}

//得到hex颜色值为color的减淡颜色值，level为减浅的程度，限0-1之间
export function getLighterColor(color: string, level: number) {
  return tinycolor.mix(color, '#fff', level * 100).toHexString();
}

export function getAutoDeltaColor(color: string, level: number) {
  const colorObj = tinycolor(color);
  if (colorObj.isDark()) {
    return getLighterColor(color, level);
  } else {
    return getDarkerColor(color, level);
  }
}

/**
 * 获取颜色变量对应的 hex 颜色值
 * @param hexOrVar hex 颜色值或颜色变量
 * @return hex 颜色值；如果输入值不是颜色变量，则返回空
 */
export function getColorHex(hexOrVar?: string) {
  if (!hexOrVar) return '';
  if (hexOrVar.startsWith('#')) return hexOrVar;
  hexOrVar = hexOrVar.replace('var(', '').replace(')', '');
  return getComputedStyle(document.documentElement).getPropertyValue(hexOrVar);
}
