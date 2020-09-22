import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss']
})
export class HomeContentComponent implements OnInit {
  items = [];
  constructor() { }
  
  ngOnInit(): void {
    this.items = [
      {
        title: 'First slide label',
        description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
        imageUrl: '../../assets/images/Logo-slider/icon-left-font.png'
      },
      {
        title: 'Second slide label',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        imageUrl: '../../assets/images/Logo-slider/gratisography-219H.jpg'
      },
      {
        title: 'Third slide label',
        description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        imageUrl: '../../assets/images/Logo-slider/photo-6.jpg'
      }
    ]
  }

}
