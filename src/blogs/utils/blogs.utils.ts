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
export const getFileExtensionFromContentType = (contentType: string): string => {
  if (contentType.includes('jpeg')) {
    return 'jpeg';
  } else if (contentType.includes('jpg')) {
    return 'jpg';
  } else if (contentType.includes('png')) {
    return 'png';
  }
  return '';
};


export const getImageUploadURL = async (data: { content_type: string }): Promise<PresignedPost> => {
  const { content_type } = data;
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
  });
  const bucketName: string = process.env.AWS_S3_PUBLIC_IMAGES_BUCKET;
  const URL_EXPIRATION_SECONDS = 300;
  const randomID: number = Math.floor(Math.random() * 10000000);
  const Key = `User/Images/vt-blog-${randomID}-${Date.now()}.${getFileExtensionFromContentType(content_type)}`;

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


export const BLOG_SEEDS = [{
  'id': 2,
  'title': 'Moonlight and Valentino',
  'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
  'published_at': new Date('2023-11-19 06:59:25'),
  'created_at': new Date('2023-11-30 20:21:51'),
  'updated_at': new Date('2024-01-15 17:49:37'),
  'deleted_at': new Date('2023-10-16 11:00:52'),
  'content': 'In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
  'category': 'Fashion',
},
  {
    'id': 67,
    'title': 'Cobra',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-12-16 03:05:23'),
    'created_at': new Date('2024-01-25 15:58:41'),
    'updated_at': new Date('2023-10-13 20:53:11'),
    'deleted_at': new Date('2023-11-16 03:17:50'),
    'content': 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.',
    'category': 'Fashion',
  },
  {
    'id': 11,
    'title': 'Father of the Bride',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-10-06 16:53:14'),
    'created_at': new Date('2023-11-06 06:18:55'),
    'updated_at': new Date('2023-12-04 12:22:20'),
    'deleted_at': new Date('2023-10-16 22:07:50'),
    'content': 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
    'category': 'Travel',
  },
  {
    'id': 24,
    'title': 'Best and the Brightest, The',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-12-23 11:04:04'),
    'created_at': new Date('2023-12-02 06:07:46'),
    'updated_at': new Date('2023-10-23 07:05:56'),
    'deleted_at': new Date('2023-12-27 19:13:59'),
    'content': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
    'category': 'Travel',
  },
  {
    'id': 24,
    'title': 'Free to Play',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-11-18 18:16:05'),
    'created_at': new Date('2023-10-19 22:07:40'),
    'updated_at': new Date('2023-10-23 09:52:29'),
    'deleted_at': new Date('2023-12-13 09:28:50'),
    'content': 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
    'category': 'Travel',
  },
  {
    'id': 51,
    'title': 'Man There Was, A (Terje Vigen)',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-11-18 12:57:45'),
    'created_at': new Date('2023-10-03 02:48:04'),
    'updated_at': new Date('2023-10-24 21:29:20'),
    'deleted_at': new Date('2023-10-24 06:00:36'),
    'content': 'Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.',
    'category': 'Technology',
  },
  {
    'id': 10,
    'title': 'Fugly!',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-12-31 21:21:26'),
    'created_at': new Date('2023-11-19 22:37:39'),
    'updated_at': new Date('2024-01-25 13:01:10'),
    'deleted_at': new Date('2023-10-19 12:55:04'),
    'content': 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.',
    'category': 'Adventure',
  },
  {
    'id': 90,
    'title': 'Lust for Gold',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-10-04 22:56:58'),
    'created_at': new Date('2023-10-23 02:24:46'),
    'updated_at': new Date('2023-12-31 12:21:20'),
    'deleted_at': new Date('2024-01-10 05:14:31'),
    'content': 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.',
    'category': 'Travel',
  },
  {
    'id': 23,
    'title': 'Declaration of War (La Guerre est Déclarée)',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-12-28 15:51:42'),
    'created_at': new Date('2024-01-12 01:33:51'),
    'updated_at': new Date('2024-01-18 01:51:15'),
    'deleted_at': new Date('2023-10-15 04:21:06'),
    'content': 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    'category': 'Travel',
  },
  {
    'id': 67,
    'title': 'Boys and Girls Guide to Getting Down, The',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-12-13 08:14:28'),
    'created_at': new Date('2023-11-01 12:09:19'),
    'updated_at': new Date('2024-01-17 10:07:41'),
    'deleted_at': new Date('2023-12-09 03:43:42'),
    'content': 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.',
    'category': 'Travel',
  },
  {
    'id': 68,
    'title': 'City of No Limits, The (la ciudad sin límites, En)',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-11-25 11:08:19'),
    'created_at': new Date('2023-11-24 05:24:58'),
    'updated_at': new Date('2024-01-14 03:17:25'),
    'deleted_at': new Date('2023-10-22 13:38:28'),
    'content': 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
    'category': 'Travel',
  },
  {
    'id': 25,
    'title': 'Ride the Divide',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-11-11 14:59:43'),
    'created_at': new Date('2024-01-19 20:59:50'),
    'updated_at': new Date('2024-01-23 15:19:58'),
    'deleted_at': new Date('2023-10-20 17:12:14'),
    'content': 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
    'category': 'Fashion',
  },
  {
    'id': 96,
    'title': 'Oklahoma Crude',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-10-12 02:42:16'),
    'created_at': new Date('2023-11-29 14:32:19'),
    'updated_at': new Date('2024-01-05 02:09:24'),
    'deleted_at': new Date('2023-11-27 12:13:13'),
    'content': 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
    'category': 'Fashion',
  },
  {
    'id': 27,
    'title': 'Melody',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-12-15 07:14:09'),
    'created_at': new Date('2023-10-26 16:10:28'),
    'updated_at': new Date('2024-01-06 14:04:58'),
    'deleted_at': new Date('2023-12-26 23:53:47'),
    'content': 'Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.',
    'category': 'General',
  },
  {
    'id': 84,
    'title': 'Paranormal Activity',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2024-01-23 13:08:03'),
    'created_at': new Date('2023-10-23 05:30:26'),
    'updated_at': new Date('2023-10-08 13:19:05'),
    'deleted_at': new Date('2023-12-06 17:49:13'),
    'content': 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.',
    'category': 'General',
  },
  {
    'id': 28,
    'title': 'Household Saints',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-10-01 02:08:23'),
    'created_at': new Date('2023-11-05 11:58:52'),
    'updated_at': new Date('2023-12-16 03:11:40'),
    'deleted_at': new Date('2023-10-12 01:29:50'),
    'content': 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
    'category': 'Fashion',
  },
  {
    'id': 73,
    'title': 'Paperman',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-11-27 03:02:49'),
    'created_at': new Date('2024-01-01 14:58:23'),
    'updated_at': new Date('2023-11-15 01:02:56'),
    'deleted_at': new Date('2023-10-12 04:35:03'),
    'content': 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
    'category': 'Travel',
  },
  {
    'id': 87,
    'title': 'Starship Invasions',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-12-15 13:15:48'),
    'created_at': new Date('2023-10-23 09:31:14'),
    'updated_at': new Date('2023-11-05 10:23:03'),
    'deleted_at': new Date('2023-10-13 03:58:17'),
    'content': 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
    'category': 'Travel',
  },
  {
    'id': 85,
    'title': 'Hill, The',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-11-11 05:04:31'),
    'created_at': new Date('2024-01-20 14:52:51'),
    'updated_at': new Date('2023-12-13 21:06:13'),
    'deleted_at': new Date('2024-01-13 20:14:57'),
    'content': 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
    'category': 'General',
  },
  {
    'id': 31,
    'title': 'Never Give a Sucker an Even Break',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-10-02 02:36:44'),
    'created_at': new Date('2024-01-23 05:50:55'),
    'updated_at': new Date('2023-12-24 03:31:40'),
    'deleted_at': new Date('2023-10-25 12:25:54'),
    'content': 'Phasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
    'category': 'General',
  },
  {
    'id': 94,
    'title': 'Sport, Sport, Sport',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-11-22 16:50:23'),
    'created_at': new Date('2023-10-19 06:06:00'),
    'updated_at': new Date('2023-11-22 10:13:32'),
    'deleted_at': new Date('2024-01-13 13:39:52'),
    'content': 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.',
    'category': 'Technology',
  },
  {
    'id': 94,
    'title': 'High Noon',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-11-30 18:53:31'),
    'created_at': new Date('2023-12-02 19:03:18'),
    'updated_at': new Date('2023-11-12 17:37:22'),
    'deleted_at': new Date('2024-01-02 03:20:37'),
    'content': 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    'category': 'Technology',
  },
  {
    'id': 5,
    'title': 'Quinceañera',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2024-01-19 20:33:03'),
    'created_at': new Date('2023-12-10 00:14:43'),
    'updated_at': new Date('2023-10-31 01:02:21'),
    'deleted_at': new Date('2023-11-21 10:59:53'),
    'content': 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
    'category': 'General',
  },
  {
    'id': 4,
    'title': 'Scott Pilgrim vs. the World',
    'image': 'http://dummyimage.com/100x100.png/5fa2dd/ffffff',
    'published_at': new Date('2023-10-14 09:04:36'),
    'created_at': new Date('2024-01-25 07:01:36'),
    'updated_at': new Date('2023-11-29 15:46:55'),
    'deleted_at': new Date('2023-11-11 16:29:49'),
    'content': 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
    'category': 'Fashion',
  },
  {
    'id': 14,
    'title': 'Lila Says (Lila dit ça)',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-12-19 10:21:28'),
    'created_at': new Date('2023-11-10 03:52:00'),
    'updated_at': new Date('2023-12-21 11:05:42'),
    'deleted_at': new Date('2023-12-15 06:22:31'),
    'content': 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
    'category': 'Technology',
  },
  {
    'id': 64,
    'title': 'My Love Has Been Burning (Waga koi wa moenu)',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2024-01-25 21:41:42'),
    'created_at': new Date('2023-11-04 19:12:22'),
    'updated_at': new Date('2024-01-15 08:08:36'),
    'deleted_at': new Date('2024-01-05 01:07:44'),
    'content': 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
    'category': 'General',
  },
  {
    'id': 63,
    'title': 'Jim Breuer: And Laughter for All',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2024-01-19 07:49:28'),
    'created_at': new Date('2024-01-24 05:33:48'),
    'updated_at': new Date('2023-10-10 06:18:12'),
    'deleted_at': new Date('2023-10-21 10:05:58'),
    'content': 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.',
    'category': 'Travel',
  },
  {
    'id': 33,
    'title': 'Sin of Madelon Claudet, The',
    'image': 'http://dummyimage.com/100x100.png/dddddd/000000',
    'published_at': new Date('2023-10-24 08:14:34'),
    'created_at': new Date('2023-10-27 02:33:36'),
    'updated_at': new Date('2023-10-31 19:38:50'),
    'deleted_at': new Date('2023-12-04 03:02:21'),
    'content': 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.',
    'category': 'Travel',
  },
  {
    'id': 41,
    'title': 'Forbidden Kingdom, The',
    'image': 'http://dummyimage.com/100x100.png/cc0000/ffffff',
    'published_at': new Date('2023-12-13 00:52:27'),
    'created_at': new Date('2023-10-31 04:58:59'),
    'updated_at': new Date('2024-01-17 23:55:30'),
    'deleted_at': new Date('2023-10-23 20:42:30'),
    'content': 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
    'category': 'Travel',
  },
  {
    'id': 20,
    'title': 'Benji the Hunted',
    'image': 'http://dummyimage.com/100x100.png/ff4444/ffffff',
    'published_at': new Date('2023-12-30 12:05:52'),
    'created_at': new Date('2024-01-20 19:05:16'),
    'updated_at': new Date('2024-01-09 20:10:34'),
    'deleted_at': new Date('2023-10-01 15:48:27'),
    'content': 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.\n\nPraesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
    'category': 'Adventure',
  }];
