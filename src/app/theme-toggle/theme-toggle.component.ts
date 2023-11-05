import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <label class="switch">
      <input type="checkbox" [checked]="isDarkMode" (change)="toggleTheme()" />
      <span class="slider"></span>
    </label>
  `,
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor() {}

  toggleTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.remove('dark-mode');
      this.isDarkMode = false;
    } else {
      document.body.classList.add('dark-mode');
      this.isDarkMode = true;
    }
  }
}
