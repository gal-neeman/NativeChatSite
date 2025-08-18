import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-seperator',
  imports: [],
  templateUrl: './date-seperator.component.html',
  styleUrl: './date-seperator.component.css'
})
export class DateSeperatorComponent implements OnInit {
  @Input() date: Date;
  formattedDate: string;

  ngOnInit(): void {
    this.formattedDate = this.GetFormattedDate(this.date);
  }

  public GetFormattedDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const formatted = `${day} ${month} ${year}`;
    return formatted;
  }
}
