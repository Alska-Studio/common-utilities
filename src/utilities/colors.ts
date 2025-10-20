const hex2rgb = (hex: string): number[] => {
  const [, r, rr = 0, g, gg = 0, b, bb = 0] = hex;
  return [+`0x${r}${rr}`, +`0x${g}${gg}`, +`0x${b}${bb}`];
};

export const hex = (hex: string, str: string): string => {
  const [r, g, b] = hex2rgb(hex);
  return rgb(r, g, b, str);
};

export const rgb = (
  ...args:
    | [r: number, g: number, b: number, str: string]
    | [rgb: [r: number, g: number, b: number], str: string]
): string => {
  if (args.length === 2) {
    const [[r, g, b], str] = args;
    return `\x1b[38;2;${r};${g};${b}m${str}\x1b[0m`;
  }
  const [r, g, b, str] = args;
  return `\x1b[38;2;${r};${g};${b}m${str}\x1b[0m`;
};

export const orange = (str: string): string => {
  //return rgb(255, 226, 138, str);
  return hex('#ffe28a', str);
};

export const red = (str: string): string => {
  return rgb(252, 78, 3, str);
};

export const green = (str: string): string => {
  return rgb(122, 240, 96, str);
};

export const softGreen = (str: string): string => {
  return rgb(138, 205, 153, str);
};

export const blue = (str: string): string => {
  return rgb(96, 122, 240, str);
};

export const summerSky = (str: string): string => {
  return rgb(140, 171, 224, str);
};

export const turquoise = (str: string) => {
  return rgb(127,205,238, str);
};

export const brown = (str: string): string => {
  return rgb(240, 122, 96, str);
};

export const white = (str: string): string => {
  return rgb(255, 255, 255, str);
};

export const darkGrey = (str: string): string => {
  return rgb(128, 128, 128, str);
};

export const grey = (str: string): string => {
  return rgb(192, 192, 192, str);
};

export const black = (str: string): string => {
  return rgb(0, 0, 0, str);
};

export const purple = (str: string): string => {
  return rgb(201,151,233,str);
};

export const lightPurple = (str: string): string => {
  return rgb(220, 190, 240, str);
}

export const yellow = (str: string): string => {
  // 255, 226, 138,
  return rgb(255, 226, 138, str);
};

interface ColorJSONParams {
  space: number;
  colors: {
    bracket: [r: number, g: number, b: number];
    comma: [r: number, g: number, b: number];
    key: [r: number, g: number, b: number];
    string: [r: number, g: number, b: number];
    number: [r: number, g: number, b: number];
    boolean: [r: number, g: number, b: number];
    null: [r: number, g: number, b: number];
  };
}

export const json = (
  obj: Record<string, unknown>,
  params?: ColorJSONParams
): string => {
  const {
    space = 2,
    colors = {
      bracket: [230, 240, 255],
      comma: [230, 240, 255],
      key: [204, 224, 252],
      string: [245, 245, 205],
      number: [85, 224, 141],
      boolean: [111, 164, 252],
      null: [250, 250, 250]
    }
  } = params ?? {};
  const pattern =
    /^(?<space>\s*)("(?<key>\w+)":\s(?<value>"?.+"?)?,?)?(?<bracket>[{}])?\n?/gm;

  const transform = (v: string) => {
    if (!Number.isNaN(+v)) {
      return rgb(colors.number, v); // Number
    } else if (v?.startsWith('"')) {
      return rgb(colors.string, v.replace('"', "'")); // String
    } else if (v === 'true' || v === 'false') {
      return rgb(colors.boolean, v); // Boolean
    } else if (v === 'null') {
      return rgb(colors.null, v); // Null
    }
    return '';
  };

  return JSON.stringify(obj, null, space).replace(pattern, (...args) => {
    const { space, bracket, key = '', value } = args.pop();
    return space
      .concat(rgb(colors.key, key))
      .concat(key && rgb(colors.comma, ':') + ' ')
      .concat(value ? `${transform(value)}` : `${rgb(colors.bracket, bracket)}`)
      .concat('\n');
  });
};

const colorMap: Record<string, (str: string) => string> = {
  red,
  green,
  blue,
  purple,
  orange,
  yellow,
  softGreen,
  summerSky,
  turquoise,
  brown,
  white,
  darkGrey,
  grey,
  black,
  lightPurple
};

const tagRegex = /<\/?([a-zA-Z]+|hex:#?[a-fA-F0-9]{3,6}|rgb:\d{1,3},\d{1,3},\d{1,3})>/g;
const hexTag = /^hex:#?([a-fA-F0-9]{3,6})$/;
const rgbTag = /^rgb:(\d{1,3}),(\d{1,3}),(\d{1,3})$/;

export const styledText =
  (baseColor: (str: string) => string = (s) => s, ctx: Record<string, any> = colorMap) =>
  (strings: TemplateStringsArray, ...values: any[]) => {
    const input = strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');

    let output = '';
    let stack: ((str: string) => string)[] = [baseColor];
    let lastIndex = 0;

    for (const match of input.matchAll(tagRegex)) {
      const [tag, tagName] = match;
      const isClosing = tag.startsWith('</');
      const start = match.index!;

      // Add text before tag
      if (start > lastIndex) {
        let text = input.slice(lastIndex, start);
        const topFn = stack[stack.length - 1];
        output += topFn(text);
      }

      if (isClosing) {
        stack.pop(); // pop current
      } else {
        if (hexTag.test(tagName)) {
          const [, hexCode] = tagName.match(hexTag)!;
          stack.push((str) => ctx.hex?.(`#${hexCode}`, str) ?? str);
        } else if (rgbTag.test(tagName)) {
          const [, r, g, b] = tagName.match(rgbTag)!;
          stack.push((str) => ctx.rgb?.(+r, +g, +b, str) ?? str);
        } else if (typeof ctx[tagName] === 'function') {
          stack.push(ctx[tagName]);
        } else {
          output += tag;
        }
      }

      lastIndex = match.index! + tag.length;
    }

    // Remaining text
    if (lastIndex < input.length) {
      const topFn = stack[stack.length - 1];
      output += topFn(input.slice(lastIndex));
    }

    return output + '\x1b[0m'; // final reset
  };
