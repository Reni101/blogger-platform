import { CreateBlogDto } from '../../dto/blogs/create-blog.dto';
import { IsString, IsUrl } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class CreateBlogInputDto implements CreateBlogDto {
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
