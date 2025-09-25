import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class ProductsDetailsComponent  implements OnInit {
   name: string = '';
    Discription: string = '';
    image: string = '';
    linkifiedDescription: string = '';
    qty: number = 1;
     price: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }
 
    ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['Name'];
      this.Discription = params['Discription'];
      this.image = params['Image'];
      this.price = params['Price'];
       this.image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/assets/productimages/' + params['Image'];

        this.linkifiedDescription = this.Discription.replace(
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

  increaseQty() {
  this.qty++;
}

decreaseQty() {
  if (this.qty > 1) {
    this.qty--;
  }
}
}

