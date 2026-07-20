import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepositoryPostgres {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    // async getAll(
    //     query: GetUsersQueryParams,
    // ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    //     const filter: FilterQuery<User> = {
    //         deletedAt: null,
    //     };
    //
    //     if (query.searchLoginTerm) {
    //         filter.$or = filter.$or || [];
    //         filter.$or.push({
    //             login: { $regex: query.searchLoginTerm, $options: 'i' },
    //         });
    //     }
    //
    //     if (query.searchEmailTerm) {
    //         filter.$or = filter.$or || [];
    //         filter.$or.push({
    //             email: { $regex: query.searchEmailTerm, $options: 'i' },
    //         });
    //     }
    //     const users = [];
    //     // const users = await this.UserModel.find(filter)
    //     //     .sort({ [query.sortBy]: query.sortDirection })
    //     //     .skip(query.calculateSkip())
    //     //     .limit(query.pageSize)
    //     //     .lean();
    //     // const totalCount = await this.UserModel.countDocuments(filter);
    //
    //     const items = users.map(UsersViewDto.mapToView);
    //
    //     return PaginatedViewDto.mapToView({
    //         items,
    //         totalCount,
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //     });
    // }

    // async getByIdOrNotFoundFail(id: string) {
    //     const user = await this.UserModel.findOne({
    //         _id: id,
    //         deletedAt: null,
    //     });
    //
    //     if (!user) {
    //         throw new DomainException({
    //             code: DomainExceptionCode.NotFound,
    //             message: 'user not found',
    //         });
    //     }
    //
    //     return UserViewDto.mapToView(user);
    // }

    // async getByIdOrNotFoundFail(id: string): Promise<UsersViewDto> {
    //     const user = await this.UserModel.findOne({
    //         _id: id,
    //         deletedAt: null,
    //     });
    //
    //     if (!user) {
    //         throw new NotFoundException('users not found');
    //     }
    //
    //     return UsersViewDto.mapToView(user);
    // }
}
