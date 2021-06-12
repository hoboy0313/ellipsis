export const isArray = Array.isArray;

export function forEach<T>(
  obj: T,
  callback: (v: T[keyof T], index: keyof T, thisArg: T) => void,
) {
  if (
    obj === null ||
    typeof obj === 'undefined' ||
    typeof callback !== 'function'
  ) {
    return;
  }

  if (isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      callback(obj[i], i as keyof T, obj);
    }
  } else {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        callback(obj[key], key, obj);
      }
    }
  }
}

export function pxToNumber(value: string): number {
    return parseFloat(value) || 0;
}

export function hyphenate(str: string) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
