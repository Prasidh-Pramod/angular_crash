import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() task! : Task;
  @Output() deleteTask = new EventEmitter();
  @Output() toggleReminder = new EventEmitter();
  faTimes = faTimes;

  onDeleteItems(task: Task){
    this.deleteTask.emit(task);
  }

  onToggleReminder(task : Task){
    this.toggleReminder.emit(task)
  }
}
