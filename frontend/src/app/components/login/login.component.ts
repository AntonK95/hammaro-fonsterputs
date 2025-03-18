import { Component, OnInit, signal } from '@angular/core';
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
  errorMessage: string | null = null;

    hide = signal(true);
    clickEvent(event: MouseEvent) {
      this.hide.set(!this.hide());
      event.stopPropagation();
    }

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {
  }
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
          // Om vi är staff eller personal så skall vi navigera till deras sida, om kund stanna kvar.
          // this.router.navigate(['/']);
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
