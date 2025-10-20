export declare const hex: (hex: string, str: string) => string;
export declare const rgb: (...args: [r: number, g: number, b: number, str: string] | [rgb: [r: number, g: number, b: number], str: string]) => string;
export declare const orange: (str: string) => string;
export declare const red: (str: string) => string;
export declare const green: (str: string) => string;
export declare const softGreen: (str: string) => string;
export declare const blue: (str: string) => string;
export declare const summerSky: (str: string) => string;
export declare const turquoise: (str: string) => string;
export declare const brown: (str: string) => string;
export declare const white: (str: string) => string;
export declare const darkGrey: (str: string) => string;
export declare const grey: (str: string) => string;
export declare const black: (str: string) => string;
export declare const purple: (str: string) => string;
export declare const lightPurple: (str: string) => string;
export declare const yellow: (str: string) => string;
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
export declare const json: (obj: Record<string, unknown>, params?: ColorJSONParams) => string;
export declare const styledText: (baseColor?: (str: string) => string, ctx?: Record<string, any>) => (strings: TemplateStringsArray, ...values: any[]) => string;
export {};
