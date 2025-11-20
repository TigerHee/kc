import { Module } from '@nestjs/common';
import { PuppeteerService } from './services/puppeteer.service';
import { PuppeteerController } from './puppeteer.controller';
import { PuppeteerCoreModule } from './puppeteer.core.module';

@Module({
  imports: [PuppeteerCoreModule.register()],
  providers: [PuppeteerService],
  controllers: [PuppeteerController],
  exports: [PuppeteerService],
})
export class PuppeteerModule {
  //
}
