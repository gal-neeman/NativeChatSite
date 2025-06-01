import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BotBadgeComponent } from "../bot-badge/bot-badge.component";
import { Bot } from '../../../models/bot.model';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteBotComponent } from '../../dialogs/confirm-delete-bot/confirm-delete-bot.component';
import { ContactSelectionService } from '../../../services/contactSelection.service';

@Component({
  selector: 'app-bot-card',
  imports: [BotBadgeComponent, TitleCasePipe, MatIconModule],
  templateUrl: './bot-card.component.html',
  styleUrl: './bot-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotCardComponent {
  @Input()
  public bot: Bot;

  @Output()
  public onDelete = new EventEmitter<Bot>();

  private readonly dialog = inject(MatDialog);
  private readonly contactSelectionService = inject(ContactSelectionService);

  public confirmDelete() : void {
    const dialogRef = this.dialog.open(ConfirmDeleteBotComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete.emit(this.bot);
      }
    })

    // Stop event pipeline (so it doesn't reach wrapping div click event)
    event.stopPropagation();
  }

  public selectContact() : void {
    this.contactSelectionService.setSelected(this.bot);
  }
}
