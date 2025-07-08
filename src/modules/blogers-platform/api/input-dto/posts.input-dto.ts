import { CreatePostDto } from '../../dto/create-post.dto';

export class CreatePostInputDto implements CreatePostDto {
    content: string;
    title: string;
    shortDescription: string;
    blogId: string;
}
