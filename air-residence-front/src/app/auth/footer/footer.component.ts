import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="d-none d-md-flex p-h-40 justify-content-between">
      <span class="">© 2022 AirResidence</span>
      <ul class="list-inline">
        <li class="list-inline-item">
          <a class="text-dark text-link" href="">Ligjore</a>
        </li>
        <li class="list-inline-item">
          <a class="text-dark text-link" href="">Privatësia</a>
        </li>
      </ul>
    </div>
  `,
  styles: [],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
