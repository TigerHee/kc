import { RequestWithUser } from 'src/auth/auth.types';
import { WorkflowDocument } from './schemas/workflow.schema';
import { WorkflowService } from './workflow.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {
    //
  }

  @Get('options')
  async getWorkflowOptions() {
    const res = await this.workflowService.getWorkflowOptions();
    return res;
  }

  @Post('')
  async createWorkflow(@Body() body: WorkflowDocument, @Req() req: RequestWithUser) {
    return this.workflowService.createWorkflow(req, body);
  }

  @Get('')
  async getWorkflowList(@Query('current') current, @Query('pageSize') pageSize) {
    const res = await this.workflowService.getWorkflowList({
      current,
      pageSize,
    });
    return res;
  }

  @Delete(':id')
  async deleteWorkflow(@Param('id') id) {
    const res = await this.workflowService.deleteWorkflow(id);
    return res;
  }

  @Put(':id')
  async updateWorkflow(@Param('id') id, @Body() body: WorkflowDocument) {
    const res = await this.workflowService.updateWorkflow(id, body);
    return res;
  }
}
