import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
export class LoginDto {
    @ApiProperty({example: "example@example.com", description: "User's email address"})
    @IsEmail()
    email: string;

    @ApiProperty({example: "password123", description: "User's password"})
    password: string;
}



export class LoginFirebaseDto {
    @ApiProperty({example: "IdToken", description: "Firebase Token after Signup"})
    @IsString()
    email: string;

    @ApiPropertyOptional({ example: 'male', description: 'Gender of the user' })
      @IsOptional()
      @IsString()
      gender?: string;

     
    @ApiPropertyOptional({ example: 'phoneNumber', description: 'phone of the user' })
      @IsOptional()
      @IsString()
      phoneNumber?: string; 


      @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastName: string;
}