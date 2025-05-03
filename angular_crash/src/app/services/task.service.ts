import { Injectable } from '@angular/core';
import { TASKS } from '../../mock.task';
import { Task } from '../../Task';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks'
  constructor(private http:HttpClient) { }

  getTasks() : Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
    // const tasks= of(TASKS);
    // return tasks;
  }

  deleteTasks(task : Task) : Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.delete<Task>(url);
  }

  updateTasks(task : Task) : Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<Task>(url,task);
  }

  addTasks(task : Task) : Observable<Task> {
    return this.http.post<Task>(this.apiUrl,task);
  }
}
