import { WebPlugin } from '@capacitor/core';

import type { AyyappaVideoMergerPlugin } from './definitions';

export class AyyappaVideoMergerWeb extends WebPlugin implements AyyappaVideoMergerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
