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
      this.name = params['Name'];
      this.description = params['Discription'];
      this.image = params['Image'];
       this.image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/public/assets/img/padayatrabrundams/' + params['Image'];

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