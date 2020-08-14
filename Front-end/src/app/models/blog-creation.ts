export class BlogCreation {
    userId: number;
    title: string;
    content: string;
    imageUrl: string;
    postType: string
    constructor(userId: number, title: string, content: string, imageUrl: string, postType: string) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.postType = postType
    }
}

