import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import * as firebase from 'firebase';
import { Input, Output, EventEmitter } from '@angular/core';

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';


@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent implements OnInit {
  @Input() course: FirebaseObjectObservable<any>;
  @Input() messages: FirebaseListObservable<any>;

  topics = '';
  value = '';
  user: Observable<firebase.User>;
  currentUser: firebase.User;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public snackBar: MdSnackBar
  ) {

    this.user = afAuth.authState;
    this.user.subscribe((user: firebase.User) => {
      console.log(user);
      this.currentUser = user;
    });

    debugger;

    // // We load currently existing chat messages.
    // this.messages = course.messages;

    // this.messages = this.db.list('/messages', {
    //   query: {
    //     limitToLast: 12
    //   }
    // });

    //
    // this.messages.subscribe((messages) => {
    //
    //   // Calculate list of recently discussed topics
    //   const topicsMap = {};
    //   const topics = [];
    //   let hasEntities = false;
    //   messages.forEach((message) => {
    //     if (message.entities) {
    //       for (let entity of message.entities) {
    //         if (!topicsMap.hasOwnProperty(entity.name)) {
    //           topicsMap[entity.name] = 0
    //         }
    //         topicsMap[entity.name] += entity.salience;
    //         hasEntities = true;
    //       }
    //     }
    //   });
    //   if (hasEntities) {
    //     for (let name in topicsMap) {
    //       topics.push({ name, score: topicsMap[name] });
    //     }
    //     topics.sort((a, b) => b.score - a.score);
    //     this.topics = topics.map((topic) => topic.name).join(', ');
    //   }
    //
    //   // Make sure new message scroll into view
    //   setTimeout(() => {
    //     const messageList = document.getElementById('messages');
    //     messageList.scrollTop = messageList.scrollHeight;
    //     document.getElementById('message').focus();
    //   }, 500);
    // });
    //


   }

  ngOnInit() {

    // this.course.subscribe(course => {
    //
    //
    // })
    this.messages.subscribe(messages => {

      debugger;

    })
  }

  // TODO: Refactor into text message form component
  saveMessage(event: any, el: HTMLInputElement) {
    event.preventDefault();

    if (this.value && this.checkSignedInWithMessage()) {
      // Add a new message entry to the Firebase Database.
      const messages = this.messages;
      messages.push({
        name: this.currentUser.displayName,
        text: this.value,
        photoUrl: this.currentUser.photoURL || PROFILE_PLACEHOLDER_IMAGE_URL
      }).then(() => {
        // Clear message text field and SEND button state.
        el.value = '';
      }).catch((err) => {
        this.snackBar.open('Error writing new message to Firebase Database.', null, {
          duration: 5000
        });
        console.error(err);
      });
    }
  }

  // TODO: Refactor into image message form component
  saveImageMessage(event: any) {
    event.preventDefault();
    const file = event.target.files[0];

    // Clear the selection in the file picker input.
    const imageForm = <HTMLFormElement>document.getElementById('image-form');
    imageForm.reset();

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      this.snackBar.open('You can only share images', null, {
        duration: 5000
      });
      return;
    }

    // Check if the user is signed-in
    if (this.checkSignedInWithMessage()) {

      // We add a message with a loading icon that will get updated with the shared image.
      const messages = this.db.list('/messages');
      messages.push({
        name: this.currentUser.displayName,
        imageUrl: LOADING_IMAGE_URL,
        photoUrl: this.currentUser.photoURL || PROFILE_PLACEHOLDER_IMAGE_URL
      }).then((data) => {
        // Upload the image to Cloud Storage.
        const filePath = `${this.currentUser.uid}/${data.key}/${file.name}`;
        return firebase.storage().ref(filePath).put(file)
          .then((snapshot) => {
            // Get the file's Storage URI and update the chat message placeholder.
            const fullPath = snapshot.metadata.fullPath;
            const imageUrl = firebase.storage().ref(fullPath).toString();
            return firebase.storage().refFromURL(imageUrl).getMetadata();
          }).then((metadata) => {
            // TODO: Instead of saving the download URL, save the GCS URI and
            //       dynamically load the download URL when displaying the image
            //       message.
            return data.update({
              imageUrl: metadata.downloadURLs[0]
            });
          });
      }).catch((err) => {
        this.snackBar.open('There was an error uploading a file to Cloud Storage.', null, {
          duration: 5000
        });
        console.error(err);
      });
    }
  }

  // TODO: Refactor into image message form component
  onImageClick(event: any) {
    event.preventDefault();
    document.getElementById('mediaCapture').click();
  }

  // Returns true if user is signed-in. Otherwise false and displays a message.
  checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (this.currentUser) {
      return true;
    }

    this.snackBar
      .open('You must sign-in first', 'Sign in', {
        duration: 5000
      })
      .onAction()
      .subscribe(() => true);

    return false;
  };

  // TODO: Refactor into text message form component
  update(value: string) {
    this.value = value;
  }

}
