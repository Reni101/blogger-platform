import { CreatePostDto } from '../../dto/posts/create-post.dto';
import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    contentDescriptionConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../domain/post/post.enity';

export class CreatePostInputDto implements CreatePostDto {
    @IsString()
    @Length(titleConstraints.minLength, titleConstraints.maxLength)
    @Trim()
    title: string;

    @IsString()
    @Length(
        shortDescriptionConstraints.minLength,
        shortDescriptionConstraints.maxLength,
    )
    @Trim()
    shortDescription: string;

    @IsString()
    @Length(
        contentDescriptionConstraints.minLength,
        contentDescriptionConstraints.maxLength,
    )
    @Trim()
    content: string;

    @IsString()
    @Trim()
    blogId: string;
}

export class UpdatePostInputDto {
    @IsString()
    @Length(titleConstraints.minLength, titleConstraints.maxLength)
    @Trim()
    title: string;

    @IsString()
    @Length(
        shortDescriptionConstraints.minLength,
        shortDescriptionConstraints.maxLength,
    )
    @Trim()
    shortDescription: string;

    @IsString()
    @Length(
        contentDescriptionConstraints.minLength,
        contentDescriptionConstraints.maxLength,
    )
    @Trim()
    content: string;

    @IsString()
    @Trim()
    blogId: string;
}
