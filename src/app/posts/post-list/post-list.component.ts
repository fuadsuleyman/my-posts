import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostStorageService } from 'src/app/posts/post-storage.service';
import {PageEvent} from '@angular/material/paginator';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  isLoading = false;
  panelOpenState = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  userId: string;
  pageSizeOptions = [1, 2, 5, 10];
  private subscribtion: Subscription;

  constructor(
    private postStorageService: PostStorageService,
    private authService: AuthService) { }

  posts: Post[] = [];

  ngOnInit() {
    this.isLoading = true;
    this.postStorageService.getItems(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.subscribtion = this.postStorageService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postStorageService.deletePost(postId).subscribe(()=>{
      this.postStorageService.getItems(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    })
  }

  ngOnDestroy(){
    this.subscribtion.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postStorageService.getItems(this.postsPerPage, this.currentPage);

  }

}







