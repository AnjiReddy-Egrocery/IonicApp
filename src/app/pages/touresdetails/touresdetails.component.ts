import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-touresdetails',
  templateUrl: './touresdetails.component.html',
  styleUrls: ['./touresdetails.component.scss'],
     standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class TouresdetailsComponent  implements OnInit {

  name: string = '';
  days: string = '';
  devotees: string = '';
  amount: string = '';
  image: string = '';

  

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
      this.days = params['days'];
      this.devotees = params['devotees'];
      this.amount = params['amount'];
      this.image = params['image'];

       this.image = params['image']?.startsWith('http') 
        ? params['image'] 
        : 'https://www.ayyappatelugu.com/public/assets/img/tourpackage/' + params['image'];

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
