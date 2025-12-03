import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-guruswamidetails',
  templateUrl: './guruswamidetails.component.html',
  styleUrls: ['./guruswamidetails.component.scss'],
  standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class GuruswamidetailsComponent  implements OnInit {

    name: string = '';
  number: string = '';
  temple: string = '';
  city: string = '';
  image: string = '';

  selectedTab: string = 'వివరణ'; // default tab

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['Name'];
      this.number = params['Number'];
      this.temple = params['Temple'];
      this.city = params['City'];
      this.image = params['Image'];
      
      this.image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/public/assets/user_images/' + params['Image'];
    });
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
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
