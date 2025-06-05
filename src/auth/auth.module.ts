import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [ JwtModule.register({
    secret: process.env.JWT_SECRET || "defaultSecretKey",
  }),
FirebaseModule],
  providers: [AuthService, UserService, AuthGuard],
  controllers: [AuthController],
  exports:[AuthGuard, JwtModule]
})
export class AuthModule {}
