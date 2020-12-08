import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-social-networking';
  storedPosts: Post[] = [];

  onPostCreated(post) {
    // console.log("POST ", post);
    this.storedPosts.push(post);
  }
}
