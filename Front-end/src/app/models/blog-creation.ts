export class BlogCreation {
    userId: number;
    title: string;
    content: string;
    constructor(userId: number, title: string, content: string) {
        this.userId = userId;
        this.title = title;
        this.content = content;
    }
}
