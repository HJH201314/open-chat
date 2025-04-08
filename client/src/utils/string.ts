export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
export function getRandomString(length: number) {
  return generateRandomString(length);
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getStatString(value: number) {
  if (value < 10000) return value;
  else {
    let v = (value / 10000).toFixed(1);
    if (v.endsWith('.0')) {
      v = v.replace('.0', '');
    }
    return `${v}万`;
  }
}

/**
 * 格式化时间
 * @param date 时间对象或时间字符串
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: Date | string): string {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // 检查是否为当天
  if (
    inputDate.getDate() === now.getDate() &&
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getFullYear() === now.getFullYear()
  ) {
    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes();
    const period = hours < 12 ? '上午' : '下午';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${period} ${formattedHours}:${formattedMinutes}`;
  }

  // 检查是否为本周内（周一为第一天）
  const nowDayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 将周日转换为7
  const inputDayOfWeek = inputDate.getDay() === 0 ? 7 : inputDate.getDay();
  const diffDays = Math.floor((now.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < nowDayOfWeek && diffDays >= 0) {
    const weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    return weekdays[inputDayOfWeek - 1];
  }

  // 检查是否为同一年
  if (inputDate.getFullYear() === now.getFullYear()) {
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}`;
  }

  // 其他年份
  const year = inputDate.getFullYear().toString().slice(-2);
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();
  return `${year}/${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}`;
}
