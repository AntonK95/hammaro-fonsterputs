import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['./fb.component.css']
})
export class FbComponent implements AfterViewInit {
  
  ngAfterViewInit(): void {
    // Anropa FB.XFBML.parse() för att rendera widgeten
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }
}
