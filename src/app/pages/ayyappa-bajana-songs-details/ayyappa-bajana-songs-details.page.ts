import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ayyappa-bajana-songs-details',
  templateUrl: './ayyappa-bajana-songs-details.page.html',
  styleUrls: ['./ayyappa-bajana-songs-details.page.scss'],
  standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
    ]
})
export class AyyappaBajanaSongsDetailsPage implements OnInit {
songTitle: string = '';
  singerName: string = '';
  writerName: string = '';
 
  songDescription: string = '';
  
  linkifiedDescription: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.songTitle = params['songTitle'];
      this.singerName = params[ 'singerName' ]
      this.writerName = params['writerName'];
     
      this.songDescription = params['songDescription'];
   

          this.linkifiedDescription = this.songDescription.replace(
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


}

