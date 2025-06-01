import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-bot',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-bot.component.html',
  styleUrl: './confirm-delete-bot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteBotComponent {

}
