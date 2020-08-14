import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../services/blogs.service';
import { BlogCreation } from '../models/blog-creation';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
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
  constructor(private blogsService: BlogsService,
              private token: TokenStorageService,
              private http: HttpClient,
              public fb: FormBuilder
              ) { 
                // Reactive Form
              this.uploadForm = this.fb.group({
                avatar: [null],
              })
              }

  ngOnInit(): void {
      this.blogSub = this.blogsService.blogs$.subscribe(
        (blogs) => {
          this.blogs = blogs;
        },
        (error) => {
          this.errorMsg = JSON.stringify(error)
        }
      );
    this.blogsService.getBlogs();
  }
  onSubmit() {
    console.log(this.form);
    this.info = {
      userId: this.token.getUserId(),
    };
    const userId = parseInt(this.info.userId);
    const fd = new FormData();
    fd.append('file', this.selectedFile);
    const imgType = "IMAGE";
    const textType = "TEXT";
    console.log(this.selectedFile);
    if(this.selectedFile != null){
    this.http.post('http://localhost:8080/api/create/post', fd).subscribe(
      res => console.log(res)
      )
    const MIME_TYPES = {
      'image/jpg': 'jpg',
      'image/jpeg': 'jpg',
      'image/png': 'png'
    };
    const imageUrl = 'http://localhost:8080/images/'+this.nameFile.split(' ').join('_')+ '.' + MIME_TYPES[this.typeFile];
      this.blogCreation = new BlogCreation(
        userId,
        this.form.title,
        this.form.content,
        imageUrl,
        imgType
        ) 
      console.log(this.blogCreation);
  
      this.blogsService.createBlog(this.blogCreation).subscribe(
        data => {
          console.log(data);
          this.reloadPage();
        },
        error => {
          console.log(error);
          this.errorMessage = error.error;
        }
      );
    }else{
      this.blogCreation = new BlogCreation(
        userId,
        this.form.title,
        this.form.content,
        this.form.imageUrl,
        textType
        ) 
      console.log(this.blogCreation);
  
      this.blogsService.createBlog(this.blogCreation).subscribe(
        data => {
          console.log(data);
          this.reloadPage();
        },
        error => {
          console.log(error);
          this.errorMessage = error.error;
        }
      );
    }
    
  }
  // Image Preview
  showPreview(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    console.log(file.name);
    console.log(this.selectedFile);
    console.log(file);
    this.nameFile = file.name;
    this.typeFile = file.type;
    console.log(this.nameFile);
    this.uploadForm.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  reloadPage() {
    window.location.reload();
  }

}
