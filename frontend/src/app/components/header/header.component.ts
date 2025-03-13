import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

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

  logout() {
    this.authService.logout();
  }

}
