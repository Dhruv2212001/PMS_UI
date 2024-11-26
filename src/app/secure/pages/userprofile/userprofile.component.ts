import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
  standalone:true,
  imports:[
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class UserprofileComponent implements OnInit {
  userInfo: any;
  userId: any;
  UserData: any;

  constructor(private authSrv: AuthserviceService) { }

  ngOnInit(): void {
    this.userInfo = this.authSrv.getUserInfo();
    this.userId = this.userInfo.userId
    this.getuserinfo()
  }

  getuserinfo() {
    this.authSrv.getUserInfoById(this.userId).subscribe(data => {
      this.UserData = data
    })
  }

}
