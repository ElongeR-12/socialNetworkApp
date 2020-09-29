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
        title: 'Groupomania agency place',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        imageUrl: '../../assets/images/Logo-slider/gratisography-219H.jpg'
      },
      {
        title: 'Groupomania, Design and development',
        description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        imageUrl: '../../assets/images/Logo-slider/photo-6.jpg'
      },
      {
        title: 'Groupomania, workshop time',
        description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        imageUrl: '../../assets/images/Logo-slider/devis-workshop.jpg'
      },
      {
        title: 'Groupomania, workshop time',
        description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        imageUrl: '../../assets/images/Logo-slider/image-workshop.jpg'
      }
    ]
  }

}
