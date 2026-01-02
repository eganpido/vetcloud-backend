import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. I-import ang RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. I-import ang RouterOutlet imbes nga ang CustomerListComponent
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vetcloud-frontend';
}