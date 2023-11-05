import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserDTO } from 'models';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  isNewUser = true;
  users: UserDTO[] = [];

  userForm = this.formBuilder.group({
    id: this.formBuilder.control(0),
    address: ['', [Validators.required]],
    name: ['', [Validators.required]],
    isAdmin: [false, Validators.required],
    isActive: [false, Validators.required],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+?36|0)[\d-]{8,12}$/)]],
    szisz: ['', [Validators.required, Validators.pattern(/^\d{6}[A-Za-z]{2}$/)]],
  });
  

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {}

    
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id)
    {
      this.isNewUser = false;

      this.userService.getOne(id).subscribe({
        next: (user) =>  this.userForm.setValue(user),
          error: (err) => { 
            console.error(err);
            this.toastrService.error('A felhasználó adatok betöltése sikertelen','Hiba');
          }
      });
    }

    this.userService.getAll().subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        console.error(err);
        this.toastrService.error('A felhasználók betöltése sikertelen','Hiba');
      }
    });

  }

  saveUser() {
    if (this.userForm.invalid) {
      this.toastrService.error('Hibás adatokat adott meg. Kérjük, ellenőrizze az űrlapot és próbálja újra!', 'Hiba');
      return;
    }
    const user = this.userForm.value as UserDTO;
  
    if (this.isNewUser) {
      this.userService.create(user).subscribe({
        next: (user) => {
          this.toastrService.success('Sikeres létrehozás! id: ' + user.id, 'Felhasználó létrehozva!');
        },
        error: (err) => {
          this.toastrService.error('Valami hiba történt a létrehozás közben. Kérjük, próbálja újra később.', 'Hiba');
        }
      });
    } else {
      this.userService.update(user).subscribe({
        next: (updatedUser) => {
          this.toastrService.success('Sikeres módosítás! id: ' + updatedUser.id, 'Felhasználó módosítva!');
        },
        error: (err) => {
          this.toastrService.error('Valami hiba történt a módosítás közben. Kérjük, próbálja újra később.', 'Hiba');
        }
      });  
    }  
  }

  compareObjects(obj1: any, obj2: any)
  {
    return obj1 && obj2 && obj1.id == obj2.id;
  }
 
}