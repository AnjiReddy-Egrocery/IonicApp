import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-poojapetamdetails',
  templateUrl: './poojapetamdetails.component.html',
  styleUrls: ['./poojapetamdetails.component.scss'],
    standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]

})
export class PoojapetamdetailsComponent  implements OnInit {

  Name: string = '';
  Specialization: string = '';
  GuruName: string = '';
  Number: string = '';
  City: string = '';
  Email: string = '';
  Discription: string = '';
  Image: string = '';
  CityName: string = '';
  linkifiedDescription: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      this.Name = params['Name'];
      this.Specialization = params['Specialization']
      this.GuruName = params[ 'GuruName' ]
      this.Number = params['Number'];
      this.City = params['City'];
      this.Email = params['Email'];
      this.Discription = params['Discription'];
      this.Image = params['Image'];
      this.CityName = params[ 'CityName' ]
       this.Image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/public/assets/img/decorators/' + params['Image'];

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

}
