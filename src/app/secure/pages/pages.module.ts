import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing.module';
import { HeaderComponent } from './header/header.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    RouterLink, 
    MaterialModule,
    RouterOutlet,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  declarations: [HeaderComponent  ]
})
export class PagesModule { }