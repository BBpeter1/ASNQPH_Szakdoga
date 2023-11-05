import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDTO } from 'models';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: this.formBuilder.control(''),
    password: this.formBuilder.control('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService) { }

  login() {
    const loginData = this.loginForm.value as LoginDTO;

    this.userService.login(loginData).subscribe({
      next: (response) => {
        this.authService.setToken(response.accessToken);
        this.authService.setIsAdmin(response.isAdmin);
        this.toastrService.success('Üdvözöljük a weboldalon!', 'Sikeres bejelentkezés', {
        timeOut: 3000});
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        this.toastrService.error(err.error.error, 'Error');
      }
    });
  }
  
  redirectToRegistration() {
    this.router.navigateByUrl('/registration');
  }
}