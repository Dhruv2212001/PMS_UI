import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleingService {
  badreqtrans: any;
  noauttrans: any;
  forbidentrans: any;
  unknowntrans: any;
  reqtrans: any;
  constructor(public alertService: AlertService,public router: Router) { }

  defaultErrorHandler(error: HttpErrorResponse) {
    const body = error.error;

    const handleBlobError = (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const errorMsg = e.target?.result as string;
                // Check for both "Message" and "message" properties
                const message = errorMsg || 'Not Found';
                this.alertService.error(message);
            } catch {
                this.alertService.error('An unknown error occurred.');
            }
        };
        reader.readAsText(blob);
    };

    const fault = body && (body.Message || body.message) ? (body.Message || body.message) : null;

    switch (error.status) {
        case 400:
            if (body && typeof body !== 'object') {
                this.alertService.error(body);
            } else if (typeof body === 'object') {
                this.alertService.error(body[0]);
            } else {
                this.alertService.error('Bad Request');
            }
            break;
        case 401:
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            this.alertService.error('You have no access');
            this.router.navigate(['/login']);
            break;
        case 403:
            this.alertService.error('You do not have permission to access this page');
            this.alertService.error(this.forbidentrans + ' ' + (fault ? fault : ''));
            this.router.navigate(['/login']);
            break;
        case 404:
          debugger
            if (body instanceof Blob) {
                handleBlobError(body); // Convert Blob to JSON if it's in Blob format
            } else if (fault) {
                this.alertService.error(fault);
            } else {
                this.alertService.error('Not Found');
            }
            break;
        case 500:
        default:
            if (fault) {
                this.alertService.error(fault);
            } else {
                this.unknowntrans = error && error.error ? error.error.Message : error;
                this.alertService.error(this.unknowntrans);
            }
            break;
    }
}

protected markFormGroupTouched(formGroup: UntypedFormGroup) {
  (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
          this.markFormGroupTouched(control);
      }
  });
}

public cleanForm(formGroup: UntypedFormGroup) {
  Object.entries(formGroup.controls).forEach(([key, val]) => {
      if (typeof(val.value) === 'string') {
          formGroup.get(key).setValue(formGroup.get(key).value.trim());
      }
  });
}
}
