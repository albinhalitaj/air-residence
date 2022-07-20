import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content justify-content-between">
        <p class="m-b-0">
          E drejta e autorit © AirResidences. Të gjitha të drejtat e rezervuara.
        </p>
        <span>
          <a href="" class="text-gray m-r-15">Termat &amp; Kushtet</a>
          <a href="" class="text-gray">Privatësia &amp; Politika</a>
        </span>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
