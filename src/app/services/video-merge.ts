import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Directory, Filesystem } from '@capacitor/filesystem';

import { AyyappaVideoMerger } from 'ayyappavideomerger';
@Injectable({
  providedIn: 'root'
})
export class VideoMerge {

  
constructor() {}

  async merge(videoPath: string, posterPath: string, userName: string, userRole: string): Promise<string> {

    try {

      console.log("🚀 Merge Started", videoPath, posterPath);

      const result = await AyyappaVideoMerger.merge({
        video: videoPath,
        poster: posterPath,
         name: userName, // ఇక్కడ పంపండి
        role: userRole  // ఇక్కడ పంపండి
      });

      console.log("✅ RESULT:", result);

      let outputPath = result.path;

      // FIX: remove file:// safely
      if (outputPath.startsWith("file://")) {
        outputPath = outputPath.replace("file://", "");
      }

      console.log("📁 FINAL PATH:", outputPath);

      return outputPath;

    } catch (err: any) {

      console.error("❌ Merge Error:", err);
      throw new Error(err.message || "Merge failed");
    }
  }

  // OPTIONAL download (fixed)
  async downloadFile(url: string): Promise<string> {

    const response = await Http.downloadFile({
      url,
      filePath: `video_${Date.now()}.mp4`
    });

    console.log("📥 Downloaded Path:", response.path);

    return response.path!;
  }
}