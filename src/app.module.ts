import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/scema/user.schema';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/', {
      dbName: 'cymulate',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
