import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserService } from '../../../services/add-user.service';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from '../../../services/confirmation-dialog.service';
import { ErrorHandleingService } from '../../../services/error-handleing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemroleService } from '../../../services/systemrole.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
const defaultDialogConfig = new MatDialogConfig();

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  standalone:true,
  imports:[
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {
  UserForm!: any
  displayedColumns: string[] = [
    'email',
    'userName',
    'name',
    'phoneNumber',
    'address1',
    'address2',
    'city',
    'state',
    'postcode',
    'role',
    'action'
  ];
  dialogTitle: string = 'Add Role'; // Default title

  dataSource: any = new MatTableDataSource();
  config = {
    disableClose: true,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '35%',
    height: 'auto',
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

  roles = [
    { value: 1, viewValue: 'Admin' },
    { value: 2, viewValue: 'Manager' },
    { value: 3, viewValue: 'User' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('addUserForm') addUserForm!: TemplateRef<any>;
  @ViewChild(MatSort) sort: MatSort;
  userId: number = 0;
  userRole: any[];
  roleControl = new FormControl('', [Validators.required]);
  constructor(private dialog: MatDialog,
    private userService: AddUserService,
    private toastr: ToastrService,
    private err: ErrorHandleingService,
    private spinner: NgxSpinnerService,
    private roleService: SystemroleService,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.UserForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      address1: new FormControl('', []),
      address2: new FormControl('', []),
      phoneNumber: new FormControl('', []),
      city: new FormControl('', []),
      state: new FormControl('', []),
      postcode: new FormControl('', []),
      roleLevel: new FormControl(0, [Validators.required]),
      role: this.roleControl
    })
    this.getRoles()
    this.getUser()
  }
  getRoles() {
    this.roleService.getRoles().subscribe(res => {
      this.userRole = [...res];
    },
      error => {
        this.err.defaultErrorHandler(error);
      });
  }

  getUser() {
    this.userService.getUser().subscribe(res => {
      this.dataSource = res
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openpopup(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.UserForm.reset();
  }

  closepopup() {
    this.UserForm.reset();
    this.userId = 0
    const passwordControl = this.UserForm.get('password');
    passwordControl.setValidators([Validators.required]);
    passwordControl.updateValueAndValidity();
  }

  onSubmit() {
    this.spinner.show();
    if (this.userId == 0) {
      this.userService.addUser(this.UserForm.value).subscribe(res => {
        this.toastr.success("User created successfully", "SUCCESS");
        this.UserForm.reset();
        this.closepopup();
        this.getUser();
        this.spinner.hide();
      },
        error => {
          this.err.defaultErrorHandler(error);
          this.spinner.hide();
        })
    } else {
      this.userService.updateUser(this.userId, this.UserForm.value).subscribe(res => {
        this.toastr.success("User udpated successfully", "SUCCESS");
        this.UserForm.reset();
        this.closepopup();
        this.getUser();
        this.spinner.hide();
      },
        error => {
          this.err.defaultErrorHandler(error);
          this.spinner.hide();
        })
    }
  }

  editElement(templateRef: any, data) {
    this.dialogTitle = 'Edit User';
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.UserForm.patchValue({
      username: data.userName,
      name: data.name,
      email: data.email,
      address1: data.address1,
      address2: data.address2,
      phoneNumber: data.phoneNumber,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      roleLevel: data.roleLevel,
      role: data.role
    });
    this.userId = data.id
    const passwordControl = this.UserForm.get('password');
    passwordControl.clearValidators();
    passwordControl.updateValueAndValidity();

  }

  deleteRole(id: any) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this User?')
      .subscribe(result => {
        if (result) {
          this.userService.deleteUser(id.id).subscribe(res => {
            this.toastr.success("User deleted successfully", "SUCCESS");
            this.getUser();
          }, error => {
            this.err.defaultErrorHandler(error);
            this.spinner.hide();
          })
        }
      });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
