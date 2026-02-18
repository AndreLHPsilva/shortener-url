const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function convertToBase(num: bigint, chars: string = BASE62_CHARS): string {
  if (num === 0n) {
    return chars[0];
  }


  const base = BigInt(chars.length);
  let result = '';
  let tempNum = num;

  while (tempNum > 0n) {
    const remainder = tempNum % base;
    result = chars[Number(remainder)] + result;
    tempNum = tempNum / base;
  }
  console.log(num, result)

  return result;
}

export function convertFromBase(str: string, chars: string = BASE62_CHARS): bigint {
  const base = BigInt(chars.length);
  let result = 0n;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = chars.indexOf(char);
    if (value === -1) {
      throw new Error(`Caractere inválido '${char}' para a base especificada.`);
    }
    result = result * base + BigInt(value);
  }

  return result;
}
