import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Anadanam, anadanamDetailsResponse } from 'src/app/services/anadanam';

@Component({
  selector: 'app-anadanamdetails',
  templateUrl: './anadanamdetails.component.html',
  styleUrls: ['./anadanamdetails.component.scss'],
   standalone: true,
   imports: [     
     IonicModule,      // ✅ required for all ion-* components
     FormsModule,      // ✅ required for [(ngModel)]
     CommonModule,
   ]
})
export class AnadanamdetailsComponent  implements OnInit {

  templeName = '';
  templeNameTelugu = '';
  openingTime = '';
  closingTime = '';
  location = '';
  
  image  = '';

  linkifiedDescription: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, 
    private router: Router,private service: Anadanam , private cdr: ChangeDetectorRef ) { }

  ngOnInit() {

  this.route.queryParams.subscribe(async params => {

    console.log('Received Params:', params);

    const annadhanamId = params['annadhanamId'];

    console.log('annadhanamId:', annadhanamId);

    if (!annadhanamId) {
      console.error('No annadhanamId found');
      return;
    }

    try {

      const response: anadanamDetailsResponse =
        await this.service.getAnadanamDetails(
          annadhanamId
        );

      console.log('DETAIL RESPONSE:', response);

      if (
        response?.result &&
        response.result.length > 0
      ) {

        const anadanam = response.result[0];

        this.templeName =
          anadanam.annadhanamName || '';

        this.templeNameTelugu =
          anadanam.annadhanamNameTelugu || '';

        // ✅ FIX HERE
        this.openingTime =
          anadanam.startTime || '';

        this.closingTime =
          anadanam.endTime || '';

        this.location =
          anadanam.location || '';

        this.linkifiedDescription =
          this.location.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
          );

        this.image =
          anadanam.image?.startsWith('http')
            ? anadanam.image
            : 'https://www.ayyappatelugu.com/public/assets/annadhanam_images/'
              + anadanam.image;

        console.log('NAME:', this.templeName);
        console.log('OPEN:', this.openingTime);
        console.log('CLOSE:', this.closingTime);

        this.cdr.detectChanges();

      }

    } catch (error) {

      console.error(
        'DETAIL API ERROR:',
        error
      );

    }

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
