import { Component } from '@angular/core';
import { TASKS } from '../../../mock.task';
import { Task } from '../../../Task'
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { TaskService } from '../../services/task.service'
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, TaskItemComponent, AddTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  constructor(private taskService : TaskService){

  }
  tasks! : Task[];
  ngOnInit(){
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onTaskDeleted(task: Task) {
    this.taskService.deleteTasks(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }

  onToggle(task : Task){
    task.reminder = !task.reminder;
    this.taskService.updateTasks(task).subscribe();
  }

  addTask(event : Task){
    this.taskService.addTasks(event).subscribe(
      (task) =>{
        this.tasks.push(task);
      }
    );
  }
  
}
