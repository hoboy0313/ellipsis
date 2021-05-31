export const isArray = Array.isArray;

export function forEach<T>(arr: T[], callback: (v: T, index: number, thisArg: T[]) => void): void;
// @todo how to declaring `v` to `T[k]`
export function forEach<T>(obj: T, callback: (v: any, index: keyof T | string, thisArg: T) => void): void;

export function forEach<T>(obj: any, callback: any) {
    if (obj === null || typeof obj === 'undefined' || typeof callback !== 'function') {
        return;
    }

    if (isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            callback(obj[i] as T, i as number, obj as T[]);
        }
    } else {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                callback(obj[key], key as keyof T, obj);
            }
        }
    }
}

export function pxToNumber(value: string): number {
    return parseFloat(value) || 0;
}
