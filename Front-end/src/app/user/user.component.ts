import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../services/blogs.service';
import { BlogCreation } from '../models/blog-creation';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
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
  loading: boolean;
  errorMsg: string;
  info: any;
  constructor(private blogsService: BlogsService,
              private token: TokenStorageService) { }

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
    
    this.blogCreation = new BlogCreation(
      userId,
      this.form.title,
      this.form.content
      );

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

  reloadPage() {
    window.location.reload();
  }

}
