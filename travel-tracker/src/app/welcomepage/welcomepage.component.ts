import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-welcomepage',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent {}
