import { Module } from '@nestjs/common';
import { ConfluenceHttpModule } from './confluence.http.module';
import { ConfluenceService } from './services/confluence.service';
import { ConfluenceController } from './confluence.controller';
import { ConfluenceDocumentService } from './services/confluence.page.service';

@Module({
  imports: [ConfluenceHttpModule.register()],
  providers: [ConfluenceService, ConfluenceDocumentService],
  controllers: [ConfluenceController],
  exports: [ConfluenceService, ConfluenceDocumentService],
})
export class ConfluenceModule {
  //
}
