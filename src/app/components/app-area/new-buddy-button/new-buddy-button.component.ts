import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NewBuddyDialogComponent } from '../../dialogs/new-buddy-dialog/new-buddy-dialog.component';
import { BotDto } from '../../../models/botDto.model';

@Component({
  selector: 'app-new-buddy-button',
  imports: [MatIconModule],
  templateUrl: './new-buddy-button.component.html',
  styleUrl: './new-buddy-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBuddyButtonComponent {
  @Output()
  public onAddBot = new EventEmitter<BotDto>();
  
  private dialog = inject(MatDialog);

  public showDialog(): void {
    const dialogRef = this.dialog.open(NewBuddyDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onAddBot.emit(result)
      }
    })
  }
}
