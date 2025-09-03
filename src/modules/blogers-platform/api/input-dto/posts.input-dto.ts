import { CreatePostDto } from '../../dto/posts/create-post.dto';
import { IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class CreatePostInputDto implements CreatePostDto {
    @IsString()
    @Trim()
    content: string;

    @IsString()
    @Trim()
    title: string;

    @IsString()
    @Trim()
    shortDescription: string;

    @IsString()
    @Trim()
    blogId: string;
}

export class UpdatePostInputDto {
    @IsString()
    @Trim()
    title: string;

    @IsString()
    @Trim()
    shortDescription: string;

    @IsString()
    @Trim()
    content: string;

    @IsString()
    @Trim()
    blogId: string;
}
