import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-product-demand',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './product-demand.component.html',
  styleUrl: './product-demand.component.css'
})
export class ProductDemandComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { aboutItemsList: string[] }) {}
}
