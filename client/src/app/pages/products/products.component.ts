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
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [ MatCardModule,
    MatButtonModule,
    MatListModule,CommonModule,
  MatSnackBarModule,
Carousel, ButtonModule, Tag, MatIconModule,MatDividerModule,
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit  {
  authService = inject(AuthService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
   products!: Product[] ;
   selectedProducts!: Product[] ;
   responsiveOptions: any[] | undefined;
   categories: Category[] = [];
   selectedCat!:any;
   numVisibleDy:number=3;
   
   ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (response:Product[]) => {
        this.products = response ;          
        console.log(this.products);
        this.selectedProducts= this.products;
      },        
    });
    this.loadCategories();
    
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
      //console.log('qty=', qty);
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
  };
  loadCategories(){
    this.categoryService.getAllCategories().subscribe(response => {
      this.categories = response.data;
    });
  };
  onSelectCanegory(cat:number){
    console.log(cat);
    this.selectedCat = cat;
    if(this.selectedCat === 0 )
      {
        this.selectedProducts= this.products;
    }
    else
    this.selectedProducts= this.products.filter(items=> items.categoryId === this.selectedCat)
  if( this.selectedProducts.length > 0 && this.selectedProducts.length< 3)
    this.numVisibleDy =this.selectedProducts.length;
  else 
  this.numVisibleDy = 3;

  console.log('this.selectedProducts lenght ==>', this.selectedProducts.length)
  console.log('this.selectedProducts  ==>', this.selectedProducts)
  };
  goProduct(){
    this.router.navigate(['add-product']);
  }
}