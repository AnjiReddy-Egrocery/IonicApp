import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { BooksDialogComponent } from 'src/app/components/books-dialog/books-dialog.component';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { Bookservices } from 'src/app/services/bookservices';



@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
   standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
    ]
})
export class BooksComponent  implements OnInit {
  bookList:  any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';



  constructor( private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private bookservices: Bookservices) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookservices.getBookList().subscribe(res => {
      this.bookList = res.result;
      this.filteredList = [...this.bookList];
    }, err => {
      console.error(err);
    });
  }

filterResults(event: any) {
  const query = event?.target?.value?.toLowerCase() || '';

  this.filteredList = this.bookList.filter(item => {
    const nameTelugu = item?.name ? item.name.toLowerCase() : '';
    const nameEnglish = item?.name ? this.toEnglishTransliteration(item.name).toLowerCase() : '';

    return nameTelugu.includes(query) || nameEnglish.includes(query);
  });
}

// Null-safe Telugu → English transliteration
toEnglishTransliteration(text: string = ''): string {
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
    if (consonants[ch]) {
      result += consonants[ch] + 'a';
    } else if (vowels[ch]) {
      result += vowels[ch];
    } else if (vowelSigns[ch]) {
      result = result.slice(0, -1) + vowelSigns[ch];
    } else {
      result += ch;
    }
  }
  return result;
}

  refreshList(event: any) {
    this.loadBooks();
    event.target.complete();
  }


  openDetails(book: any) {
    this.router.navigate(['/book-details'], {
      queryParams: {
        Name: book.name,
        Author: book.author,
        Price: book.price,
        Pages: book.pages,
        Published: book.publishedOn,
        Image: book.image
      }
    });
  }

  async openInfo() {
    const modal = await this.modalCtrl.create({
      component: BooksDialogComponent,
      cssClass: 'alert-style-modal',
      backdropDismiss: true,
      showBackdrop: true
    });
    await modal.present();
  }

  goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }

}
