import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user: any;

  constructor(
    public authService: AuthServiceService,
    public dialog: MatDialog
  ) {}


  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px'
    });
    console.log("Login dialog open:");

    dialogRef.afterClosed().subscribe(result => {
      console.log('Login dialog closed');
    });
  }

  isLoggedIn(): boolean {
    if(typeof localStorage === 'undefined') {
      return false;
    }
    this.user = this.authService.getUser();
    return localStorage.getItem('idToken') !== null; 
  }

  logout() {
    this.authService.logout();
  }

}
