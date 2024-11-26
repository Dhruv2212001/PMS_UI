import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../../services/authservice.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandleingService } from '../../../services/error-handleing.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, loginForm: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = loginForm && loginForm.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
  imports:[
    CommonModule,
    MaterialModule,
    FormsModule ,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgToastModule,
    ToastrModule,
  ],
  standalone:true
})
export class ChangepasswordComponent {

  changePasswordForm: FormGroup;
  hide = true;
  fullName:string
  userInfo: any;
  userId: any;
  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authSrv: AuthserviceService,
    private err : ErrorHandleingService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.authSrv.getUserInfo();
    this.userId = this.userInfo.userId
    const newLocal = this;
    newLocal.changePasswordForm = this.formBuilder.group({
      userName: [this.fullName, [Validators.required]],
      currentPassword: ['', [Validators.pattern('((?=.*[a-z])(?=.*[A-Z]).{8,30})')]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]],

    }, {
      validators: this.Mustmatch('newPassword', 'confirmNewPassword')
    })
  }



  matcher = new MyErrorStateMatcher();
  get f() {
    return this['changePasswordForm'].controls
  }
  Mustmatch(newPassword: any, confirmNewPassword: any) {
    return (formgroup: FormGroup) => {
      const passwordcontrol = formgroup.controls[newPassword];
      const con_passwordcontrol = formgroup.controls[confirmNewPassword];

      if (con_passwordcontrol.errors && !con_passwordcontrol.errors['Mustmatch']) {
        return;

      }
      if (passwordcontrol.value !== con_passwordcontrol.value) {
        con_passwordcontrol.setErrors({ Mustmatch: true });
      } else {
        con_passwordcontrol.setErrors(null);

      }
    }
  }
  onSubmit() {
    this.spinner.show();
    let Obj = {
      userId: this.userId,
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword
    }
    this.authSrv.changePassword(Obj).subscribe((res) => {
      this.toastr.success("Password Changed Successfully", "Success")
        localStorage.clear()
        this.router.navigate(['login'])
        this.spinner.hide()
    },error => {
      this.err.defaultErrorHandler(error);
        this.spinner.hide()
    })
  }
  closepopup() {
    this.router.navigate(['/dashboard'])

  }
}
