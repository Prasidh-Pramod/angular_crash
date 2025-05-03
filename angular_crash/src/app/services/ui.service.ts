import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  public showAddTask: boolean = false;
  public subject = new Subject();

  constructor() { }

  onToggleTask(){
    this.showAddTask = !this.showAddTask;
    this.subject.next(this.showAddTask);
  }

  taskToggled() : Observable<any>{
    return this.subject.asObservable();
  }
}
