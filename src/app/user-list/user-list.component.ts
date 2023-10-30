import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from 'models';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  userId: number = 0;
  searchTerm: string = '';

  constructor(private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute) {
      this.loadData();
    
  }
  ngOnInit(): void {
    this.userService.getAll().subscribe(
      {
        next: (users) => {this.users = users},
        error: (err) => {this.toastr.error('Hiba')},
      }
    );
  }

  loadData(): void {
    this.userService.getAll().subscribe(
      (users) => {
        this.users = users;
        this.searchUsers();
      },
      (error) => {
        this.toastr.error('A felhasználók betöltése nem sikerült.', 'Hiba');
      }
    );
  }

  navigateToUserForm(id:number) {
    this.router.navigate(['/user-form',id]);
  }

  deleteUser(user: UserDTO) {
    this.userService.deactivate(user).subscribe({
      next: () => {
      },
      error: (err) => {
        this.toastr.success('A felhasználó sikeresen inaktiválva!');
        window.location.reload();
      }
    });
}

  searchUsers() {
    if (this.searchTerm.toLowerCase().trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.phone.toString().includes(this.searchTerm) ||
        user.id.toString().includes(this.searchTerm) ||
        user.address.toLowerCase().includes(this.searchTerm) ||
        user.szisz.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  open(content: TemplateRef<any>, userId: number, action: string) {
    let userToDelete: UserDTO | undefined;
  
    for (const user of this.users) {
      if (user.id === userId) {
        userToDelete = user;
        break;
      }
    }
  
    if (!userToDelete) {
      this.toastr.error('Tétel nem található a megadott ID-vel!');
      return;
    }
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (action === 'delete') {
          if (result === 'confirm') {
            if (userToDelete) {
              this.deleteUser(userToDelete);
            } else {
              this.toastr.error('Tétel nem található a megadott ID-vel!');
            }
          }
        }
      },
      (reason) => {
        console.error('Modal dismissed with reason: ', reason);
      }
    );
  }

}

