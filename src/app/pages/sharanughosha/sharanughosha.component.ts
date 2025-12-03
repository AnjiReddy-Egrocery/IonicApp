import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Sharanughosha, SharanughoshaModel } from 'src/app/services/sharanughosha';

@Component({
  selector: 'app-sharanughosha',
  templateUrl: './sharanughosha.component.html',
  styleUrls: ['./sharanughosha.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class SharanughoshaComponent  implements OnInit {
   title = '';
  description = '';
  imageUrl = '';
  smallDescription = '';
  linkifiedDescription: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController,private activityService: Sharanughosha,private toastCtrl: ToastController) { }

  async ngOnInit() {
     const activityId = '21';
    
         try {
             const res: SharanughoshaModel = await this.activityService.getActivityById(activityId);
             console.log('✅ API Response:', res);
       
             if (res.errorCode === '200' && res.result.length > 0) {
               const data = res.result[0];
               this.title = data.title;
               this.description = data.description;
               this.imageUrl = `https://www.ayyappatelugu.com/public/assets/img/activity/${data.image}`;
       
               // 🔗 Convert URLs into clickable links
             this.linkifiedDescription = this.description
         .replace(/style="[^"]*"/g, '')   // remove all inline styles
         .replace(/<font[^>]*>/g, '')      // remove <font> tags
         .replace(/<\/font>/g, '')
         .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
             } else {
               console.error('⚠️ Data Error:', res.message);
               const toast = await this.toastCtrl.create({
                 message: 'డేటా లభించలేదు',
                 duration: 2000,
                 color: 'danger',
               });
               toast.present();
             }
           } catch (error) {
             console.error('❌ Request Failed:', error);
             const toast = await this.toastCtrl.create({
               message: 'సర్వర్ సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
               duration: 2000,
               color: 'danger',
             });
             toast.present();
           } finally {
            
           }
         }
       
    
      goToAnadanam() {
        this.navCtrl.navigateForward('/anadanam');
      }
    
      goToNityaPooja() {
        this.navCtrl.navigateForward('/nityapooja');
      }
    
  }
