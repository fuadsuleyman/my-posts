import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostStorageService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router) { }

  savePost(title: string, content: string){
    const post: Post = { id: null, title: title, content: content }
    this.http
      .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe(responseData =>{
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['all-posts']);
    })
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content};
    this.http.put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id = post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['all-posts']);
    });
  }

  // bizim Post modelimizde id field var, amma mongoDB bize _id verir
  // bunu fix etmek ucun gelen melumati transform edirik
  getItems() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  // take one post for editing
  getpost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
  }

  onDeletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      console.log(`Deleted! ${postId}`);
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  // asagidakina subscribe etmek lazimdi
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  clearCart() {
    this.posts = [];
    return this.posts;
  }

}
