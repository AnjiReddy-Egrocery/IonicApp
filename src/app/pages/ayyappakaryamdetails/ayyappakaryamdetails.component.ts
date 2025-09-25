import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-ayyappakaryamdetails',
  templateUrl: './ayyappakaryamdetails.component.html',
  styleUrls: ['./ayyappakaryamdetails.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})

export class AyyappakaryamdetailsComponent  implements OnInit {

   title: string = '';
  image: string = '';
  description: SafeHtml = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params); // Debug
      this.title = params['title'] || '';
      // Ensure full URL
      this.image = params['image']?.startsWith('http') 
        ? params['image'] 
        : 'https://www.ayyappatelugu.com/assets/activity/' + params['image'];
      this.description = this.sanitizer.bypassSecurityTrustHtml(params['description'] || '');
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
