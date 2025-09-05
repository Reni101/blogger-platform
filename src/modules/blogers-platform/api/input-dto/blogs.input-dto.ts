import { CreateBlogDto } from '../../dto/blogs/create-blog.dto';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
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
    @Trim()
    @Length(nameConstraints.minLength, nameConstraints.maxLength)
    name: string;

    @Trim()
    @IsString()
    @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
    description: string;

    @Trim()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    websiteUrl: string;
}

export class UpdateBlogInputDto {
    @Trim()
    @IsString()
    @Length(nameConstraints.minLength, nameConstraints.maxLength)
    name: string;

    @Trim()
    @IsString()
    @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
    description: string;

    @Trim()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    websiteUrl: string;
}
export class CreatePostByBlogIdInputDto {
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
}
