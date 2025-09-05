import { CreateBlogDto } from '../../dto/blogs/create-blog.dto';
import { IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    descriptionConstraints,
    nameConstraints,
} from '../../domain/blog.entity';
import {
    contentDescriptionConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../domain/post/post.enity';

export class CreateBlogInputDto implements CreateBlogDto {
    @IsString()
    @Length(nameConstraints.minLength, nameConstraints.maxLength)
    @Trim()
    name: string;

    @IsString()
    @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
    @Trim()
    description: string;

    @IsString()
    @IsUrl()
    @Trim()
    websiteUrl: string;
}

export class UpdateBlogInputDto {
    @IsString()
    @Length(nameConstraints.minLength, nameConstraints.maxLength)
    @Trim()
    name: string;

    @IsString()
    @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
    @Trim()
    description: string;

    @IsString()
    @IsUrl()
    @Trim()
    websiteUrl: string;
}
export class CreatePostByBlogIdInputDto {
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
}
