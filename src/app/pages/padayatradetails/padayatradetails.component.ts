import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-padayatradetails',
  templateUrl: './padayatradetails.component.html',
  styleUrls: ['./padayatradetails.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class PadayatradetailsComponent  implements OnInit {
  name = '';
  description = '';
  image = '';
  linkifiedDescription: string = '';

  

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      console.log("PadayatraDetails Opened");
      console.log("All Params:", params);
        console.log("Received Image:", params['Image']);

        this.name = params['Name'];
        this.description = params['Discription'];

        const img = params['Image'];

        this.image = img
          ? `https://www.ayyappatelugu.com/public/assets/uploads/padayatrabrundams/${img}`
          : '';

        console.log("Final Image URL:", this.image);
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






}