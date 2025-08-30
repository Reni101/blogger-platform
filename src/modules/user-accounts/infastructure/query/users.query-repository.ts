import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/user.entity';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../api/view-dto/users.view-dto';
import { FilterQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

    async getAll(
        query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto[]>> {
        const filter: FilterQuery<User> = {
            deletedAt: null,
        };

        if (query.searchLoginTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: query.searchLoginTerm, $options: 'i' },
            });
        }

        if (query.searchEmailTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                email: { $regex: query.searchEmailTerm, $options: 'i' },
            });
        }

        const users = await this.UserModel.find(filter)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize)
            .lean();
        const totalCount = await this.UserModel.countDocuments(filter);

        const items = users.map(UserViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }

    async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!user) {
            throw new NotFoundException('users not found');
        }

        return UserViewDto.mapToView(user);
    }
}
