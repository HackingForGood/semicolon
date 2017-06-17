import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MessageCardComponent } from './message-card/message-card.component';

import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  // basic routes
  // { path: '', redirectTo: 'messages', pathMatch: 'full' },
  { path: '', redirectTo: 'course/list', pathMatch: 'full' },

  { path: 'messages', component: MessageCardComponent },
  { path: 'course/list', component: CourseListComponent },
  { path: 'course/:id', component: CourseDetailComponent },
];
