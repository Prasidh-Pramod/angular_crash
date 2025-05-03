import { Component } from '@angular/core';
import { ButtonsComponent } from "../buttons/buttons.component";
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ButtonsComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title:string = 'task service';
  showAddtask!: boolean;
  subscription!: Subscription
  constructor(private uiService: UiService, private router: Router) {
    this.subscription = this.uiService
      .taskToggled()
      .subscribe((value) => (this.showAddtask = value));
  }

  toggleAddTask() {
    this.uiService.onToggleTask();
  }

  hasRoute(route: string) {
    return this.router.url === route;
  }
}
