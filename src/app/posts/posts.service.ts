import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
// http://localhost:3100/api/
const BACKEND_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  isLoadingSubj = new Subject();

  constructor(private http: HttpClient, private snackbar: MatSnackBar, private router: Router) { }

  getPosts(postPerPage: number, currentPageIndex: number) {
    const queryParams = `?pagesize=${postPerPage}&currentpage=${currentPageIndex}`
    return this.http.get<{ message: string, posts: Post[], maxPosts: number }>(BACKEND_URL + "posts" + queryParams)
    // return this.http.get<{ message: string, posts: any }>("http://localhost:3100/api/posts").pipe(map((postData) => {
    //   return postData.posts.map(post => {
    //     return {
    //       id: post._id,
    //       title: post.title,
    //       content: post.content
    //     }
    //   })
    // }))
  }

  getPostById(id: string) {
    return this.http.get(BACKEND_URL + `getPostById/${id}`)
  }

  createPost(title: string, content: string, image: File) {
    this.isLoadingSubj.next(true);
    // console.log("On create service ", post);

    const postData = new FormData();
    postData.append('_id', '');
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    // const token = localStorage.getItem('token');
    // console.log("token ", token);
    // const httpHeaders = new HttpHeaders({ "Authorization": "Bearer " + token });

    // this.http.post<{ message: string, post: Post }>("http://localhost:3100/api/addPost", postData, { headers: httpHeaders }).subscribe(res => {
    this.http.post<{ message: string, post: Post }>(BACKEND_URL + "addPost", postData).subscribe(res => {
      console.log("Response ", res.post._id, res.post.content, res.post.title, res.post.imagePath);
      this.snackbar.open("Post created successfully", null, {
        duration: 3000
      })
      this.isLoadingSubj.next(false);
      this.router.navigate(['/'])
    });
  }

  editPost(data) {
    let id = data._id;
    let post = data.post;
    console.log(data._id, data.post);
    let postData;

    if (typeof (post.image) == 'object') {
      postData = new FormData();
      postData.append('_id', id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        _id: id,
        title: post.title,
        content: post.content,
        image: post.image
      }
    }
    this.isLoadingSubj.next(true);
    // const token = localStorage.getItem('token');
    // console.log("token ", token);
    // const httpHeaders = new HttpHeaders({ "Authorization": "Bearer " + token });

    // this.http.put(`http://localhost:3100/api/editPost/${id}`, postData, { headers: httpHeaders }).subscribe(res => {
    this.http.put(BACKEND_URL + `editPost/${id}`, postData).subscribe((res: any) => {
      // console.log("Updated ", res);
      // alert("Update Successfully");
      // if (res.post) {
      this.snackbar.open("Post updated successfully", null, {
        duration: 3000
      })
      // } else {
      //   this.snackbar.open(res.data, null, {
      //     duration: 3000
      //   })
      // }
      this.isLoadingSubj.next(false);
      this.router.navigate(['/'])
    }, (err) => {
      console.log("error", err);
      this.isLoadingSubj.next(false);
      this.snackbar.open("Failed to update the post", null, {
        duration: 3000
      })
    })
  }

  deletePost(id) {
    // const token = localStorage.getItem('token');
    // console.log("token ", token);
    // const httpHeaders = new HttpHeaders({ "Authorization": "Bearer " + token });

    // return this.http.delete(`http://localhost:3100/api/deletePost/${id}`, { headers: httpHeaders })
    return this.http.delete(BACKEND_URL + `deletePost/${id}`)
  }

}
