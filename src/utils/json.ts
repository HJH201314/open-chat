/*
* 解决Map无法被序列化的问题
* 传入为JSON.stringify()的第二个参数
* */
export const stringifyReplacer = (key: any, value: any) => {
  if (value instanceof Map) {
    return  {
      dataType: 'Map',
      value: Array.from(value.entries()),
    }
  } else {
    return value;
  }
}
/*
* 解决Map无法被反序列化的问题
* 传入为JSON.parse()的第二个参数
* */
export const parseReplacer = (key: any, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  } else {
    return value;
  }
}