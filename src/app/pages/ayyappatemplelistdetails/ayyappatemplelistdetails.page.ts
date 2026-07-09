import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { templeDetailsResponse, Templelist } from 'src/app/services/templelist';

@Component({
  selector: 'app-ayyappatemplelistdetails',
  templateUrl: './ayyappatemplelistdetails.page.html',
  styleUrls: ['./ayyappatemplelistdetails.page.scss'],
   standalone: true,
   imports: [     
     IonicModule,      // ✅ required for all ion-* components
     FormsModule,      // ✅ required for [(ngModel)]
     CommonModule,
   ]
 
})
export class AyyappatemplelistdetailsPage implements OnInit {

  templeName = '';
  templeNameTelugu = '';
  openingTime = '';
  closingTime = '';
  location = '';
  
  image  = '';

  linkifiedDescription: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, 
    private router: Router,private service: Templelist , private cdr: ChangeDetectorRef ) { }

  ngOnInit() {
     this.route.queryParams.subscribe(async params => {

      console.log("Received Params:", params);
      console.log('templeId:',params['templeId']);
      this.templeName = params['templeName'];
      this.templeNameTelugu = params['templeNameTelugu']
      this.openingTime = params[ 'openingTime' ]
      this.closingTime = params['closingTime'];
      this.image = params['image'];
     this.location = params['location'];
       this.image = params['image']?.startsWith('http') 
        ? params['image'] 
        : 'https://www.ayyappatelugu.com/public/assets/img/temple_images/' + params['image'];

        this.linkifiedDescription = this.location.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
                );

       const templeId = params['templeId'];
          if(templeId){
          
                  const response:
                  templeDetailsResponse =
          
                  await this.service
                  .gettempleDetails(
                    templeId
                  );
          
                  if(
                    response.result &&
                    response.result.length > 0
                  ){
          
                    const temples =
                      response.result[0];

                  this.templeName = temples.templeName || '';
                  this.templeNameTelugu = temples.templeNameTelugu || '';
                  this.openingTime = temples.openingTime || '';
                  this.closingTime = temples.closingTime || '';
                  this.location = temples.location || '';
                  
                  this.linkifiedDescription = this.location.replace(
                          /(https?:\/\/[^\s]+)/g,
                          '<a href="$1" target="_blank">$1</a>'
                              );
          
                   this.image =
                          temples.image?.startsWith('http')
                            ? temples.image
                            : 'https://www.ayyappatelugu.com/public/assets/img/temple_images/' +
                              temples.image;
                        console.log('FINAL IMAGE:', this.image);
                           
                        this.cdr.detectChanges();


                         console.log('NAME:', this.templeName);
      
                    
                       
          
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
