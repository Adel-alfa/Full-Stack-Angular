import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../interfaces/product';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiServiceResponse } from '../../interfaces/api-service-response';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-home',
  imports: [MatCardModule,
      MatButtonModule,
      MatListModule,CommonModule,
    MatSnackBarModule,
  Carousel, ButtonModule, Tag, MatIconModule,MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 productService = inject(ProductService);
   snackBar = inject(MatSnackBar);
    products!: Product[] ;
    responsiveOptions: any[] | undefined;
    
    ngOnInit() {
     this.productService.getAllProducts().subscribe({
       next: (response:Product[]) => {
         this.products = response ;          
         console.log(this.products);
       },        
     });
 
     this.responsiveOptions = [
         {
             breakpoint: '1400px',
             numVisible: 2,
             numScroll: 1
         },
         {
             breakpoint: '1199px',
             numVisible: 3,
             numScroll: 1
         },
         {
             breakpoint: '767px',
             numVisible: 2,
             numScroll: 1
         },
         {
             breakpoint: '575px',
             numVisible: 1,
             numScroll: 1
         }
     ]
 };
  
     getSeverity(qty: number) {
       console.log('qty=', qty);
       if (qty >= 1 && qty <= 5) {
         return 'danger';
     } else if (qty >= 6 && qty <= 10) {
         return 'warn';
     } else {
         return 'success';
     }
   };
   getDescription(description: string): string {
     const appendDots = "...";
     const maxLength = 100;
     const descriptionLength = description.length;
     return descriptionLength > maxLength ? `${description.substring(0, 100)}${appendDots}` : description;
   }
}
