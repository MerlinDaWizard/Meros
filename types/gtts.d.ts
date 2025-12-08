declare module 'gtts' {
  export default class GTTS {
    constructor(text: string, lang?: string);
    save(filename: string, cb?: (err?: any) => void): void;
    stream(): NodeJS.ReadableStream;
  }
}
