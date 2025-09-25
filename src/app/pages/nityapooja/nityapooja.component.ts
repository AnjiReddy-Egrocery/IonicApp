import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Nityapooja, NityaPoojaModel } from 'src/app/services/nityapooja';

@Component({
  selector: 'app-nityapooja',
  templateUrl: './nityapooja.component.html',
  styleUrls: ['./nityapooja.component.scss'],
  standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class NityapoojaComponent  implements OnInit {

  title = '';
  description = '';
  imageUrl = '';
  linkifiedDescription: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController,private activityService: Nityapooja) {}

  ngOnInit() {

   const activityId = '29';

    this.activityService.getActivityById(activityId).subscribe(
      (res: NityaPoojaModel) => {
        if (res.errorCode === '200' && res.result.length > 0) {
          this.title = res.result[0].title;
          this.description = res.result[0].description;
          this.imageUrl = `https://www.ayyappatelugu.com/assets/activity/${res.result[0].image}`;

        this.linkifiedDescription = this.description
            .replace(/<\/?strong>/g, '')  // Remove <strong> tags
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            
        } else {
          console.error('Data Error', res.message);
        }
      },
      (err) => {
        console.error('Request Failed', err);
      }
    );
  } 

  goToAnadanam() {
    this.navCtrl.navigateForward('/anadanam');
  }

  goToNityaPooja() {
    this.navCtrl.navigateForward('/nityapooja');
  }

  openInfo() {
    // Implement modal or popup info
  }

}
