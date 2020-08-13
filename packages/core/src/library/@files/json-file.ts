import {File} from '../file';

import {StructuredFile, StructuredFileOptions} from './structured-file';

export interface JSONFileOptions extends StructuredFileOptions {}

export class JSONFile<TContent> extends StructuredFile<
  TContent | undefined,
  JSONFileOptions
> {
  content: TContent | undefined;

  constructor(path: string, context: File.FileContext) {
    super('json', path, context);
  }

  protected stringify(content: TContent | undefined): string {
    return JSON.stringify(content, undefined, 2);
  }
}
