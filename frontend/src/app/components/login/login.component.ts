import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  isLoginMode: boolean = true;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    private cdRef: ChangeDetectorRef
  ) {
  }
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+46|0)[1-9][0-9\s-]{6,11}$/)]],
      street: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{3} \d{2}$/)]],
      city: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/), 
        Validators.pattern(/[a-z]/), 
        Validators.pattern(/\d/), 
        Validators.pattern(/[@$!%*?&]/)
      ]],
      type: ['private', Validators.required],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    console.log("toggleMode: ", this.isLoginMode);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log("Registreringsinformation: ", this.registerForm.value);
      
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log("Registrerad: ", response);
          // this.dialogRef.close();
          this.errorMessage = null;
          this.isLoginMode = true;
          
          this.loginForm.reset();
          // this.cdRef.detectChanges(); // Försök att tvinga UI uppdatering
        },
        (error) => {
          console.log("Fel vid registrering: ", error);
          this.errorMessage = error.error?.errors ? error.error.errors.map((err: any) => err.msg).join(', ') : "Registrering misslyckades.";
        }
      );
    } else {
      this.errorMessage = "Vänligen fyll i alla fält korrekt."
    }
    console.log("ChangeDetectorRef: ", this.cdRef);
  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log("Inloggningsuppgifter:", this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log("Inloggad: ", response);
          console.log("Angivet värde: ", this.loginForm.value);
          this.dialogRef.close();
          const userRole = response.user.role;

          if(userRole === 'staff' || userRole === 'admin') {
            console.log("Navigating to staffpage");
            this.router.navigate(['/staff']);
          } else {
            console.log("Navigating to landingpage");
            this.router.navigate(['/booking']);
          }
          this.loginForm.reset();
        },
        (error) => {
          console.log("Fel vid inloggning: ", error);
          this.errorMessage = error.error?.error || "Inloggningen misslyckades. Försök igen senare."
        }
      )
    }
  }
}
