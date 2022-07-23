import { TransformPipe, ValidationPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UseFilters,
  UsePipes
} from '@discord-nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandValidationFilter } from 'src/bot/filter/command-validation.filter';
import { PrismaExceptionFilter } from 'src/bot/filter/prisma-exception.filter';
import { CreateDynamicRoleDto } from '../../dto/create-dynamic-role.dto';
import { DynamicRolesService } from '../../dynamic-roles.service';

@SubCommand({
  name: 'create',
  description: 'Creates a new dynamic role'
})
@UsePipes(TransformPipe, ValidationPipe)
@UseFilters(CommandValidationFilter, PrismaExceptionFilter)
export class CreateDynamicRoleSubCommand implements DiscordTransformedCommand<CreateDynamicRoleDto> {
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly dynamicRolesService: DynamicRolesService
  ) {
    this.logger = new Logger(CreateDynamicRoleSubCommand.name);
  }

  async handler(
    @Payload() createDynamicRoleDto: CreateDynamicRoleDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<void> {
    let channelId = createDynamicRoleDto.channelId;
    if (!channelId) {
      channelId = '123123123123';
    }
    // create role
    // add emoji to dashboard
    // rerender dashboard

    const dynamicRole = await this.dynamicRolesService.create(createDynamicRoleDto, channelId);
    const loggingString = `Successfully created dynamic role with name ${dynamicRole.name}`;
    this.logger.log(loggingString);
    return interaction.reply({ content: loggingString, ephemeral: true });
  }
}
