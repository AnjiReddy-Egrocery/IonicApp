import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AyyappaKrayakramamDetailsResponse, AyyappakrayakramamService } from 'src/app/services/ayyappakrayakramam-service';


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

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router,
    private service: AyyappakrayakramamService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      console.log(params); // Debug
      
       console.log('activitiesId:',params['activitiesId']);
      // this.title = params['title'] || '';
      // // Ensure full URL
      // this.image = params['image']?.startsWith('http') 
      //   ? params['image'] 
      //   : 'https://www.ayyappatelugu.com/public/assets/activity/' + params['image'];
      // this.description = this.sanitizer.bypassSecurityTrustHtml(params['description'] || '');
      const activitiesId = params['activitiesId'];
      if(activitiesId){
      
              const response:
              AyyappaKrayakramamDetailsResponse =
      
              await this.service
              .getKaryakaramDetails(
                activitiesId
              );
      
              if(
                response.result &&
                response.result.length > 0
              ){
      
                const activities =
                  response.result[0];
      
               this.title = activities.title || '';
      
               this.description = this.sanitizer.bypassSecurityTrustHtml(
                    activities.description || ''
                  );
      
               this.image =
                      activities.image?.startsWith('http')
                        ? activities.image
                        : 'https://www.ayyappatelugu.com/public/assets/activity/' +
                          activities.image;
                    console.log('FINAL IMAGE:', this.image);
                       
                    this.cdr.detectChanges();
      
                    console.log('NAME:', this.title);
      
                      console.log('IMAGE:', this.image);
      
                      console.log('DESCRIPTION:', this.description);
      
              }
      
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
