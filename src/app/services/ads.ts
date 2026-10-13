import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';

export interface AdItem {
  image: string;
  adimageUrl: string;
}

export interface AdsResponse {
  errorCode: string;
  imageUrl: string;      // base url for images
  result: AdItem[];
}

export interface BannerItem {
  image: string;
  title?: string;
  description?: string;
  buttonText1?: string;
  buttonUrl1?: string;
  buttonText2?: string;
  buttonUrl2?: string;
}

export interface BannerResponse {
  errorCode: string;
  imageUrl: string;      // base url for images
  result: BannerItem[];
}

/** Save as: src/app/services/ads.ts  (ads + hero banners) */
@Injectable({ providedIn: 'root' })
export class Ads {
  private readonly base = 'https://www.ayyappatelugu.com/';

  // CapacitorHttp = native http on device (no CORS issue), falls back to fetch on web
  private async get<T>(path: string): Promise<T> {
    const res = await CapacitorHttp.get({ url: this.base + path });
    return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  }

  getAdImages(): Promise<AdsResponse> {
    return this.get<AdsResponse>('APICalls/ad-images');
  }

  getBannerImages(): Promise<BannerResponse> {
    return this.get<BannerResponse>('APICalls/banner-images');
  }
}
