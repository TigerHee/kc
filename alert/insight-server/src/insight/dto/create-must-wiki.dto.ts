import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateMustWikiDataDto {
  @IsNumber()
  pageId: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
