import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bajanamandalidetails',
  templateUrl: './bajanamandalidetails.component.html',
  styleUrls: ['./bajanamandalidetails.component.scss'],
  standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class BajanamandalidetailsComponent  implements OnInit {

  Name: string = '';
  GuruName: string = '';
  Number: string = '';
  City: string = '';
  Email: string = '';
  Discription: string = '';
  Image: string = '';
  linkifiedDescription: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.Name = params['Name'];
      this.GuruName = params[ 'GuruName' ]
      this.Number = params['Number'];
      this.City = params['City'];
      this.Email = params['Email'];
      this.Discription = params['Discription'];
      this.Image = params['Image'];
       this.Image = params['Image']?.startsWith('http') 
        ? params['Image'] 
        : 'https://www.ayyappatelugu.com/assets/user_images/' + params['Image'];

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
