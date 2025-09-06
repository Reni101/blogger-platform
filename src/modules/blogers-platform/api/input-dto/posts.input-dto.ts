import { CreatePostDto } from '../../dto/posts/create-post.dto';
import { IsEnum, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    contentDescriptionConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../domain/post/post.enity';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class CreatePostInputDto implements CreatePostDto {
    @Trim()
    @IsString()
    @Length(titleConstraints.minLength, titleConstraints.maxLength)
    title: string;

    @Trim()
    @IsString()
    @Length(
        shortDescriptionConstraints.minLength,
        shortDescriptionConstraints.maxLength,
    )
    shortDescription: string;

    @Trim()
    @IsString()
    @Length(
        contentDescriptionConstraints.minLength,
        contentDescriptionConstraints.maxLength,
    )
    content: string;

    @Trim()
    @IsString()
    blogId: string;
}

export class UpdatePostInputDto {
    @Trim()
    @IsString()
    @Length(titleConstraints.minLength, titleConstraints.maxLength)
    title: string;

    @Trim()
    @IsString()
    @Length(
        shortDescriptionConstraints.minLength,
        shortDescriptionConstraints.maxLength,
    )
    shortDescription: string;

    @Trim()
    @IsString()
    @Length(
        contentDescriptionConstraints.minLength,
        contentDescriptionConstraints.maxLength,
    )
    content: string;

    @Trim()
    @IsString()
    blogId: string;
}

export class likeStatusPostInputDto {
    @IsEnum(LikeStatusEnum)
    likeStatus: LikeStatusEnum;
}
