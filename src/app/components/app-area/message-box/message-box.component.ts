import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactSelectionService } from '../../../services/contactSelection.service';

@Component({
  selector: 'app-message-box',
  imports: [MatIconModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBoxComponent implements AfterViewInit {
  @ViewChild('messageBox')
  messageBox: ElementRef<HTMLTextAreaElement>

  @Output()
  public messageSent = new EventEmitter<string>();

  public nickname = computed(() => this.contactSelectionService.getContact()?.name ?? null);

  private readonly contactSelectionService = inject(ContactSelectionService);

  ngAfterViewInit(): void {
    this.resizeMessagebox(this.messageBox.nativeElement);
  }

  public onKeyDown(e: KeyboardEvent) : void {
    const messageBox = e.target as HTMLTextAreaElement;
    if (e.key.toLowerCase() == 'enter') {
      this.sendMessage(messageBox);
      e.preventDefault();
    }
  }

  public onInput(e: Event) {
    const messageBox = e.target as HTMLTextAreaElement;
    this.resizeMessagebox(messageBox);
  }

  public resizeMessagebox(messageBox: HTMLTextAreaElement): void {
    messageBox.style.height = 'auto';
    messageBox.style.height = messageBox.scrollHeight + 'px';
  }

  public async sendMessage(messageBox: HTMLTextAreaElement): Promise<void> {
    const content = messageBox.value;
    messageBox.value = "";
    this.resizeMessagebox(messageBox);
    this.messageSent.emit(content);
  }
}
