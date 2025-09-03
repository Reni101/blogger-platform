import { NewPasswordDto } from '../../../dto/new-password.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infastructure/users.repository';
import { CryptoService } from '../../crypto.service';

export class NewPasswordCommand {
    constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: NewPasswordCommand) {
        const user = await this.usersRepository.findByRecoveryCodeNotFoundFail(
            dto.recoveryCode,
        );
        const newPasswordHash = await this.cryptoService.createPasswordHash(
            dto.newPassword,
        );

        user.updatePasswordHash(newPasswordHash);
        await this.usersRepository.save(user);
    }
}
