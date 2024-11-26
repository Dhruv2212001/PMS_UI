import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../../../../services/authservice.service';
import { SystemroleService } from '../../../../services/systemrole.service';
import { CommonModule, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoteService } from '../../../../services/note.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandleingService } from '../../../../services/error-handleing.service';
import { ConfirmationDialogService } from '../../../../services/confirmation-dialog.service';
import { MaterialModule } from '../../../../material.module';
import { NgImageSliderModule } from 'ng-image-slider';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.component.html',
  styleUrl: './productview.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone:true,
  imports:[
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgImageSliderModule,],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductviewComponent implements OnInit {
  ProductViewDetails: any;
  productId: string;
  permissionNameList: any;
  noteForm: any;
  noteId: number = 0;
  refresh: boolean = false;
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
  isPurchaseOrder: boolean = false;

  privateNotes: any[] = [];

  isNoteBoxOpen = false;
  newNote: string = '';
  @ViewChild('dialogTemplateRef') dialogTemplateRef!: TemplateRef<any>;
  aboutItemsList: string[] = [];
  flatData: Array<{ category: string; property: string; value: string }> = [];
  userInfo: any;
  basePath: string = 'https://localhost:44390/uploads/';
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private authService: AuthserviceService,
    private roleService: SystemroleService,
    private location: Location,
    private dialog: MatDialog,
    private noteSrv: NoteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private err: ErrorHandleingService,
    private confirmationDialogService: ConfirmationDialogService,

  ) { }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.roleService.getRoleByName(this.userInfo.role).subscribe(res => {
      this.userInfo.roleLevel = res.roleLevel
    })
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
    });

    this.noteForm = new FormGroup({
      note: new FormControl('', [Validators.required]),
    })

    this.getProductDetails()
    this.getRoleByName()
  }

  getProductDetails() {
    this.productService.getProductById(this.productId).subscribe(res => {
      this.ProductViewDetails = res.productDetails

      this.selectedImage = res.productDetails.basicDetails.primaryPhoto.filter(x => x.isPrimary === true)[0]?.filePath
      this.images = res.productDetails.jungleDetails.attachments.filter(x => x.isPrimary === false).map(x => {
        return {
          image: `${this.basePath}${x.filePath}`, thumbImage: `${this.basePath}${x?.filePath}`
        }
      })
      this.getNotesByProductId()

      const technicalData = JSON.parse(res.productDetails.jungleDetails.technicalSpecification);
      // Flatten the JSON data
      this.flattenData(technicalData);

    })
  }

  flattenData(obj: any, category: string = ''): void {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursive call for nested objects
        this.flattenData(obj[key], key.charAt(0).toUpperCase() + key.slice(1));
      } else {
        // Push the key-value pair into flatData
        this.flatData.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          property: key,
          value: obj[key]
        });
      }
    }
  }
  getNotesByProductId() {
    this.noteSrv.getNoteByProductId(this.productId).subscribe(test => {
      this.privateNotes = []
      this.privateNotes.push(...test)
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

  isImage(fileName: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = fileName?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
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
    this.isPurchaseOrder = this.permissionNameList.includes('Product_PurchaseOrder');
  }

  images: object[] = [];

  selectedImage: string;

  onImageChange(image: string, event: Event): void {
    event.preventDefault();
    this.selectedImage = image;
  }

  goBack(): void {
    this.location.back();
  }

  downloadUserManual() {
    const userManual = this.ProductViewDetails?.basicDetails?.userManualPdf;
    if (userManual) {
      const url = `assets/images/${userManual}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = userManual;
      link.click();
    }
  }

  downloadPdfLabel() {
    const pdfLabel = this.ProductViewDetails?.basicDetails?.pdfLabel;
    if (pdfLabel) {
      const url = `assets/images/${pdfLabel}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfLabel;
      link.click();
    }
  }

  openAboutItemDialog(): void {
    const dialogRef = this.dialog.open(this.dialogTemplateRef, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aboutItemsList = result;
      }
    });
  }

  closepopup() {
    this.noteForm.reset();
    this.noteId = 0
  }
  noteSubmit() {
    this.spinner.show();
    let data = {
      id: this.noteId == 0 ? 0 : this.noteId,
      noteContent: this.noteForm.value.note,
      productId: this.productId
    }
    if (this.noteId == 0) {
      this.noteSrv.addNote(data).subscribe(res => {
        this.toastr.success("Note Created Successfully", "Success");
        this.getProductDetails()
        this.closepopup();
        this.spinner.hide();
      }, error => {
        this.err.defaultErrorHandler(error);
        this.spinner.hide();
      })
    } else {
      this.noteSrv.editNote(this.noteId, data).subscribe(res => {
        this.toastr.success("Note Edited Successfully", "Success");
        this.getProductDetails()
        this.closepopup();
        this.spinner.hide();
      }, error => {
        this.err.defaultErrorHandler(error);
        this.spinner.hide();
      })
    }

  }

  deleteNote(note: any) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this permission?')
      .subscribe(result => {
        if (result) {
          this.noteSrv.deleteNote(note.id).subscribe(res => {
            this.toastr.success("Note Deleted Successfully", "Success");
            this.getNotesByProductId()
          }, error => {
            this.err.defaultErrorHandler(error);
            this.spinner.hide()
          })
        }
      });
  }

  editNote(note: any) {
    const dialogRef = this.dialog.open(this.dialogTemplateRef, {
      width: '35%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aboutItemsList = result;
      }
    });
    this.noteForm.patchValue({
      note: note.noteContent
    })
    this.noteId = note.id;
  }

  formatDimension(dimension: string): string {
    return dimension ? dimension.replace(/\*(?=[^*]*$)/, ' ') : dimension;
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
