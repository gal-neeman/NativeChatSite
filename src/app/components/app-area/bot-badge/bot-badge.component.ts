import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-bot-badge',
  imports: [],
  templateUrl: './bot-badge.component.html',
  styleUrl: './bot-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotBadgeComponent {
  @Input()
  public initials: string;
}
