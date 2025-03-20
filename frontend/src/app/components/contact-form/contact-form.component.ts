import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  imports: [
    FormsModule, 
    CommonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatCardModule
  ]
})
export class ContactFormComponent {
  model = {
    name: '',
    email: '',
    message: ''
  };

  responseMessage: string | null = null;

  onSubmit() {

    const mail = {
      name: this.model.name,
      email: this.model.email,
      message: this.model.message
    }
    
    console.log('Mail:', mail);
    
    this.responseMessage = 'Ditt meddelande har skickats till konsolen!';
    
    this.model = { name: '', email: '', message: '' }; 
  }
}
