import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';
import { CreateComplianceDemandDto } from '../dto/create-compliance-demand.dto';
import { ComplianceAtomic } from '../schemas/compliance-atomic.schema';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {
    //
  }

  @Get('atomic')
  async getComplianceAtomicList(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('type') type: string,
    @Query('isScanDeleted') isScanDeleted: boolean,
    @Query('isSkip') isSkip: boolean,
    @Query('path') path: string,
    @Query('spm') spm: string,
    @Query('repo') repo: string,
  ) {
    const res = await this.complianceService.getComplianceAtomicList({
      current,
      pageSize,
      type,
      isScanDeleted,
      isSkip,
      path,
      spm,
      repo,
    });
    return res;
  }

  @Get('atomic/options')
  async getComplianceAtomicOptions() {
    const res = await this.complianceService.getComplianceAtomicOptions();
    return res;
  }

  @Put('atomic/skip')
  async updateComplianceAtomicSkip(@Body('ids') ids: string[], @Body('isSkip') isSkip: string) {
    const res = await this.complianceService.updateComplianceAtomicSkip(ids, Boolean(isSkip));
    return res;
  }

  @Put('atomic/delete')
  async updateComplianceAtomicDelete(@Body('ids') ids: string[]) {
    const res = await this.complianceService.updateComplianceAtomicDelete(ids);
    return res;
  }

  @Put('atomic/:id')
  async updateComplianceAtomic(@Param('id') id: string, @Body() body: Pick<ComplianceAtomic, 'spm' | 'comment'>) {
    const { spm, comment } = body;
    const res = await this.complianceService.updateComplianceAtomic(id, {
      spm,
      comment,
    });
    return res;
  }

  @Get('demand')
  async getComplianceDemandList(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('owner') owner: string,
    @Query('createdAt') createdAt: [string, string],
  ) {
    const res = await this.complianceService.getComplianceDemandList({
      current,
      pageSize,
      owner,
      createdAt,
    });
    return res;
  }

  @Put('demand/:id/code-scan')
  async updateComplianceDemandCodeScan(@Param('id') id: string, @Body('codeScan') codeScan: string[]) {
    const res = await this.complianceService.updateComplianceDemandCodeScan(id, codeScan);
    return res;
  }

  @Put('demand/:id')
  async updateComplianceDemand(@Param('id') id: string, @Body() body: CreateComplianceDemandDto) {
    const { title, schemeUrl, prdUrl, publicAt, owner } = body;
    const res = await this.complianceService.updateComplianceDemand(id, {
      title,
      schemeUrl,
      prdUrl,
      publicAt,
      owner,
    });
    return res;
  }

  @Post('demand')
  async createComplianceDemand(@Body() body: CreateComplianceDemandDto) {
    const { title, schemeUrl, prdUrl, publicAt, owner } = body;
    const res = await this.complianceService.createComplianceDemand({
      title,
      schemeUrl,
      prdUrl,
      publicAt,
      owner,
    });
    return res;
  }

  @Get('demand/detail/:id')
  async getComplianceDemandDetail(@Param('id') id: string) {
    const res = await this.complianceService.getComplianceDemandDetail(id);
    return res;
  }

  @Delete('demand/:id')
  async updateComplianceDemandDelete(@Param('id') id: string) {
    const res = await this.complianceService.deleteComplianceDemand(id);
    return res;
  }

  @Get('report')
  async getComplianceScanReportList(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('version') version: string = 'v1',
    @Query('createdAt') createdAt: [string, string],
  ) {
    const res = await this.complianceService.getComplianceScanReportList({
      current,
      pageSize,
      version,
      createdAt,
    });
    return res;
  }

  @Get('report/detail/:id')
  async getComplianceScanReportDetail(@Param('id') id: string) {
    const res = await this.complianceService.getComplianceScanReportDetail(id);
    return res;
  }
}
