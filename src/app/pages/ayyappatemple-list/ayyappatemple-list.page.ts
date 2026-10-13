import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Templelist } from 'src/app/services/templelist';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';

@Component({
  selector: 'app-ayyappatemples-list',
  templateUrl: './ayyappatemple-list.page.html',
  styleUrls: ['./ayyappatemple-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,PinchZoomComponent]
})
export class AyyappatempleListPage implements OnInit {
 templeList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';
  constructor(private router: Router, private service: Templelist, private modalCtrl: ModalController, private menu: MenuController) { }

  ngOnInit() {
     this.loadTempleList();
  }

   async loadTempleList() {
    console.log("📌 Loading temple list...");

  try {
    const res = await this.service.getTempleList();

    if (res.status === "Success" && res.result) {
      this.templeList = res.result;
      this.filteredList = [...this.templeList];
      console.log("Temple List Loaded:", this.templeList);
    } else {
      console.warn("⚠️ No temple data found", res);
    }
  } catch (err) {
    console.error("❌ Error loading temples:", err);
  }

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
  this.router.navigate(['/ayyappatemplelistdetails'], {
    queryParams: {
      templeId: item.templeId,
      templeName: item.templeName,
      image: item.image,
      templeNameTelugu: item.templeNameTelugu,
      openingTime: item.openingTime,
      closingTime: item.closingTime,
      location: item.location,

    }
  });
}

 onImageError(event: any) {
  event.target.src = '../../../assets/ayyapaimage.jpeg'; // fallback static image
}


}
