import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  postForm: FormGroup;
  mode: string = 'create';
  postId: string;
  post: any = {};
  isLoading;
  imagePreview;

  loadingSubscription = new Subscription();
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(private postsService: PostsService, private http: HttpClient,
    private activatedRoute: ActivatedRoute, private router: Router, private snackbar: MatSnackBar) {
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', [Validators.required]),
      imagePath: new FormControl('', { validators: [Validators.required] })
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // console.log("post id ", this.postId);
        this.isLoading = true;
        this.postsService.getPostById(this.postId).subscribe((res: any) => {
          console.log("res", res.post);
          this.isLoading = false;
          this.post = res.post;
          this.imagePreview = this.post.imagePath;
          this.postForm.setValue({
            title: this.post.title,
            content: this.post.content,
            imagePath: this.post.imagePath
          })
        }, (err) => {
          console.log(err);
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })

    // this.loadingSubscription = this.postsService.isLoadingSubj.subscribe(loadingStatus => {
    //   // console.log("Loading status", loadingStatus)
    //   this.isLoading = loadingStatus
    // })
  }

  // onAddPost(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   } else {
  //     const post: Post = {
  //       title: form.value.title,
  //       content: form.value.content
  //     };
  //     // this.postCreated.emit(post);
  //     this.postsService.createPost(post);
  //     form.resetForm();
  //   }
  // }

  onAddPost() {
    if (this.postForm.invalid) {
      return
    } else {

      if (this.mode === 'create') {
        const post = {
          _id: '',
          title: this.postForm.controls.title.value,
          content: this.postForm.controls.content.value,
          image: this.postForm.controls.imagePath.value
        }
        this.postsService.createPost(post.title, post.content, post.image);

      } else {
        const updatedpost = {
          _id: this.postId,
          title: this.postForm.controls.title.value,
          content: this.postForm.controls.content.value,
          image: this.postForm.controls.imagePath.value
        }

        this.postsService.editPost({ _id: this.postId, post: updatedpost })
      }

      // this.postForm.reset();
    }
  }

  onImageChange(event: Event) {
    // console.log("event ", event);
    const file = (event.target as HTMLInputElement).files[0];
    // console.log("file ", file);
    this.postForm.patchValue({ imagePath: file });
    this.postForm.get('imagePath').updateValueAndValidity();
    // console.log("postform ", this.postForm);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);

  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}

