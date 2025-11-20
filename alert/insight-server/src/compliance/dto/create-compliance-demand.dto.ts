import { IsOptional, IsString } from 'class-validator';

export class CreateComplianceDemandDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly schemeUrl: string;

  @IsString()
  readonly prdUrl: string;

  @IsString()
  @IsOptional()
  readonly publicAt: string;

  @IsString()
  @IsOptional()
  readonly patrol: string;

  @IsString()
  @IsOptional()
  readonly remark: string;

  @IsString()
  readonly owner: string;
}
