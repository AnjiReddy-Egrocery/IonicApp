import { TestBed } from '@angular/core/testing';

import { VideoMerge } from './video-merge';

describe('VideoMerge', () => {
  let service: VideoMerge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoMerge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
