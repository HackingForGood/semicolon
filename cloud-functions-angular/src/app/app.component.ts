/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MdSnackBar } from '@angular/material';
import * as firebase from 'firebase';

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: Observable<firebase.User>;
  currentUser: firebase.User;
  messages: FirebaseListObservable<any>;
  profilePicStyles: {};
  topics = '';
  value = '';

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public snackBar: MdSnackBar) {
    this.user = afAuth.authState;
    this.user.subscribe((user: firebase.User) => {
      console.log(user);
      this.currentUser = user;

      if (user) { // User is signed in!
        this.profilePicStyles = {
          'background-image':  `url(${this.currentUser.photoURL})`
        };


        // We save the Firebase Messaging Device token and enable notifications.
        this.saveMessagingDeviceToken();
      } else { // User is signed out!
        this.profilePicStyles = {
          'background-image':  PROFILE_PLACEHOLDER_IMAGE_URL
        };
        this.topics = '';
      }
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }



  // Saves the messaging device token to the datastore.
  saveMessagingDeviceToken() {
    return firebase.messaging().getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('Got FCM device token:', currentToken);
          // Save the Device Token to the datastore.
          firebase.database()
            .ref('/fcmTokens')
            .child(currentToken)
            .set(this.currentUser.uid);
        } else {
          // Need to request permissions to show notifications.
          return this.requestNotificationsPermissions();
        }
      }).catch((err) => {

        // this.snackBar.open('Unable to get messaging token.', null, {
          // duration: 5000
        // });
        console.error(err);
      });
  };


    // Requests permissions to show notifications.
    requestNotificationsPermissions() {
      console.log('Requesting notifications permission...');
      return firebase.messaging().requestPermission()
        // Notification permission granted.
        .then(() => this.saveMessagingDeviceToken())
        .catch((err) => {
          this.snackBar.open('Unable to get permission to notify.', null, {
            duration: 5000
          });
          console.error(err);
        });
    };




}
