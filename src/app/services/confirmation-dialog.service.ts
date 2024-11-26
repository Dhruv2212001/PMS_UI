import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../public/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private dialog: MatDialog) { }

  confirm(message: string): any {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      // height: '300px',

      data: { message: message }
    });

    return dialogRef.afterClosed();
  }
}
