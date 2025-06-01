import { Injectable, Signal, signal } from "@angular/core";
import { Bot } from "../models/bot.model";

@Injectable({
    providedIn: "root"
})
export class ContactSelectionService {
    private selectedContactSignel = signal<Bot | null>(null);

    public setSelected(contact: Bot) {
        this.selectedContactSignel.set(contact);
    }

    public get getContact() : Signal<Bot | null> {
        return this.selectedContactSignel.asReadonly();
    }
}