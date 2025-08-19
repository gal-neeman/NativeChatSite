export class Message {
    public id: string;
    public clientId: string | null;
    public receiverId: string;
    public senderId: string;
    public content: string;
    public createdAt: Date;
}