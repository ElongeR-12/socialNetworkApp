import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../services/blogs.service';
import { BlogCreation } from '../models/blog-creation';
import { LikeInfo } from '../models/like-info';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  form: any = {};
  blogCreation: BlogCreation;
  errorMessage = '';
  blogSub: Subscription;
  blogs: BlogCreation[];
  blog: BlogCreation;
  errorMsg: string;
  info: any;
  imageURL: string;
  selectedFile = null;
  uploadForm: FormGroup;
  nameFile = null;
  typeFile = null;
  total: number;
  
  
  constructor(
    private blogsService: BlogsService,
    private token: TokenStorageService,
    private http: HttpClient,
    public fb: FormBuilder,
    private router: Router
  ) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
    });
  }

  ngOnInit(): void {
    this.blogSub = this.blogsService.blogs$.subscribe(
      (blogs) => {
        this.blogs = blogs;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
      }
    );
    this.total;
    this.blogsService.getBlogs();
    this.blogsService.getBlogAssociationWithConnectedLikers(parseInt(this.token.getUserId())).then(
      (blogs: BlogCreation) => {
        this.styleLikeAndDislike(blogs)
      }
    )
  }
  onSubmit() {
    console.log(this.form);
    this.info = {
      userId: this.token.getUserId(),
    };
    const userId = parseInt(this.info.userId);
    const imgType = 'IMAGE';
    const textType = 'TEXT';
    const textAndImageType = 'TEXT-IMAGE';
    const MIME_TYPES = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png',
      }; 

    const fd = new FormData();
    fd.append('file', this.selectedFile);
    console.log(this.selectedFile);

    if (this.selectedFile != null && this.form.content == null) {
      this.http
        .post('http://localhost:8080/api/upload/image', fd)
        .subscribe((res) => {
          console.log(res);
          console.log(res["filename"])
          const imageUrl = 'http://localhost:8080/images/' + res["filename"];
          this.createPost(userId, imgType, imageUrl);
        
        });      
    } else if  (this.selectedFile != null && this.form.content != null){
      this.http
        .post('http://localhost:8080/api/upload/image', fd)
        .subscribe((res) => {
          console.log(res);
          console.log(res["filename"])
          const imageUrl = 'http://localhost:8080/images/' + res["filename"];
          this.createPost(userId, textAndImageType, imageUrl);
        });
    }else {
      this.createPost(userId, textType, '');
    }
  }

  styleLikeAndDislike(blogs: BlogCreation){
    console.log(blogs);
    for (let element in blogs){
      const likeButton = document.querySelectorAll(`[data-id='${blogs[element].id}']`)[0].children[0].children[0];
      const dislikeButton = document.querySelectorAll(`[data-id='${blogs[element].id}']`)[0].children[1].children[0];
        if(blogs[element].likers[0].likes.isLike === 1){
          likeButton.classList.add("fas", "liked");
          dislikeButton.classList.add("d-none");
        }else if(blogs[element].likers[0].likes.isLike === -1){
          dislikeButton.classList.add("fas", "disliked");
          likeButton.classList.add("d-none");
        }else{
          likeButton.classList.add("far");
          dislikeButton.classList.add("far");
        }
    }
  }

  createPost(userId: number, postType: string, imageUrl: string) {
    this.blogCreation = new BlogCreation(
      userId,
      this.form.title,
      this.form.content,
      imageUrl,
      postType
    );
    console.log(this.blogCreation);

    this.blogsService.createBlog(this.blogCreation).subscribe(
      (data) => {
        console.log(data);
        this.reloadPage();
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error;
      }
    );
  }

  // Image Preview
  showPreview(event: { target: HTMLInputElement; }) {
    this.selectedFile = event.target.files[0];
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file,
    });
    this.nameFile = file.name;
    this.typeFile = file.type;
    console.log(this.nameFile);
    this.uploadForm.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  reloadPage() {
    window.location.reload();
  }
  
  onLike(event: { getAttribute: (arg0: string) => any; }) {
    let blogId = event.getAttribute('data-id');
    this.blogsService.getBlogById(blogId).then(
      (blog: BlogCreation) => {
        this.blog = blog;
        const newLike = new LikeInfo(parseInt(this.token.getUserId()),1)
        this.blogsService.likeBlog(blogId, newLike).subscribe(
          (response) => {
            this.styleLikeAndConterDisplay(blog, response)
          }
        )
      }
    );
  }
  styleLikeAndConterDisplay(blog: BlogCreation, response: string){
    const likeButton = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].children[0].children[0];
    const dislikeButton = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].children[1].children[0];
    const likesTextContent = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].parentElement.parentElement.parentElement.childNodes[1].lastChild.firstChild;
    if(this.blog['likes'] < response['likes']){
      likeButton.classList.add("fas", "liked");
      dislikeButton.classList.add("d-none");
      this.total = this.blog['likes']+1;
      likesTextContent.textContent = this.total + ' Like(s)'
    }else if(this.blog['likes'] > response['likes']){
      dislikeButton.classList.remove("d-none");
      likeButton.classList.remove("fas", "liked");
      likeButton.classList.add("far");
      dislikeButton.classList.add("far");
      this.total = this.blog['likes']-1;
      likesTextContent.textContent = this.total + ' Like(s)'
    }
  }
  onDislike(event: { getAttribute: (arg0: string) => any; }) {
    let blogId = event.getAttribute('data-id');
    this.blogsService.getBlogById(blogId).then(
      (blog: BlogCreation) => {
        this.blog = blog;
        const newLike = new LikeInfo(parseInt(this.token.getUserId()),-1)
        this.blogsService.likeBlog(blogId, newLike).subscribe(
          (response) => {
            this.styleDislikeAndConterDisplay(blog, response)
          }
        )
      }
    );
  }

  styleDislikeAndConterDisplay(blog: BlogCreation, response: string){
    const likeButton = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].children[0].children[0];
    const dislikeButton = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].children[1].children[0];
    const likesTextContent = document.querySelectorAll(`[data-id='${blog['id']}']`)[0].parentElement.parentElement.parentElement.childNodes[1].lastChild.firstChild;
    if(this.blog['likes'] > response['likes']){
      dislikeButton.classList.add("fas", "disliked");
      likeButton.classList.add("d-none");
      this.total = this.blog['likes']-1;
      likesTextContent.textContent = this.total + ' Like(s)'
    }else if(this.blog['likes'] < response['likes']){
      likeButton.classList.remove("d-none");
      dislikeButton.classList.remove("fas", "liked");
      likeButton.classList.add("far");
      dislikeButton.classList.add("far");
      this.total = this.blog['likes']+1;
      likesTextContent.textContent = this.total + ' Like(s)'
    }
  }
}
