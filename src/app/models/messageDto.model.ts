export class MessageDto {
    public receiverId: string;
    public senderId: string;
    public content: string;
    public createdAt: Date;
    public clientId: string | null;
}