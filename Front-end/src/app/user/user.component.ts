import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlogsService } from '../services/blogs.service';
import { BlogCreation } from '../models/blog-creation';
import { LikeInfo } from '../models/like-info';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  private uploadImageUrl = 'http://localhost:8080/api/upload/image';
  private filenameUrl = 'http://localhost:8080/images/';
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
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  allBlogs: any;
  authorities:string[];
 

  constructor(
    private blogsService: BlogsService,
    private token: TokenStorageService,
    private http: HttpClient,
    public fb: FormBuilder,
  ) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
    });
  }

  ngOnInit(): void {   
    this.retrieveBlogs();
    this.total;
    this.authorities = this.token.getAuthorities();
  }

  displayStyle(){
    this.blogsService.getBlogAssociationWithConnectedLikers(parseInt(this.token.getUserId())).then(
      (blogs: BlogCreation[]) => {
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
        'image/gif': 'gif',
      }; 

    const fd = new FormData();
    fd.append('file', this.selectedFile);
    console.log(this.selectedFile);

    if (this.selectedFile != null && this.form.content == null) {
      this.http
        .post(this.uploadImageUrl, fd)
        .subscribe((res) => {
          console.log(res);
          console.log(res["filename"])
          const imageUrl = this.filenameUrl + res["filename"];
          this.createPost(userId, imgType, imageUrl);
        
        });      
    } else if  (this.selectedFile != null && this.form.content != null){
      this.http
        .post(this.uploadImageUrl, fd)
        .subscribe((res) => {
          console.log(res);
          console.log(res["filename"])
          const imageUrl = this.filenameUrl + res["filename"];
          this.createPost(userId, textAndImageType, imageUrl);
        });
    }else {
      this.createPost(userId, textType, '');
    }
  }

  styleLikeAndDislike(blogs: BlogCreation[]){
    for (let element of blogs){
      console.log(document.querySelectorAll(`[data-id='${element['id']}']`)[0]);
      if(document.querySelectorAll(`[data-id='${element['id']}']`)[0] == undefined){
        console.log('Ignore')
      }else{
      const likeButton = document.querySelectorAll(`[data-id='${element['id']}']`)[0].children[0].children[0];
      const dislikeButton = document.querySelectorAll(`[data-id='${element['id']}']`)[0].children[1].children[0];
        if(element['likers']!=undefined && element['likers'].length>0 && element['likers'][0].likes.isLike === 1){
          likeButton.classList.add("fas", "liked");
          dislikeButton.classList.add("d-none");
        }else if(element['likers']!=undefined && element['likers'].length>0 && element['likers'][0].likes.isLike === -1){
          dislikeButton.classList.add("fas", "disliked");
          likeButton.classList.add("d-none");
        }else{
          likeButton.classList.add("far");
          dislikeButton.classList.add("far");
        }
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
    const blogId = event.getAttribute('data-id');
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
    const blogId = event.getAttribute('data-id');
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

  getRequestParams( page: number, pageSize: number): any {
    let params = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }

  retrieveBlogs(): void {
    const params = this.getRequestParams(this.page, this.pageSize);
    console.log(params);
    this.blogsService.getAll(params)
      .subscribe(
        response => {
          const { blogs, totalItems } = response;
          this.allBlogs = blogs;
          this.count = totalItems; 
          this.displayStyle();  
        },
        error => {
          console.log(error);
        });
    
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveBlogs();
  }
  
  handlePageSizeChange(event: { target: { value: number; }; }): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveBlogs();
  }
  delete(event: { getAttribute: (arg0: string) => any; }): void {
    const blogId = event.getAttribute('data-id');
    this.blogsService.deleteBlog(parseInt(blogId)).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
      }
    )
  }
}
