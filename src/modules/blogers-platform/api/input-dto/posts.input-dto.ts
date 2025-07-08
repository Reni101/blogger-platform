import { CreatePostDto } from '../../dto/create-post.dto';

export class CreatePostInputDto implements CreatePostDto {
    content: string;
    title: string;
    shortDescription: string;
    blogId: string;
}

export class UpdatePostInputDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}
