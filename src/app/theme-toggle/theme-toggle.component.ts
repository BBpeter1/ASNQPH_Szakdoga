import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from '../services/theme.service';

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

  constructor(private themeService: ThemeService, private renderer: Renderer2) {
    this.themeService.isDarkTheme$.subscribe((isDarkTheme) => {
      this.isDarkMode = isDarkTheme;
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkTheme();
    if (this.themeService.isDarkModeEnabled()) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkTheme();
  }
}
