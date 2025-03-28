export const checkFormValidateResult = (res: any) => {
  if (typeof res === 'object') {
    for (const key in res) {
      if (res[key] && res[key].length > 0) {
        for (const item of res[key]) {
          if (item.result === false) {
            return false;
          }
        }
      }
    }
  }
  return true;
};
