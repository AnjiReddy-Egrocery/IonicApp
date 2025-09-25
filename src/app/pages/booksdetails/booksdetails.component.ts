import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-booksdetails',
  templateUrl: './booksdetails.component.html',
  styleUrls: ['./booksdetails.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class BooksdetailsComponent  implements OnInit {
   name: string = '';
  author: string = '';
  price: string = '';
  pages: string = '';
  published: string = '';
  image: string = '';
  qty: number = 1;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

   ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['Name'];
      this.author = params['Author'];
      this.price = params['Price'];
      this.pages = params['Pages'];
      this.published = params['Published'];
      this.image = params['Image'];

       this.image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/assets/bookimage/' + params['Image'];

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
