import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { AyyappakrayakramamService } from 'src/app/services/ayyappakrayakramam-service';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';

@Component({
  selector: 'app-ayyappakaryam',
  templateUrl: './ayyappakaryam.component.html',
  styleUrls: ['./ayyappakaryam.component.scss'],
  standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class AyyappakaryamComponent{

  karyakaramamList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private router: Router, private service: AyyappakrayakramamService, private modalCtrl: ModalController, private menu: MenuController) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
   
    
  try {
    const res = await this.service.getKaryakaramamList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.karyakaramamList = res.result || [];
    this.filteredList = [...this.karyakaramamList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
  }

 filterResults(event: any) {
  const query = event.target.value ? event.target.value.toLowerCase() : '';

  this.filteredList = this.karyakaramamList.filter(item => {
    const titleTelugu = item.title.toLowerCase();
    const titleEnglish = this.toEnglishTransliteration(item.title).toLowerCase();

    return titleTelugu.includes(query) || titleEnglish.includes(query);
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
    if (consonants[ch]) result += consonants[ch] + 'a'; // implicit 'a'
    else if (vowels[ch]) result += vowels[ch];
    else if (vowelSigns[ch]) result = result.slice(0, -1) + vowelSigns[ch]; // replace implicit 'a'
    else result += ch; // punctuation / space
  }
  return result;
}

  refreshList(event: any) {
    this.loadData();
    event.target.complete();
  }

  openDetails(item: any) {
  this.router.navigate(['/karyakaram-details'], {
    queryParams: {
      title: item.title,
      image: item.image,
      description: item.description
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
      async openInfoDialog() {
          const modal = await this.modalCtrl.create({
            component: InfoDialogComponent,
            cssClass: 'alert-style-modal',   // ✅ must match exactly
            backdropDismiss: true,
            showBackdrop: true
          });
          await modal.present();
        }

 
  closeMenu() {
    this.menu.close('first');   // menuId=first close అవుతుంది
  }
}