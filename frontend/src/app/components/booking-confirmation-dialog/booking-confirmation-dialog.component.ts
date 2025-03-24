import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-confirmation-dialog',
  imports: [CommonModule, MatDialogModule],
  standalone: true,
  templateUrl: './booking-confirmation-dialog.component.html',
  styleUrl: './booking-confirmation-dialog.component.css'
})
export class BookingConfirmationDialogComponent {
  
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BookingConfirmationDialogComponent> 
  ) {}
  
  close(): void {
    this.dialogRef.close();
  }

}
