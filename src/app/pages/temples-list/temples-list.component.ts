import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { Templelist } from 'src/app/services/templelist';

@Component({
  selector: 'app-temples-list',
  templateUrl: './temples-list.component.html',
  styleUrls: ['./temples-list.component.scss'],
   standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule      
    ]
})
export class TemplesListComponent  implements OnInit {
  templeList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';
  constructor(private router: Router, private service: Templelist, private modalCtrl: ModalController, private menu: MenuController) { }

  ngOnInit() {
     this.loadTempleList();
  }

   loadTempleList() {
    this.service.getTempleList().subscribe(res => {
      this.templeList = res.result;
      this.filteredList = [...this.templeList];
    }, err => {
      console.error(err);
    });
  }

 filterResults(event: any) {
  const query = event.target.value ? event.target.value.toLowerCase() : '';

  this.filteredList = this.templeList.filter(item => {
    const titleTelugu = item.templeName.toLowerCase();
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
    this.loadTempleList();
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

}
