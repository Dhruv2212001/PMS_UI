import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userData: any;

  constructor(private authService:AuthserviceService, private router:Router,
    private toastr: ToastrService
    ){}
  ngOnInit(): void {
    this.userData = this.authService.getUserInfo()
  }
  logOut(){
    this.authService.logout()
    this.router.navigate(['/login'])
    this.toastr.success("Sucessfully Logged Out ", "SUCCESS")
  }
}
