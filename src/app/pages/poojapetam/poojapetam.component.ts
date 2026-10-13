import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';
import { PoojapetamDialogComponent } from 'src/app/components/poojapetam-dialog/poojapetam-dialog.component';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { Poojapetam } from 'src/app/services/poojapetam';

@Component({
  selector: 'app-poojapetam',
  templateUrl: './poojapetam.component.html',
  styleUrls: ['./poojapetam.component.scss'],
    standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
    PinchZoomComponent
  ]
})
export class PoojapetamComponent  implements OnInit {
  decoratorsList: any[] = [];
   filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: Poojapetam, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController) {}


  ngOnInit() {
    this.loadPoojaPetam();
  }

  async loadPoojaPetam() {
   
    try {
    const res = await this.service.getDecoratorsList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.decoratorsList = res.result || [];
    this.filteredList = [...this.decoratorsList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
  }

  filterResults(event: any) {
    const query = event.target.value ? event.target.value.toLowerCase() : '';

    this.filteredList = this.decoratorsList.filter(item => {
      const nameTelugu = item.decoratorName.toLowerCase();
      const cityTelugu = item.cityName.toLowerCase();
      const nameEnglish = this.toEnglishTransliteration(item.decoratorName).toLowerCase();
      const cityEnglish = this.toEnglishTransliteration(item.cityName).toLowerCase();

      return nameTelugu.includes(query) ||
             cityTelugu.includes(query) ||
             nameEnglish.includes(query) ||
             cityEnglish.includes(query);
    });
  }

  // Full Telugu → English transliteration
  toEnglishTransliteration(text: string): string {
    const consonants: any = {
      'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ng',
      'చ':'ch','ఛ':'chh','జ':'j','ఝ':'jh','ఞ':'ny',
      'ట':'t','ఠ':'th','డ':'d','ఢ':'dh','ణ':'n',
      'త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
      'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m',
      'య':'y','ర':'r','ల':'l','వ':'v','శ':'sh',
      'ష':'sh','స':'s','హ':'h','ళ':'l','ఱ':'r'
    };

    const vowels: any = {
      'అ':'a','ఆ':'aa','ఇ':'i','ఈ':'ii','ఉ':'u','ఊ':'uu',
      'ఋ':'ru','ఎ':'e','ఏ':'ee','ఐ':'ai','ఒ':'o','ఓ':'oo','ఔ':'au',
      'ం':'m','ః':'h'
    };

    const vowelSigns: any = {
      'ా':'aa','ి':'i','ీ':'ii','ు':'u','ూ':'uu',
      'ె':'e','ే':'ee','ై':'ai','ొ':'o','ో':'oo','ౌ':'au',
      '్':'' // virama removes implicit 'a'
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (consonants[ch]) result += consonants[ch] + 'a';
      else if (vowels[ch]) result += vowels[ch];
      else if (vowelSigns[ch]) result = result.slice(0, -1) + vowelSigns[ch];
      else result += ch;
    }
    return result;
  }

  refreshList(event: any) {
    this.loadPoojaPetam();
    event.target.complete();
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
  async openInfo() {
    const modal = await this.modalCtrl.create({
      component: PoojapetamDialogComponent,
      cssClass: 'alert-style-modal',
      backdropDismiss: true,
      showBackdrop: true
    });
    await modal.present();
  }

  openDetails(poojapetam: any) {
  // 👉 Option 1: Navigate to another page with query params
  this.router.navigate(['/poojapetam_details'], { 
    queryParams: { 
      Name: poojapetam.decoratorName,
      GuruName: poojapetam.fullName,
      Number: poojapetam.mobileNumber,
      City: poojapetam.villageName,
      CityName: poojapetam.cityName,
      Email: poojapetam.emailId,
      Specialization : poojapetam.specialization,
      Discription: poojapetam.decoratorDescription,
      Image: poojapetam.profilePic
    } 
  });
}

}
