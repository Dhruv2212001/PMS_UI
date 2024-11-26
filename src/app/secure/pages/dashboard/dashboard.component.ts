import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../services/confirmation-dialog.service';
import { SystemroleService } from '../../../services/systemrole.service';
import { ErrorHandleingService } from '../../../services/error-handleing.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
const defaultDialogConfig = new MatDialogConfig();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgToastModule,
    ToastrModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  last_index = 100;
  counter = 100;
  permission: any[] = []
  ProductForm!: FormGroup;
  selectedFile: File | null = null;
  ProductDetails: any
  dialogTitle: string = 'Add Product'; // Default title
  dummyImage = '../../../../assets/images/icons8-video-100.png';
  selectedProducts: any[] = [];
  keywordsList: string[] = [];
  brandLinksList: string[] = [];
  brandVideoLinksList: string[] = [];
  competitorUrlsList: string[] = [];
  aboutItemsList: string[] = [];
  agentDetailsList: string[] = [];

  packageDimention = [
    { value: 'cm' },
    { value: 'mm' },
  ];

  masterCartoonDimention = [
    { value: 'cm' },
    { value: 'mm' },
  ];

  productDimention = [
    { value: 'cm' },
    { value: 'mm' },
  ];
  keywordInputControl = this.fb.control('');
  brandLinkInputControl = this.fb.control('');
  brandVideoLinkInputControl = this.fb.control('');
  competitorUrlInputControl = this.fb.control('');


  base64Image: string | ArrayBuffer | null = null;

  config = {
    disableClose: true,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '100%',
    height: '100%',
    minWidth: '',
    minHeight: '',
    maxWidth: defaultDialogConfig.maxWidth,
    maxHeight: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
  };
  config1 = {
    disableClose: true,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '60%',
    height: '90%',
  }

  config2 = {
    disableClose: true,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '30%',
    height: '30%',
  }

  @ViewChild('viewProductForm') viewProductForm!: TemplateRef<any>;
  @ViewChild('dialogTemplateRef') dialogTemplateRef!: TemplateRef<any>;
  @ViewChild('agentDetailsRef') agentDetailsRef!: TemplateRef<any>;
  @ViewChild('openImageRef') openImageRef!: TemplateRef<any>;

  productId: any;
  userInfo!: any;
  ProductViewDetails: any;
  cards: any[] = [];
  filteredCards: any[] = [];
  roleDetails: any[] = [];
  permissionNameList: any;
  isProductEditable: boolean = false;
  isProductViewable: boolean = false;
  isProductDeletable: boolean = false;
  isProductBasicEditable: boolean = false;
  isProductBasicViewable: boolean = false;
  isProductJungleEditable: boolean = false;
  isProductJungleViewable: boolean = false;
  isProductAddable: boolean = false;
  isProductExportable: boolean = false;
  isProductImportable: boolean = false;
  fileName: string;
  userManualPdfFileName: string = null;
  pdfLabelPdfFileName: string = null;
  primaryImageData: any = null;
  attachmentObject: any[] = [];
  primaryImageSize: number;
  basePath: string = 'https://localhost:44390/uploads/';

  constructor(private authService: AuthserviceService,
    private roleService: SystemroleService,
    private productService: ProductService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationDialogService: ConfirmationDialogService,
    private err: ErrorHandleingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.productId = 0;
    this.userInfo = this.authService.getUserInfo();
    this.roleService.getRoleByName(this.userInfo.role).subscribe(res => {
      this.userInfo.roleLevel = res.roleLevel
    })
    this.ProductForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      hsn: new FormControl('',),
      gst: new FormControl(0,),
      stockInventory: new FormControl('', [Validators.required]),
      packageWeight: new FormControl('', []),
      packageWeightunit: new FormControl('', []),
      masterCartoonWeight: new FormControl('', []),
      mastercartoonunit: new FormControl('', []),
      productWeight: new FormControl('', []),
      productWeightunit: new FormControl('', []),
      sellingPrice: new FormControl('', []),
      importsMRP: new FormControl('', []),
      userManualPdf: new FormControl('', []),
      pdfLabel: new FormControl('', []),
      category: new FormControl('', [Validators.required]),
      commission: new FormControl('', []),
      title: new FormControl('', [Validators.required]),
      keywords: this.keywordInputControl,
      brandlink: this.brandLinkInputControl,
      brandVideoLinks: this.brandVideoLinkInputControl,
      competitorUrl: this.competitorUrlInputControl,
      aboutItem: new FormControl('', []),
      productDescription: new FormControl('', []),
      technicalSpecification: new FormControl('', []),
      attachments: new FormControl('',),
      masterCartoonQuantity: new FormControl('',),

      purchasePriceUSD: new FormControl(0, []),
      purchasePriceINR: new FormControl(0, []),
      BCD: new FormControl(0, []),
      AIDC: new FormControl(0, []),
      SWSurcharge: new FormControl(0, []),
      IGST: new FormControl(0, []),
      total: new FormControl(0, []),
      shipping: new FormControl(0, []),
      duty: new FormControl(0, []),
      agentDetails: new FormControl('', []),

      packageDimensionValue: this.fb.group({
        length: [0, []],
        width: [0, []],
        height: [0, []],
      }),
      dimensionUnit: new FormControl('',),

      packageDimension: new FormControl(''),

      masterCartoonDimensionValue: this.fb.group({
        length: [0, []],
        width: [0, []],
        height: [0, []]
      }),
      mastercartoondimensionUnit: new FormControl('',),
      masterCartoonDimension: new FormControl(''),

      productdimensionsValue: this.fb.group({
        length: [0, []],
        width: [0, []],
        height: [0, []]
      }),
      productdimensionUnit: new FormControl('',),
      productdimensions: new FormControl(''),
    });
    this.getPermission()
    this.getProduct()
    this.getRoleByName()
  }

  validateNumeric(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    if (!((keyCode >= 48 && keyCode <= 57) || [45, 40, 41].includes(keyCode))) {
      event.preventDefault();
    }
  }

  addAboutItem(): void {
    const aboutItemValue = this.ProductForm.get('aboutItem')?.value;
    if (aboutItemValue && aboutItemValue.trim() !== '') {
      this.aboutItemsList.push(aboutItemValue.trim());
      this.ProductForm.get('aboutItem')?.reset();
    }
  }

  openAboutItemDialog(): void {
    const dialogRef = this.dialog.open(this.dialogTemplateRef, {
      width: '35%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aboutItemsList = result; // Update the list if any items were removed
      }
    });
  }

  removeAboutItem(index: number): void {
    this.aboutItemsList.splice(index, 1);  // Remove the item from the list
  }

  addAgentDetails(): void {
    const agentDetailsValue = this.ProductForm.get('agentDetails')?.value;
    if (agentDetailsValue && agentDetailsValue.trim() !== '') {
      this.agentDetailsList.push(agentDetailsValue.trim());
      this.ProductForm.get('agentDetails')?.reset();
    }
  }

  openAgentDetails(): void {
    const dialogRef = this.dialog.open(this.agentDetailsRef, {
      width: '35%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.agentDetailsList = result;
      }
    });
  }

  removeAgentDetail(index: number): void {
    this.agentDetailsList.splice(index, 1);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const attachmentObject = [{
        fileName: this.selectedFile.name,
        fileSize: this.selectedFile.size,
        filePath: `${this.selectedFile.name}`,
        attachmentType: 1
      }];

      this.ProductForm.patchValue({
        attachments: attachmentObject
      });
    }
  }

  resetFileSelection() {
    this.selectedFile = null;
  }

  openpopup(templateRef: any) {
    this.dialogTitle = 'Add Product';
    let dialogRef = this.dialog.open(templateRef, this.config1);
    dialogRef.disableClose = true;
    this.ProductForm.reset();
    this.resetFileSelection()
    this.ProductForm.patchValue({
      technicalSpecification: '{"Header":{"Key":"Value","Key":"Value"}}'
    });
  }

  editProduct(templateRef: any, product: any) {
    this.dialogTitle = 'Edit Product';
    let dialogRef = this.dialog.open(templateRef, this.config1);
    dialogRef.disableClose = true;
    this.productId = product.id
    this.productService.getProductById(product.id).subscribe(res => {
      if (res.productDetails.basicDetails) {
        const packageDimensionsArray = res.productDetails.basicDetails?.packageDimension.split('*');
        const packageDimensionsNumbers = packageDimensionsArray.map(Number);
        const boxDimensionsArray = res.productDetails.basicDetails.masterCartoonDimension.split('*');
        const boxDimensionsNumbers = boxDimensionsArray.map(Number);
        const productDimensionsArray = res.productDetails.basicDetails.productDimension.split('*');
        const productDimensionsNumbers = productDimensionsArray.map(Number);
        const packageWeightArray = res.productDetails.basicDetails?.packageWeight.split('*');
        const boxWeightArray = res.productDetails.basicDetails.masterCartoonWeight.split('*');
        const productWeightArray = res.productDetails.basicDetails.productWeight.split('*');
        this.ProductForm.get('packageDimensionValue')?.patchValue({
          length: packageDimensionsNumbers[0],
          width: packageDimensionsNumbers[1],
          height: packageDimensionsNumbers[2]
        }),
          this.ProductForm.get('masterCartoonDimensionValue')?.patchValue({
            length: boxDimensionsNumbers[0],
            width: boxDimensionsNumbers[1],
            height: boxDimensionsNumbers[2]
          }),
          this.ProductForm.get('productdimensionsValue')?.patchValue({
            length: productDimensionsNumbers[0],
            width: productDimensionsNumbers[1],
            height: productDimensionsNumbers[2]
          })
        this.ProductForm.patchValue({
          productName: res.productDetails.basicDetails.productName,
          sku: res.productDetails.basicDetails.sku,
          hsn: res.productDetails.basicDetails.hsn,
          gst: res.productDetails.basicDetails.gst,
          boxDimension: res.productDetails.basicDetails.boxDimension,
          productDimension: res.productDetails.basicDetails.productDimension,
          packageWeight: packageWeightArray[0],
          packageWeightunit: packageWeightArray[1],
          masterCartoonWeight: boxWeightArray[0],
          mastercartoonunit: boxWeightArray[1],
          productWeight: productWeightArray[0],
          productWeightunit: productWeightArray[1],
          productweight: res.productDetails.basicDetails.productweight,
          sellingPrice: res.productDetails.basicDetails.sellingPrice,
          importsMRP: res.productDetails.basicDetails.importsMRP,
          userManualPdf: res.productDetails.basicDetails.userManualPdf,
          pdfLabel: res.productDetails.basicDetails.pdfLabel,
          stockInventory: res.productDetails.basicDetails.stock,
          masterCartoonQuantity: res.productDetails.basicDetails.masterCartoonQuantity,
          dimensionUnit: packageDimensionsArray[3],
          productdimensionUnit: productDimensionsArray[3],
          mastercartoondimensionUnit: boxDimensionsArray[3],
        });
        this.primaryImageData = res.productDetails.basicDetails.primaryPhoto.filter(x => x.isPrimary === true)[0]
      }

      if (res.productDetails.jungleDetails) {
        this.ProductForm.patchValue({
          category: res.productDetails.jungleDetails.category,
          commission: res.productDetails.jungleDetails.commission,
          title: res.productDetails.jungleDetails.title,
          productDescription: res.productDetails.jungleDetails.productDescription,
          technicalSpecification: res.productDetails.jungleDetails.technicalSpecification,
        })

        this.keywordsList = res.productDetails.jungleDetails.keywords;
        this.brandLinksList = res.productDetails.jungleDetails.brandContentLink;
        this.brandVideoLinksList = res.productDetails.jungleDetails.brandVideoLinks;
        this.competitorUrlsList = res.productDetails.jungleDetails.competitorUrl;
        this.aboutItemsList = res.productDetails.jungleDetails.aboutItem;
        this.ImageList = res.productDetails.jungleDetails.attachments.filter(x => x.isPrimary === false)
      }

      if (res.productDetails.purchaseOrders) {
        this.agentDetailsList = res.productDetails.purchaseOrders.agentDetails
        this.ProductForm.patchValue({
          purchasePriceUSD: res.productDetails.purchaseOrders.purchasePriceUSD,
          purchasePriceINR: res.productDetails.purchaseOrders.purchasePriceINR,
          BCD: res.productDetails.purchaseOrders.bcd,
          AIDC: res.productDetails.purchaseOrders.aidc,
          SWSurcharge: res.productDetails.purchaseOrders.swSurcharge,
          IGST: res.productDetails.purchaseOrders.igst,
          total: res.productDetails.purchaseOrders.total,
          shipping: res.productDetails.purchaseOrders.shipping,
          duty: res.productDetails.purchaseOrders.duty
        })
      }
    }, error => {
      this.spinner.hide()
      this.err.defaultErrorHandler(error);
    })
  }

  closepopup() {
    this.productId = 0
    this.ProductForm.reset();
    this.keywordsList = []
    this.brandLinksList = [];
    this.brandVideoLinksList = [];
    this.competitorUrlsList = [];
    this.aboutItemsList = [];
    this.agentDetailsList = [];
    this.pdfLabelPdfFileName = null;
    this.userManualPdfFileName = null;
    this.ImageList = [];
    this.primaryImageData = null;
    this.base64Image = null;
    this.attachmentObject = []
  }

  onSubmit() {
    this.spinner.show()
    if (this.productId == 0) {
      const stockInventory = {
        quantity: this.ProductForm.value.stockInventory
      }
      this.ProductForm.patchValue({
        stockInventory: stockInventory,
        packageDimension: `${this.ProductForm.value.packageDimensionValue.length}*${this.ProductForm.value.packageDimensionValue.width}*${this.ProductForm.value.packageDimensionValue.height}*${this.ProductForm.value.dimensionUnit}`,
        masterCartoonDimension: `${this.ProductForm.value.masterCartoonDimensionValue.length}*${this.ProductForm.value.masterCartoonDimensionValue.width}*${this.ProductForm.value.masterCartoonDimensionValue.height}*${this.ProductForm.value.mastercartoondimensionUnit}`,
        productdimensions: `${this.ProductForm.value.productdimensionsValue.length}*${this.ProductForm.value.productdimensionsValue.width}*${this.ProductForm.value.productdimensionsValue.height}*${this.ProductForm.value.productdimensionUnit}`,
      })

      if (this.ProductForm.valid) {
        const formData = this.productMap(this.ProductForm.value)
        this.productService.addProduct(formData).subscribe((res) => {
          this.spinner.hide()
          this.toastr.success("Data Added Sucessfully", "SUCCESS")
          this.getProduct()
          this.closepopup()
        }, error => {
          this.err.defaultErrorHandler(error);
          this.spinner.hide()
        })
      }
    } else {
      const stockInventory = {
        quantity: this.ProductForm.value.stockInventory
      }
      this.ProductForm.patchValue({
        stockInventory: stockInventory,
        packageDimension: `${this.ProductForm.value.packageDimensionValue.length}*${this.ProductForm.value.packageDimensionValue.width}*${this.ProductForm.value.packageDimensionValue.height}*${this.ProductForm.value.dimensionUnit}`,
        masterCartoonDimension: `${this.ProductForm.value.masterCartoonDimensionValue.length}*${this.ProductForm.value.masterCartoonDimensionValue.width}*${this.ProductForm.value.masterCartoonDimensionValue.height}*${this.ProductForm.value.mastercartoondimensionUnit}`,
        productdimensions: `${this.ProductForm.value.productdimensionsValue.length}*${this.ProductForm.value.productdimensionsValue.width}*${this.ProductForm.value.productdimensionsValue.height}*${this.ProductForm.value.productdimensionUnit}`,
      })
      const formData = this.productMap(this.ProductForm.value)
      this.productService.updateProduct(this.productId, formData).subscribe((res: any) => {
        this.getProduct()
        this.closepopup()
        this.spinner.hide()
        this.toastr.success("Product Updated Sucessfully", "SUCCESS")
      }, error => {
        this.err.defaultErrorHandler(error);
        this.spinner.hide()
      })
    }
  }

  productMap(productFormData: any) {
    this.attachmentObject.push(...this.ImageList)
    if ((this.primaryImageData !== null || this.base64Image !== null) && (this.primaryImageData !== undefined || this.base64Image !== null)) {
      this.attachmentObject.push({
        id: this.primaryImageData?.id > 0 ? this.primaryImageData.id : 0,
        fileName: this.fileName !== undefined ? this.fileName : this.primaryImageData.fileName,
        fileSize: this.primaryImageSize !== undefined ? this.primaryImageSize : this.primaryImageData.fileSize,
        filePath: this.base64Image !== null ? this.base64Image : this.primaryImageData.filePath,
        attachmentType: 1,
        isPrimary: true,
      });

    }

    let purchaseOrder = {
      aidc: productFormData.AIDC,
      swSurcharge: productFormData.SWSurcharge,
      igst: productFormData.IGST,
      purchasePriceUSD: productFormData.purchasePriceUSD,
      purchasePriceINR: productFormData.purchasePriceINR,
      bcd: productFormData.BCD,
      shipping: productFormData.shipping,
      total: productFormData.total,
      duty: productFormData.duty,
      agentDetails: this.agentDetailsList
    }

    let productData = {
      id: this.productId,
      productName: productFormData.productName,
      sku: productFormData.sku,
      hsn: productFormData.hsn,
      gst: productFormData.gst,
      packageDimension: productFormData.packageDimension,
      masterCartoonDimension: productFormData.masterCartoonDimension,
      productDimension: productFormData.productdimensions,
      packageWeight: productFormData.packageWeight + '*' + productFormData.packageWeightunit,
      masterCartoonWeight: productFormData.masterCartoonWeight + '*' + productFormData.mastercartoonunit,
      masterCartoonQuantity: productFormData.masterCartoonQuantity,
      productWeight: productFormData.productWeight + '*' + productFormData.productWeightunit,
      sellingPrice: productFormData.sellingPrice,
      importsMRP: productFormData.importsMRP,
      userManualPdf: productFormData.userManualPdf,
      pdfLabel: productFormData.pdfLabel,
      category: productFormData.category,
      commission: productFormData.commission,
      title: productFormData.title,
      productDescription: productFormData.productDescription,
      technicalSpecification: productFormData.technicalSpecification,
      stockInventory: productFormData.stockInventory,
      attachments: this.attachmentObject,
      brandContentLink: this.brandLinksList,
      aboutItem: this.aboutItemsList,
      brandVideoLinks: this.brandVideoLinksList,
      keywords: this.keywordsList,
      competitorURL: this.competitorUrlsList,
      purchaseOrder: this.userInfo.roleLevel == 3 ? null : purchaseOrder
    }
    return productData
  }

  getPermission() {
    this.authService.getPermission().subscribe(res => {
      this.permission = res
    })
  }

  getRoleByName() {
    const roleName = this.authService.getUserInfo().role
    this.roleService.getRoleByName(roleName).subscribe(res => {
      this.getPermissionNamesByRoleId(res.id)
    })
  }

  getPermissionNamesByRoleId(roleId) {
    this.roleService.getPermissionNamesByRoleId(roleId).subscribe(res => {
      this.permissionNameList = res
      this.setPermissionFlags()
    })
  }

  setPermissionFlags() {
    this.isProductEditable = this.permissionNameList.includes('Product_Edit');
    this.isProductViewable = this.permissionNameList.includes('Product_View');
    this.isProductDeletable = this.permissionNameList.includes('Product_Delete');
    this.isProductAddable = this.permissionNameList.includes('Product_Add');
    this.isProductImportable = this.permissionNameList.includes('Product_Import');
    this.isProductExportable = this.permissionNameList.includes('Product_Export');

    this.isProductBasicEditable = this.permissionNameList.includes('Product_Basic_Edit');
    this.isProductBasicViewable = this.permissionNameList.includes('Product_Basic_View');

    this.isProductJungleEditable = this.permissionNameList.includes('Product_Jungle_Edit');
    this.isProductJungleViewable = this.permissionNameList.includes('Product_Jungle_View');
  }

  hasDeletePermission(permissions: any[]): boolean {
    for (let permission of permissions) {
      if (permission.permissionName === 'Product_Delete') {
        return true;
      }
      if (permission.childPermission && permission.childPermission.length > 0) {
        if (this.hasDeletePermission(permission.childPermission)) {
          return true;
        }
      }
    }

    return false;
  }

  getImagePath(image: string): string {
    return `${this.basePath}/${image}`;
  }

  getProduct() {
    this.productService.getProduct().subscribe(res => {
      if (res) {
        this.ProductDetails = res
        this.ProductDetails = res.map(product => {
          if (product.attachments && product.attachments.length > 0) {
            product.attachments[0].filePath = `https://localhost:44390/uploads/${product.attachments[0].filePath}`;

          }
          return product;
        });
        this.filteredCards = this.ProductDetails
      }
    }, error => {
      this.err.defaultErrorHandler(error);
      this.spinner.hide()
    });
  }

  async deleteProduct(product: any) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this Product?')
      .subscribe(result => {
        if (result) {
          this.productService.deleteProduct(product.id).subscribe(res => {
            this.toastr.success("Product deleted successfully", "SUCCESS");
            this.getProduct();
          }, error => {
            this.err.defaultErrorHandler(error);
            this.spinner.hide()
          });
        } else {
        }
      });
  }

  userViewData(id: string) {
    this.router.navigate([`/dashboard`, id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredCards = this.ProductDetails.filter(card =>
      card.title.toLowerCase().includes(filterValue) || card.sku.toLowerCase().includes(filterValue)
    );
  }

  selectedExcelFile: File | null = null;

  onFileSelected1(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }
  openImport(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, this.config2);
    dialogRef.disableClose = true;
  }
  onFileSelectedPdf(event: any, controlName: string): void {
    const file: File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      if (controlName === 'userManualPdf') { this.userManualPdfFileName = file.name }
      if (controlName === 'pdfLabel') { this.pdfLabelPdfFileName = file.name }
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.ProductForm.get(controlName)?.setValue(base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.productService.ProductImport(formData).subscribe(response => {
        this.getProduct()

      }, error => {
        this.toastr.error('Error Occurring', 'Error');
      });
    }
  }

  export() {
    this.productService.getProductExport().subscribe(res => {

      const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      window.URL.revokeObjectURL(url);
    }, error => {
      this.err.defaultErrorHandler(error);
    });
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }


  addItem(event: KeyboardEvent, inputControl: any, itemList: string[]): void {
    const input = (event.target as HTMLInputElement);
    const value = input.value.trim();

    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      if (value) {
        const newItems = value.split(/[\s,]+/).filter(item => item.trim() !== '');
        itemList.push(...newItems);
      }
      inputControl.setValue('');
      event.preventDefault();
    }
  }

  removeItem(index: number, itemList: string[]): void {
    if (index >= 0) {
      itemList.splice(index, 1);
    }
  }

  addKeyword(event: KeyboardEvent): void {
    this.addItem(event, this.keywordInputControl, this.keywordsList);
  }

  removeKeyword(index: number): void {
    this.removeItem(index, this.keywordsList);
  }

  addBrandLink(event: KeyboardEvent): void {
    this.addItem(event, this.brandLinkInputControl, this.brandLinksList);
  }

  removeBrandLink(index: number): void {
    this.removeItem(index, this.brandLinksList);
  }

  addBrandVideoLink(event: KeyboardEvent): void {
    this.addItem(event, this.brandVideoLinkInputControl, this.brandVideoLinksList);
  }

  removeBrandVideoLink(index: number): void {
    this.removeItem(index, this.brandVideoLinksList);
  }

  addCompetitorUrl(event: KeyboardEvent): void {
    this.addItem(event, this.competitorUrlInputControl, this.competitorUrlsList);
  }

  removeCompetitorUrl(index: number): void {
    this.removeItem(index, this.competitorUrlsList);
  }

  onFileSelectedForImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
      this.primaryImageSize = file.size;
      const reader = new FileReader();
      reader.onload = () => {
        this.splitBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  imageSizeConvertor(value) {
    return (value / (1024 * 1024)).toFixed(3);
  }

  splitBase64(base64String: any): void {
    const [header, base64Data] = base64String.split(',');
    this.base64Image = base64Data;
  }

  removeImage2(): void {
    this.base64Image = null;
    this.fileName = '';
    this.primaryImageData = null
  }

  addMoreImages(productData: any) {
    productData.attachments
  }



  ImageList: any[] = [];

  openPopupImage() {
    const dialogRef = this.dialog.open(this.openImageRef, {
      width: '55%',
      height: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ImageList = result;
      }
    });
  }

  onFileSelectedImages(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          const filePath = reader.result as string;
          const fileName = file.name;
          const fileSize = file.size

          this.ImageList.push({
            filePath: filePath,
            fileName: fileName,
            fileSize: fileSize,
            attachmentType: 1,
            isPrimary: false,
            id: 0
          });
        };

        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.ImageList.splice(index, 1);
  }

  saveImageList(): void {
    this.ImageList.map(x => {
      if (x.id == 0) { x.filePath = x.filePath.split(',')[1] }
    })

  }
  clearPdf(controlName: string) {
    this.ProductForm.get(controlName)?.setValue('');
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }


  toggleSelection(product: any) {
    const index = this.selectedProducts.indexOf(product);
    if (index === -1) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.splice(index, 1);
    }
  }

  deleteSelectedProducts() {
    if (confirm('Are you sure you want to delete the selected products?')) {
      this.selectedProducts.forEach(product => this.deleteProducts(product));
      this.selectedProducts = [];
    }
  }

  deleteProducts(product: any) {
    console.log('Deleting product:', product);
    // After deletion, filter it out from `filteredCards`
    this.filteredCards = this.filteredCards.filter(p => p !== product);
  }

}
