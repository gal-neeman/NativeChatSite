import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [RouterOutlet],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent implements OnInit{
  private readonly router = inject(Router);

  ngOnInit(): void {
    //this.router.navigateByUrl("login");
  }
}
