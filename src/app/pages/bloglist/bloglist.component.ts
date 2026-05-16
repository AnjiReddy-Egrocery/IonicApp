import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { BloglistcomponentComponent } from 'src/app/components/bloglistcomponent/bloglistcomponent.component';
import { Bloglist } from 'src/app/services/bloglist';

@Component({
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.scss'],
   standalone: true,
    imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class BloglistComponent  implements OnInit {
 blogList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: Bloglist, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController, private menu: MenuController) {}


   ngOnInit() {
    this.loadBlogList();
  }

  async loadBlogList() {
  try {
    const res = await this.service.getBlogList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.blogList = res.result || [];
    this.filteredList = [...this.blogList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

  filterResults(event: any) {
    const query = (event.target.value || '').toLowerCase();

    this.filteredList = this.blogList.filter(item => {
      const nameTelugu = (item.title || '').toLowerCase();
     
      const nameEnglish = this.toEnglishTransliteration(item.title || '').toLowerCase();
    

      return nameTelugu.includes(query) ||
            
             nameEnglish.includes(query) ;
             
    });
  }

  // ✅ Telugu → English transliteration
  toEnglishTransliteration(text: string): string {
    const consonants: any = {
      'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng',
      'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
      'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
      'త': 't', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
      'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm',
      'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v', 'శ': 'sh',
      'ష': 'sh', 'స': 's', 'హ': 'h', 'ళ': 'l', 'ఱ': 'r'
    };

    const vowels: any = {
      'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ii', 'ఉ': 'u', 'ఊ': 'uu',
      'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ee', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo', 'ఔ': 'au',
      'ం': 'm', 'ః': 'h'
    };

    const vowelSigns: any = {
      'ా': 'aa', 'ి': 'i', 'ీ': 'ii', 'ు': 'u', 'ూ': 'uu',
      'ె': 'e', 'ే': 'ee', 'ై': 'ai', 'ొ': 'o', 'ో': 'oo', 'ౌ': 'au', '్': ''
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
    this.loadBlogList();
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
      component: BloglistcomponentComponent,
      cssClass: 'alert-style-modal',
      backdropDismiss: true,
      showBackdrop: true
    });
    await modal.present();
  }

  openDetails(blog: any) {
    this.router.navigate(['/blog_details'], {
      queryParams: {
        Name: blog.title,          
          Discription: blog.description,
          Image: blog.image
      }
    });
  }

  closeMenu() {
    this.menu.close('first');
  }

  goBack() {
  this.router.navigate(['/home']);
}
}