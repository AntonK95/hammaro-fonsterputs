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

  isUserLoggedIn: boolean = false;
  user: any;

  constructor(
    public authService: AuthServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
  }


  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus(): boolean {
    if(typeof localStorage === 'undefined') {
          return false;
        }
    this.user = this.authService.getUser();
    this.isUserLoggedIn = localStorage.getItem('idToken') !== null;
    return this.isUserLoggedIn;
  }

  logout() {
    this.authService.logout();
    this.checkLoginStatus();
  }

}
