import { CreateBlogDto } from '../../dto/blogs/create-blog.dto';
import { IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    descriptionConstraints,
    nameConstraints,
} from '../../domain/blog.entity';

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
    @Trim()
    name: string;

    @IsString()
    @Trim()
    description: string;

    @IsString()
    @IsUrl()
    @Trim()
    websiteUrl: string;
}
export class CreatePostByBlogIdInputDto {
    @IsString()
    @Trim()
    title: string;

    @IsString()
    @Trim()
    shortDescription: string;

    @IsString()
    @Trim()
    content: string;
}
