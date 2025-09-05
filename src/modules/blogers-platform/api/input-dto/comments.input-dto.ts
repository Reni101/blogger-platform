import { IsEnum, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { contentConstraints } from '../../domain/comment/comment.entity';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class CreateCommentInputDto implements CreateCommentDto {
    @Trim()
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    content: string;
}

export class UpdateCommentInputDto implements CreateCommentDto {
    @Trim()
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    content: string;
}

export class likeStatusCommentInputDto {
    @IsEnum(LikeStatusEnum)
    likeStatus: LikeStatusEnum;
}
