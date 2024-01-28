import { Injectable } from '@nestjs/common';
import { SignedUrlDto } from '../../DTOs/signedurl.dto';
import { getImageUploadURL } from '../../utils/blogs.utils';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';

@Injectable()
export class ImagesService {
  async getSignedURL(signedURLPayload: SignedUrlDto): Promise<PresignedPost> {
    return await getImageUploadURL(signedURLPayload);
  }
}
