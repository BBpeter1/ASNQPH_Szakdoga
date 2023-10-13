import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from 'models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  toastrService: any
  searchTerm: string = '';

  constructor(private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
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
        this.toastrService.error('A véradás űrlapjának betöltése nem sikerült.', 'Hiba');
      }
    );
  }

  navigateToUserForm(id:number) {
    this.router.navigate(['/user-form',id]);
  }

  deleteUser(user: UserDTO) {
    user.isActive = true;
  }

  searchUsers() {
    if(this.searchTerm.toLowerCase().trim())
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm) ||
      user.phone.toString().includes(this.searchTerm) ||
      user.id.toString().includes(this.searchTerm)
    );
    else{
      this.filteredUsers = this.users
    }
  }

}

