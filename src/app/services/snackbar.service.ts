import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  // DI's
  private snackBarRef = inject(MatSnackBar);
  
  // Methods
  public showError(message: string) : void {
    this.snackBarRef.open(message, 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: "popup-error"
    });
  }

  public showSuccess(message: string) : void {
    this.snackBarRef.open(message, 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: "popup-success"
    });
  }

  public showWarning(message: string) : void {
    this.snackBarRef.open(message, 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: "popup-warning"
    });
  }
}
