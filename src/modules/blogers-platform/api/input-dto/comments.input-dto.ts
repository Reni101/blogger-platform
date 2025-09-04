import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { contentConstraints } from '../../domain/comment/comment.entity';

export class CreateCommentInputDto implements CreateCommentDto {
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    @Trim()
    content: string;
}

export class UpdateCommentInputDto implements CreateCommentDto {
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    @Trim()
    content: string;
}
