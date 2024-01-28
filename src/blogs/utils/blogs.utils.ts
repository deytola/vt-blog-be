import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { UnprocessableEntityException } from '@nestjs/common';

export const slugify = (title: string): string => {
  if (title) {
    return `${title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')}-${new Date().getTime()}`;
  }
};
export const getFileExtensionFromContentType = (
  contentType: string,
): string => {
  if (contentType.includes('jpeg')) {
    return 'jpeg';
  } else if (contentType.includes('jpg')) {
    return 'jpg';
  } else if (contentType.includes('png')) {
    return 'png';
  }
  return '';
};

export const getImageUploadURL = async (data: {
  content_type: string;
}): Promise<PresignedPost> => {
  const { content_type } = data;
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
  });
  const bucketName: string = process.env.AWS_S3_PUBLIC_IMAGES_BUCKET;
  const URL_EXPIRATION_SECONDS = 300;
  const randomID: number = Math.floor(Math.random() * 10000000);
  const Key = `User/Images/vt-blog-${randomID}-${Date.now()}.${getFileExtensionFromContentType(
    content_type,
  )}`;

  const params = {
    Bucket: bucketName,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: content_type,
    ContentDisposition: 'inline',
  };

  try {
    return await createPresignedPost(s3, params);
  } catch (error) {
    throw new UnprocessableEntityException('Failed to get signed URL');
  }
};
