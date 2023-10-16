import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (environment.demo) {
  import('./mocks/browser').then(({ worker }) => {
    // get base href
    // const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
    // trim left slash
    // const workerBaseHref = baseHref.replace(/^\//, '');
    worker.start({
      serviceWorker: {
        url: `mockServiceWorker.js`,
      },
    });
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
} else {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
