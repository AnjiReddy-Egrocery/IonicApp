import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { Products } from 'src/app/services/products';
import { ProductsDetailsComponent } from '../products-details/products-details.component';
import { ProductsDialogComponent } from 'src/app/components/products-dialog/products-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class ProductsComponent  implements OnInit {
   productList: any[] = [];
   filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: Products, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController, private menu: MenuController) { }

  ngOnInit() {
     this.loadProducts();
  }

   async loadProducts() {
     

       try {
    const res = await this.service.getProductList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.productList = res.result || [];
    this.filteredList = [...this.productList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
    }
  
    filterResults(event: any) {
      const query = event.target.value ? event.target.value.toLowerCase() : '';
  
      this.filteredList = this.productList.filter(item => {
        const nameTelugu = item.name.toLowerCase();
       
        const nameEnglish = this.toEnglishTransliteration(item.name).toLowerCase();
       
  
        return nameTelugu.includes(query) ||
              
               nameEnglish.includes(query) ;
              
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
      this.loadProducts();
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
        component: ProductsDialogComponent,
        cssClass: 'alert-style-modal',
        backdropDismiss: true,
        showBackdrop: true
      });
      await modal.present();
    }
  
    openDetails(product: any) {
    // 👉 Option 1: Navigate to another page with query params
    this.router.navigate(['/product_details'], { 
      queryParams: { 
        Name: product.name,
        Price: product.price,
        Discription: product.description,
        Image: product.image
      } 
    });
  }


}
