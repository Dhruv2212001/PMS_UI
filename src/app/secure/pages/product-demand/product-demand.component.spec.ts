import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDemandComponent } from './product-demand.component';

describe('ProductDemandComponent', () => {
  let component: ProductDemandComponent;
  let fixture: ComponentFixture<ProductDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
