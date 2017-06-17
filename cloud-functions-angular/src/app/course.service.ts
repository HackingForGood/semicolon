import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable, Subscription} from 'rxjs/Rx';

@Injectable()
export class CourseService {
  courses: FirebaseListObservable<any>;
  constructor(    private db: AngularFireDatabase,
  ) {
    this.courses = db.list('/courses');
  }

  getCourse(courseId: any): FirebaseObjectObservable<any[]> {
    return this.db.object(`/courses/${courseId}`);
  }

  getMessages(courseId: any): FirebaseListObservable<any[]> {
    return this.db.list(`/courses/${courseId}/messages`);
  }

}
