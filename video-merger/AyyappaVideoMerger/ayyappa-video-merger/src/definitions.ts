export interface AyyappaVideoMergerPlugin {

  merge(options: {
    video: string;
    poster: string;
  }): Promise<{
    path: string;
  }>;

}
