import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ApiServiceResponse } from '../../interfaces/api-service-response';
import { Category } from '../../interfaces/category';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-categories',
  imports: [ MatSnackBarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent  implements OnInit{
  categoryService=inject(CategoryService);
  snackBar = inject(MatSnackBar);
  categories: Category[] = [];
  categoryForm: FormGroup;
  selectedCategory: Category | null = null;
  
  constructor(private fb: FormBuilder) 
  {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiServiceResponse<Category[]>) => {
        this.categories = response.data;
        console.log(this.categories);
      },
      error: (err) => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  };

  onSelectCategory(category: Category): void {
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name
    });
  };

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const category: Category = {
      id: this.selectedCategory?.id || 0,
      name: this.categoryForm.value.name
    };

    if (this.selectedCategory) {
      this.categoryService.updateCategory(category).subscribe({
        next: (response: ApiServiceResponse<number>) => {
          this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => {
          this.snackBar.open('Failed to update category', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.categoryService.addCategory(category).subscribe({
        next: (response: ApiServiceResponse<Category>) => {
          this.snackBar.open('Category added successfully', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => {
          this.snackBar.open('Failed to add category', 'Close', { duration: 3000 });
        }
      });
    }
  };

  onDeleteCategory(categoryId: number, event: Event): void {
    event.stopPropagation(); // Prevent the list item click event
    //  delete logic here if needed
    this.snackBar.open('Delete functionality not implemented', 'Close', { duration: 3000 });
  }


  resetForm(): void {
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

}
