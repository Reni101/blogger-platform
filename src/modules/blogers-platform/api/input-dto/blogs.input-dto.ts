import { CreateBlogDto } from '../../dto/create-blog.dto';

export class CreateBlogInputDto implements CreateBlogDto {
    name: string;
    description: string;
    websiteUrl: string;
}

export class UpdateBlogInputDto {
    name: string;
    description: string;
    websiteUrl: string;
}
export class CreatePostByBlogIdInputDto {
    title: string;
    shortDescription: string;
    content: string;
}
