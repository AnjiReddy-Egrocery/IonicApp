import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-viewallnewdetails',
  templateUrl: './viewallnewdetails.component.html',
  styleUrls: ['./viewallnewdetails.component.scss'],
     standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class ViewallnewdetailsComponent  implements OnInit {

   name = '';
  description = '';
  image = '';
  linkifiedDescription: string = '';

  isPlaying = false;
  isPaused = false;
  textChunks: string[] = [];
  currentChunkIndex = 0;
  currentOffset = 0; // character index inside current chunk

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      this.name = params['Name'];
      this.description = params['Discription'];
      this.image = params['Image'];
       this.image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/assets/news_images/' + params['Image'];

          this.linkifiedDescription = this.description.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
    );
    });
  }

    navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }
    goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }

sanitizeDescription(desc: string): string {
  // HTML tags తొలగించు
  const plainText = desc.replace(/<[^>]+>/g, ''); 
  return plainText;
}

async prepareChunks() {
  const fullText = this.sanitizeDescription(this.description); // ✅ clean text
  this.textChunks = fullText.split(/(?<=[.!?])\s+/);
  this.currentChunkIndex = 0;
}

async speakNextChunk() {
  if (this.textChunks.length > 0 && this.currentChunkIndex < this.textChunks.length) {
    const chunk = this.textChunks[this.currentChunkIndex];

    await TextToSpeech.speak({
      text: chunk,
      lang: 'te-IN',
      rate: 1.0,
      pitch: 1.0
    });

    this.currentChunkIndex++;
    if (this.isPlaying && !this.isPaused && this.currentChunkIndex < this.textChunks.length) {
      this.speakNextChunk();
    } else {
      this.isPlaying = false;
    }
  }
}
async togglePlay() {
  if (this.isPlaying && !this.isPaused) {
    await TextToSpeech.stop();
    this.isPaused = true;
  } else if (this.isPaused) {
    this.isPaused = false;
    this.isPlaying = true;
    this.speakNextChunk();
  } else {
    if (this.textChunks.length === 0) this.prepareChunks();
    this.isPlaying = true;
    this.isPaused = false;
    this.speakNextChunk();
  }
}

async replay() {
  await TextToSpeech.stop();
  this.prepareChunks();
  this.isPlaying = true;
  this.isPaused = false;
  this.speakNextChunk();
}

viewMoreNews() {
  // Navigate to the full news list or another page
 this.router.navigateByUrl('/view-all-news');
}
}