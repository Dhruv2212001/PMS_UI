import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthserviceService } from '../../services/authservice.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandleingService } from '../../services/error-handleing.service';
import { MaterialModule } from '../../material.module';
import { NgToastModule } from 'ng-angular-popup';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    NgToastModule,
    RouterModule,
    NgIf,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  hide = true;
  hasToken!: boolean;
  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthserviceService,
    private router: Router,
    private err : ErrorHandleingService
  ) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined'){
      this.hasToken = localStorage.getItem('token') == null
    }
    if(!this.hasToken)this.router.navigate(['dashboard']);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show();
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe(response =>{
           this.router.navigate(['/dashboard']);
          this.loginForm.reset()
          localStorage.setItem('token', response.token);
          const userInfo = {
            userId: response.userId,
            username: response.userName,
            role: response.role
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          this.spinner.hide()
          this.toastr.success("Successfully Logged In ", "Success")
        },
      error => {
        this.err.defaultErrorHandler(error);
        this.spinner.hide()

      })

    }
  }

}

