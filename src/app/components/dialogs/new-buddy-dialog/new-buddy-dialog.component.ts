import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BotDto } from '../../../models/botDto.model';

@Component({
  selector: 'app-new-buddy-dialog',
  imports: [MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './new-buddy-dialog.component.html',
  styleUrl: './new-buddy-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBuddyDialogComponent {
  private dialogRef = inject(MatDialogRef<NewBuddyDialogComponent>);
  public buddyForm : FormGroup;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.buddyForm = this.formBuilder.group({
      nameControl: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      languageControl: new FormControl("", [Validators.required, Validators.min(0), Validators.max(5)])
    })
  }

  onSubmit() {
    const buddyData : BotDto = {
      name: this.buddyForm.get("nameControl").value,
      languageid: this.buddyForm.get("languageControl").value
    };

    this.dialogRef.close(buddyData);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
