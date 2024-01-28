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