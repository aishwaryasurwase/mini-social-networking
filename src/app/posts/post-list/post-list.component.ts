import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    // @Input() posts: Post[] = [];
    isLoading;
    posts: Post[] = [];
    pageSizeOptions = [2, 5, 10];
    totalPosts;
    noPost = false;

    postPerPage = 2;
    currentPageIndex = 1;
    userAuthenticated = false;
    authSubscription: Subscription;
    userId;

    constructor(private postsService: PostsService, private router: Router, private authService: AuthService,
        private snackbar: MatSnackBar) { }
    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postPerPage, this.currentPageIndex).subscribe(res => {
            this.isLoading = false;
            console.log("RESPONSE ", res.posts)
            this.posts = res.posts;
            this.totalPosts = res.maxPosts;
            if (this.totalPosts <= 0) {
                this.noPost = true;
            }
        });
        this.userId = this.authService.getUserId();
        this.userAuthenticated = this.authService.isAuthenticated();
        this.authSubscription = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userAuthenticated = isAuthenticated;
        })
    }

    onChangedPage(pageData: PageEvent) {
        console.log("page data", pageData.pageIndex, pageData.pageSize);
        this.currentPageIndex = pageData.pageIndex + 1;
        this.isLoading = true;
        this.postsService.getPosts(pageData.pageSize, this.currentPageIndex).subscribe(res => {
            this.isLoading = false;
            console.log("RESPONSE ", res.posts)
            this.posts = res.posts;
        });;
    }

    postDelete(id) {
        console.log("post id ", id);
        this.isLoading = true;
        this.postsService.deletePost(id).subscribe(res => {
            console.log("POST DELETE ", res);
            this.snackbar.open("Delete the post successfully", null, {
                duration: 3000
            })
            this.ngOnInit();
        }, (err) => {
            console.log("Error", err);
            this.isLoading = false;
            this.snackbar.open("Failed to delete the post", null, {
                duration: 3000
            })
        })
    }

    postEdit(id) {
        // console.log("post id ", id);
        // this.postsService.getPostById()
        this.router.navigate([`/edit/${id}`])
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

}