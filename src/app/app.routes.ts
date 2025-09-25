import { Routes } from "@angular/router";
import { HomePage } from "./home/home.page";
import { LoginPage } from "./pages/login/login.component";
import { RegisterPage } from "./pages/register/register.component";
import { DashboardPage } from "./pages/dashboard/dashboard.component";
import { AyyappakaryamComponent } from "./pages/ayyappakaryam/ayyappakaryam.component";
import { NityapoojaComponent } from "./pages/nityapooja/nityapooja.component";
import { AyyappakaryamdetailsComponent } from "./pages/ayyappakaryamdetails/ayyappakaryamdetails.component";
import { GuruSwamiListComponent } from "./pages/guru-swami-list/guru-swami-list.component";
import { GuruswamidetailsComponent } from "./pages/guruswamidetails/guruswamidetails.component";
import { AboutUsComponent } from "./pages/about-us/about-us.component";
import { PrivacypolicyComponent } from "./pages/privacypolicy/privacypolicy.component";
import { BajanamandalilistComponent } from "./pages/bajanamandalilist/bajanamandalilist.component";
import { BajanamandalidetailsComponent } from "./pages/bajanamandalidetails/bajanamandalidetails.component";
import { AnadanamtemplesComponent } from "./pages/anadanamtemples/anadanamtemples.component";
import { CalenderComponent } from "./pages/calender/calender.component";
import { BooksComponent } from "./pages/books/books.component";
import { BooksdetailsComponent } from "./pages/booksdetails/booksdetails.component";
import { TourespageComponent } from "./pages/tourespage/tourespage.component";
import { TouresdetailsComponent } from "./pages/touresdetails/touresdetails.component";
import { PoojapetamComponent } from "./pages/poojapetam/poojapetam.component";
import { PoojapetamdetailsComponent } from "./pages/poojapetamdetails/poojapetamdetails.component";
import { ProductsComponent } from "./pages/products/products.component";
import { ProductsDetailsComponent } from "./pages/products-details/products-details.component";
import { SharanughoshaComponent } from "./pages/sharanughosha/sharanughosha.component";
import { ViewAllNewsComponent } from "./pages/view-all-news/view-all-news.component";
import { ViewallnewdetailsComponent } from "./pages/viewallnewdetails/viewallnewdetails.component";
import { TemplesComponent } from "./pages/temples/temples.component";
import { AyyappatemplesComponent } from "./pages/ayyappatemples/ayyappatemples.component";


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Start at login by default
  { path: 'home', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', component: DashboardPage},
  { path: 'poojakrayakramam', component: AyyappakaryamComponent},
  { path: 'nityapooja', component: NityapoojaComponent},
  { path: 'karyakaram-details', component: AyyappakaryamdetailsComponent},
  { path: 'calender', component: CalenderComponent},
  { path: 'ayyappa_guruswami', component: GuruSwamiListComponent },
  { path: 'guru_swami_details', component: GuruswamidetailsComponent},
  { path: 'ayyappa_bajanamandali', component: BajanamandalilistComponent},
  { path: 'bajanamandali_details', component:BajanamandalidetailsComponent},
  { path: 'books', component:BooksComponent},
  { path: 'book-details', component: BooksdetailsComponent},
  { path: 'toures', component: TourespageComponent},
  { path: 'yatra-details', component: TouresdetailsComponent},
  { path: 'poojapetam', component: PoojapetamComponent},
  { path: 'poojapetam_details', component: PoojapetamdetailsComponent},
  { path: 'products', component: ProductsComponent},
  { path: 'product_details', component: ProductsDetailsComponent},
  { path: 'anadanam', component: AnadanamtemplesComponent},
  { path: 'temples', component: TemplesComponent},
  { path: 'ayyappatemples', component: AyyappatemplesComponent},
  { path: 'aboutUs', component: AboutUsComponent},
  { path: 'privacypolicy', component: PrivacypolicyComponent},
  { path: 'sharanughosha', component: SharanughoshaComponent},
  { path: 'view-all-news', component: ViewAllNewsComponent},
  { path: 'viewallnews_details', component: ViewallnewdetailsComponent},
  

  { path: '**', redirectTo: 'login' }
];