import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  customConfig = {
    closeButton: true,
    timeOut: 5000,
    tapToDismiss: false,
    extendedTimeOut: 0
  };
  constructor(private toastr: ToastrService) {}

  info(message: string, title?: string) {
    this.toastr.info(message, title, this.customConfig);
  }

  success(message: string, title?: string) {
    this.toastr.success(message, title, this.customConfig);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title, this.customConfig);
  }

  error(message: string, title?: string) {
     this.toastr.error(message, title, this.customConfig);
  }
}
