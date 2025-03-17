import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';
import { ImageDialogComponent } from '../../components/image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  imports: [MatFormFieldModule, MatInputModule,
    MatCardModule, MatSelectModule,
    ReactiveFormsModule,CommonModule,
    MatIconModule,MatDividerModule, RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
   productService= inject(ProductService) ;
   categoryService = inject(CategoryService);
   readonly dialog = inject(MatDialog);
   matSnackBar = inject(MatSnackBar);
   router = inject(Router);
  categories: Category[] = [];
  imageUploadMessage = '';
  imageUrl = '';
  showModal = false;
  ;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      img:['',Validators.required]
    });
   }
  ngOnInit(): void {
    

    this.categoryService.getAllCategories().subscribe(response => {
      this.categories = response.data;
    });
  };

  onSubmit(): void {
    console.log('here here');
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      console.log('here here 222222222222');
      const product: Product = this.productForm.value;     
      this.productService.addProduct(product).subscribe(response => {
        console.log('Product saved successfully', response);
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['products']);
      });
    }
    else{
     
      this.matSnackBar.open('Invalid form', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
      });
    }
  };

  onImageUpload(): void {
    console.log(this.productForm.value );
    this.imageUrl = this.productForm.value.img ;
   
  };
  openDialog(imageUrl:string) {
    this.dialog.open(ImageDialogComponent, {
      width: '30%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{
        imageUrl:imageUrl,
      }
      });
  }
}
