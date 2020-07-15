import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostStorageService } from '../post-storage.service'
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  imagePreview: string;
  isLoading = false;
  post: Post;
  postForm: FormGroup;

  constructor(
    private postStorageService: PostStorageService,
    private route: ActivatedRoute
    ) { }

    // setValue update vaxti geri qaytarir melumatlari forma
  ngOnInit(): void {
    this.postForm = new FormGroup({
      'title': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'content': new FormControl('', [Validators.required]),
      'image': new FormControl('', { validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postStorageService.getpost(this.postId)
        .subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
          this.postForm.setValue({'title': this.post.title, 'content': this.post.content})
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }

    })
  }

  get title() { return this.postForm.get('title'); }
  get content() { return this.postForm.get('content'); }
  get image() { return this.postForm.get('image'); }

  postsArr = [];

  tepmStr: string;

  onSavePost(){
    if(this.postForm.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postStorageService.savePost(this.postForm.value.title, this.postForm.value.content);
    } else {
      this.postStorageService.updatePost(this.postId, this.postForm.value.title, this.postForm.value.content);
    }
    // asagidaki 2 deneni setri yazdimki resetden sonra qirmizi olmasin
    this.postForm.markAsPristine();
    this.postForm.markAsUntouched();
    this.postForm.reset();
  }

  onImagePicker(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({'image': file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getErrorMessage() {
    if (this.title.hasError('required')) {
      return 'You must enter a value!';
    } else {
      return this.title.hasError('minlength') ? 'Minimum length must be 3 simvol' : '';
    }

   }

}
