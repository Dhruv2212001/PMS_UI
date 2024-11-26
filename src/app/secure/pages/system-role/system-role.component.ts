import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeNestedDataSource } from '@angular/material/tree';
import { SystemroleService } from '../../../services/systemrole.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialogService } from '../../../services/confirmation-dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorHandleingService } from '../../../services/error-handleing.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { NgToastModule } from 'ng-angular-popup';
const defaultDialogConfig = new MatDialogConfig();

export interface RoleElement {
  id:number;
  name: string;
}

export class TreeModel {
  childPermission?: TreeModel[];
  permissionName: string;
  permissionId: number = 0;
  parentPermissionId: number | null;
}
export interface PermissionNode {
  permissionName: string;
  checked?: boolean;
  children?: PermissionNode[];
  expanded?: boolean;
}


@Component({
  selector: 'app-system-role',
  templateUrl: './system-role.component.html',
  styleUrl: './system-role.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true,
  imports:[
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgToastModule,
    ToastrModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SystemRoleComponent implements OnInit {
  userInfo: any;
  permissionForm!: any;
  roleForm!: any;

  config = {
    disableClose: true,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '30%',
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
  categories: any;
  dataSource: any = new MatTableDataSource();
  dialogTitle: string = 'Add Role';
  Title: string = 'Add Permission';


  displayedColumns: string[] = ['name', 'action'];
  @ViewChild('tree') tree: MatTree<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription;
  count = 0;
  nestedTreeControl: NestedTreeControl<TreeModel>;
  nestedDataSource: MatTreeNestedDataSource<TreeModel>;
  inputValue;


  @ViewChild('permissionForm') addPermissionForm!: TemplateRef<any>;
  @ViewChild('roleForm') addRoleForm!: TemplateRef<any>;

  permissionId: any;
  parentPermissionId: any;
  roleData: any;
  RoleName: any;
  roleId: any;
  permissionRoleId: any;

  constructor(private authService: AuthserviceService,
    private dialog: MatDialog,
    private roleService: SystemroleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationDialogService: ConfirmationDialogService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private err : ErrorHandleingService

  ) {
    this.nestedTreeControl = new NestedTreeControl<TreeModel>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
    this.userInfo = this.authService.getUserInfo();

    this.permissionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    })

    this.roleForm = new FormGroup({
      roleName: new FormControl('', [Validators.required]),
    })

  }


  getPermissions() {
    this.roleService.getPermission().subscribe(res => {
      const formattedPermissions = res.map((node: any) => this.initializeNode(node));
      const expandedNodes = JSON.parse(localStorage.getItem('expandedNodes') || '{}');
      formattedPermissions.forEach((node: any) => {
        this.restoreExpandedStateRecursively(node, expandedNodes);
      });

      this.nestedDataSource.data = formattedPermissions;
    });
  }

  initializeNode(node: any): any {
    node.checked = node.checked || false;
    node.expanded = node.expanded || false;

    if (node.childPermission && node.childPermission.length > 0) {
      node.childPermission = node.childPermission.map((childNode: any) => this.initializeNode(childNode));
    }

    return node;
  }

  restoreExpandedStateRecursively(node: any, expandedNodes: any) {
    if (expandedNodes[node.permissionId]) {
      node.expanded = true;
    }

    if (node.childPermission && node.childPermission.length > 0) {
      node.childPermission.forEach((childNode: any) => this.restoreExpandedStateRecursively(childNode, expandedNodes));
    }
  }

  getRoles() {
    this.roleService.getRoles().subscribe(res => {
      this.dataSource = [...res];
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  permissionSubmit() {
    this.spinner.show();
    if (this.permissionForm.invalid) {
      this.toastr.error("Please fill in the required fields", "ERROR");
      return;
    }
    let permissionData: any = {
      name: this.permissionForm.value.name,
      parentPermissionId: this.parentPermissionId == undefined ? 0 : this.parentPermissionId
    };


    if (this.permissionId == undefined || this.permissionId == 0) {
      this.roleService.createPermission(permissionData).subscribe(
        (res) => {
          this.toastr.success("Permission Created Successfully", "Success");
          this.closepopup();
          this.getPermissions();
          this.spinner.hide()

        },error=>{
          this.err.defaultErrorHandler(error);
          this.spinner.hide()
        })
    } else {
      let permissionData = {
        name: this.permissionForm.value.name,
        parentPermissionId: this.parentPermissionId == undefined ? null : this.parentPermissionId
      }
      this.roleService.editPermission(this.permissionId, permissionData).subscribe(
        (res) => {
          this.toastr.success("Permission Updated Successfully", "Success");
          this.getPermissions();
          this.closepopup();
          this.permissionId = 0
          this.spinner.hide()

        },error=>{
          this.err.defaultErrorHandler(error);
          this.spinner.hide()
        })
    }

  }


  openpopup(templateRef: any) {
    this.Title = 'Add Permission';
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.permissionForm.reset();
  }
  openpopupRole(templateRef: any) {
    this.dialogTitle = 'Add Role';
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.roleForm.reset();
  }


  closepopup() {
    this.permissionId = 0
    this.roleId = null;
    this.permissionForm.reset();
    this.roleForm.reset();
    this.permissionRoleId = 0

  }

  editPermissionById(templateRef: any, data: any) {
    this.Title = 'Edit Permission';
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.permissionForm.patchValue({
      name: data.permissionName
    })
    this.permissionId = data.permissionId;

    this.roleService.getByPermissionId(data.permissionId).subscribe(role => {
      this.parentPermissionId = role.parentPermissionId
    })
  }

  editElement(templateRef: any,data){
    this.dialogTitle = 'Edit Role';
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.roleForm.patchValue({
      roleName: data.name
    })
    this.roleId = data.id
  }

  deletePermissionById(permissionId: number) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this permission?')
      .subscribe(result => {
        if (result) {
          this.roleService.deletePermission(permissionId).subscribe(res => {
            this.toastr.success("Permission Deleted Successfully", "Success");
            this.getPermissions();
          },error=>{
            this.err.defaultErrorHandler(error);
            this.spinner.hide()
          })
        }
      });
  }


  hasNestedChild = (_: number, nodeData: TreeModel) => nodeData.childPermission.length > 0;

  private _getChildren = (node: TreeModel) => node.childPermission;

  clickedActive(element) {
    element.checked = !element.checked;
  }

  getCheckedAmount(data) {
    this.count = 0;
    this.loopData(data.childPermission);
    return this.count;
  }

  loopData(data) {
    data.forEach(d => {
      if (d.checked) {
        this.count += 1;
      }
      if (d.childPermission && d.childPermission.length > 0) {
        this.loopData(d.childPermission);
      }
    });
  }

  changeState(node: any) {
    node.expanded = !node.expanded;


    let expandedNodes = JSON.parse(localStorage.getItem('expandedNodes') || '{}');
    expandedNodes[node.permissionId] = node.expanded;
    localStorage.setItem('expandedNodes', JSON.stringify(expandedNodes));
  }

  addChildPermission(templateRef: any, data: any) {
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.parentPermissionId = data.permissionId
  }


  expand() {
    const expandedNodes = JSON.parse(localStorage.getItem('expandedNodes') || '{}');
    this.nestedDataSource.data.forEach(node => {
      this.expandNodeRecursively(node, expandedNodes, true);
    });
    localStorage.setItem('expandedNodes', JSON.stringify(expandedNodes));
  }


  collapse() {
    const expandedNodes = JSON.parse(localStorage.getItem('expandedNodes') || '{}');
    this.nestedDataSource.data.forEach(node => {
      this.expandNodeRecursively(node, expandedNodes, false);
    });
    localStorage.setItem('expandedNodes', JSON.stringify(expandedNodes));
  }


  expandNodeRecursively(node: any, expandedNodes: any, expand: boolean) {
    node.expanded = expand;
    expandedNodes[node.permissionId] = expand;
    if (node.childPermission && node.childPermission.length > 0) {
      node.childPermission.forEach((childNode: any) => {
        this.expandNodeRecursively(childNode, expandedNodes, expand);
      });
    }
  }


  //--------------role CRUD-----------------

  roleSubmit(){
    this.spinner.show();
    if (this.roleForm.invalid) {
      this.toastr.error("Please fill in the required fields", "ERROR");
      return;
    }
    if(this.roleId == null || this.roleId == undefined) {
      let role: any = {
        roleName: this.roleForm.value.roleName,
      };
      this.roleService.createRole(role).subscribe(res => {
        this.toastr.success("Role reated Successfully", "Success");
        this.getRoles();
        this.spinner.hide();
      },error=>{
        this.err.defaultErrorHandler(error);
        this.spinner.hide();
      })
    }else{
      let Data = {
        roleName: this.roleForm.value.roleName,
      }
      this.roleService.editRole(this.roleId, Data).subscribe(
        (res) => {
          this.toastr.success("Role Updated Successfully", "Success");
          this.closepopup();
          this.getRoles();
          this.spinner.hide();
        },error=>{
          this.err.defaultErrorHandler(error);
          this.spinner.hide();
        })
    }

  }
  deleteRole(id: any) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this role?')
      .subscribe(result => {
        if (result) {
          this.roleService.deleteRole(id.id).subscribe(res => {
            this.toastr.success("Role Deleted Successfully", "Success");
            this.getRoles();
          },error=>{
            this.err.defaultErrorHandler(error);
            this.spinner.hide();
          })
        }
      });
  }

  openRolePermission(templateRef: any, data:any){
    let dialogRef = this.dialog.open(templateRef, this.config);
    dialogRef.disableClose = true;
    this.permissionRoleId = data.id
    this.getByPermissionsByRoleName(data)

  }

  getByPermissionsByRoleName(data){
    this.roleService.getPermissionsByRoleId(data.id).subscribe(
      (res) => {
        // res.rolePermissions
        this.setPermissionCheckState(this.nestedDataSource.data, res);
        this.spinner.hide();
      },error=>{
        this.err.defaultErrorHandler(error);
        this.spinner.hide();
    })
  }

  setPermissionCheckState(treeNodes: any[], permissions: any[]) {
    treeNodes.forEach((node) => {
      // Check if the current node's id matches any of the permissions
      const permissionFound = permissions.some((perm) => perm === node.permissionId);

      // Set checkbox state for the current node if found
      if (permissionFound) {
        node.checked = true;
      }else{
        node.checked = false;
      }

      // If there are children, recursively set their check state
      if (node.childPermission && node.childPermission.length > 0) {
        this.setPermissionCheckState(node.childPermission, permissions);
      }
    });
  }

  changeState1(data: PermissionNode, isChecked: boolean) {
    data.checked = isChecked;
    this.checkChildren(data, isChecked);
  }

  checkChildren(node: PermissionNode, isChecked: boolean) {
    if (node.children) {
      node.children.forEach(child => {
        child.checked = isChecked;
        this.checkChildren(child, isChecked);
      });
    }
  }


permission: boolean = false;

onParentNodeChange(node: any) {

}

  onChildNodeChange(node: any) {
    this.updateChildNodes(node, node.checked);
}

updateChildNodes(node: any, checked: boolean) {
  node.checked = checked;
  if (node.childPermission && node.childPermission.length > 0) {
    node.childPermission.forEach((child: any) => {
      this.updateChildNodes(child, checked);
    });
  }
  this.updateParentNode(node);

}

updateParentNode(node: any) {
  if (node.parentPermissionId) {
    this.nestedDataSource.data.forEach((parent: any) => {
      if (parent.permissionId === node.parentPermissionId) {
        const allChecked = parent.childPermission.every((child: any) => child.checked === true);
        parent.checked = allChecked;
        this.updateParentNode(parent);
      }
    });
  }
  }

  onSave() {
    const permissionId = [];
    const traverseNodes = (nodes: any[]) => {
      nodes.forEach(node => {
        if(node.checked == true) {permissionId.push(node.permissionId)}
        node.checked = false;
        if (node.childPermission && node.childPermission.length > 0) {
          traverseNodes(node.childPermission);
        }
      });
    };
    traverseNodes(this.nestedDataSource.data);
    let data = {
      roleId: this.permissionRoleId,
      permissionId: permissionId
    }
    this.roleService.assignPermission(data).subscribe(role => {
      this.toastr.success("Assigned Permission Successfully", "Success");
      }
    )
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

}
