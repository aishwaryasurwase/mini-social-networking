import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PostsComponent } from './posts.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        PostsComponent,
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        AngularMaterialModule,
        ReactiveFormsModule,
        CommonModule,
        BrowserModule,
        RouterModule
    ]
})
export class PostModule { }