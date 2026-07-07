import { registerPlugin } from '@capacitor/core';

import type { AyyappaVideoMergerPlugin } from './definitions';

const AyyappaVideoMerger = registerPlugin<AyyappaVideoMergerPlugin>(
  'AyyappaVideoMerger'
);

export * from './definitions';

export { AyyappaVideoMerger };