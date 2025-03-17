import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  imports: [MatDialogActions,MatDialogContent, MatDialogClose,],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css'
})
export class ImageDialogComponent implements OnInit {
  dialogdata:any;
  imageUrl:any;
  constructor( @Inject(MAT_DIALOG_DATA)public data:any) {}
 
  ngOnInit(): void {
    this.dialogdata= this.data;
     this.imageUrl = this.dialogdata.imageUrl;
  }
}
