import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostStorageService } from 'src/app/posts/post-storage.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading = false;

  constructor(
    private postStorageService: PostStorageService) { }

  panelOpenState = false;
  subscribtion: Subscription;

  posts: Post[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.postStorageService.getItems();
    this.subscribtion = this.postStorageService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    })
  }

  onDelete(postId: string){
    this.postStorageService.onDeletePost(postId);
    console.log(`postId: ${postId}`);
  }

  ngOnDestroy(){
    this.subscribtion.unsubscribe();
  }

}
