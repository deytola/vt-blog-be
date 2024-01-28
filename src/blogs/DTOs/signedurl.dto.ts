import { IsNotEmpty } from 'class-validator';

export class SignedUrlDto {
  @IsNotEmpty()
  content_type: string;
}
