import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../services/blogs.service';
import { BlogCreation } from '../models/blog-creation';
import { LikeInfo } from '../models/like-info';
import {LikeService} from '../services/like.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Like } from '../models/like';

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
  errorMsg: string;
  info: any;
  imageURL: string;
  selectedFile = null;
  uploadForm: FormGroup;
  nameFile = null;
  typeFile = null;
  likePending: boolean;
  liked: boolean;
  disliked: boolean;
  likeStatus = {
    like: this.liked,
    likePending: this.likePending
  };
  
  constructor(
    private blogsService: BlogsService,
    private likesService: LikeService,
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
    this.blogsService.getBlogs();
    // this.likesService.getLikes().then(
    //   (like: Like) => {
    //     console.log(like);
    //     console.log(this.token.getUserId());
    //     console.log(typeof(this.token.getUserId()));
    //     console.log(like[1].userId);
    //     for (let i in like) {
    //       console.log(i); // "0", "1", "2",
    //    }
    //    console.log("verification",like[0].isLike)
    //     if (like[1].isLike === -1 && like[1].userId === parseInt(this.token.getUserId())) {
    //       this.disliked = true
    //     }
    //     if (like[1].isLike === 1 && like[1].userId === parseInt(this.token.getUserId())) {
    //       this.liked = true
    //     }
    //   }
    // )
  }
  onSubmit() {
    console.log(this.form);
    this.info = {
      userId: this.token.getUserId(),
    };
    const userId = parseInt(this.info.userId);
    const imgType = 'IMAGE';
    const textType = 'TEXT';
    const MIME_TYPES = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png',
      }; 

    const fd = new FormData();
    fd.append('file', this.selectedFile);
    console.log(this.selectedFile);

    if (this.selectedFile != null) {
      this.http
        .post('http://localhost:8080/api/upload/image', fd)
        .subscribe((res) => {
          console.log(res);
          console.log(res["filename"])
          const imageUrl = 'http://localhost:8080/images/' + res["filename"];
          this.createPost(userId, imgType, imageUrl);
        
        });      
    } else {
      this.createPost(userId, textType, '');
    }
  }


  createPost(userId, postType, imageUrl) {
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
  showPreview(event) {
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
  
  onLike(event) {
    let blogId = event.getAttribute('data-id');
    console.log("Blog Id: ", blogId);
    console.log('userId', parseInt(this.token.getUserId()));
    const newLike = new LikeInfo(parseInt(this.token.getUserId()),1)
    this.blogsService.likeBlog(blogId, newLike).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
        // this.liked = true    
      }
    )

  }
  onDislike(event) {
    let blogId = event.getAttribute('data-id');
    console.log("Blog Id: ", blogId);
    const newLike = new LikeInfo(parseInt(this.token.getUserId()),-1)
    this.blogsService.dislikeBlog(blogId, newLike).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
        // this.disliked = true
      }
    )
  }
}
