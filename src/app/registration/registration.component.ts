import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDTO } from 'models';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+?36|0)[\d-]{8,12}$/)]],
    szisz: ['', [Validators.required, Validators.pattern(/^\d{6}[A-Za-z]{2}$/)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z]).*$/)]],
    isAdmin: false,
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService) { }

    registration() {
      const regiData = this.registrationForm.value as UserDTO;
    
      this.userService.create(regiData).subscribe({
        next: (response) => {
          this.router.navigateByUrl('');
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastrService.error('Hibás adatokat adott meg. Kérjük, ellenőrizze az űrlapot és próbálja újra!', 'Hiba');
          } else {
            this.toastrService.error('Valami hiba történt a regisztráció közben. Kérjük, próbálja újra később.', 'Hiba');
          }
        }
      });
    }

    redirectToLogin() {
      this.router.navigateByUrl('/login');
    }
}
