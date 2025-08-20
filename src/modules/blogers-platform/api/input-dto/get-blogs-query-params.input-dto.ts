import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetBlogsQueryParams extends BaseQueryParams {
    @IsEnum(BlogsSortBy)
    sortBy = BlogsSortBy.CreatedAt;

    @IsString()
    @IsOptional()
    searchNameTerm?: string | null = null;
}
