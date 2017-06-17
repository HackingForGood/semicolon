import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../course.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase,FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  id: any;
  messages: FirebaseListObservable<any[]>;
  announcements: any[];

  course: FirebaseObjectObservable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.messages = this.courseService.getMessages(this.id);
      this.course = this.courseService.getCourse(this.id);
    })
    //
    // this.course.subscribe(result => {
    //   this.announcements = result.announcements;
    // });
  }

}
