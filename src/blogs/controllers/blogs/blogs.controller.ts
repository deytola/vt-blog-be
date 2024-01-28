import { Body, Request, Controller, HttpCode, Post, UseGuards, Get, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../../services/blogs/blogs.service';
import { CreateBlogDTO } from '../../DTOs/createblog.dto';
import { Blog } from '../../entities/blog.entity';
import { AuthorizationGuard } from '../../../authorization/guards/authorization.guard';
import { BLOG_STATUS } from '../../constants/blogs.constants';
import { ImagesService } from '../../services/images/images.service';
import { SignedUrlDto } from '../../DTOs/signedurl.dto';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly imagesService: ImagesService
  ) {
  }

  @ApiOperation({ summary: 'Create a blog' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'A Song of Ice and Fire',
          description: 'author\'s blog title',
        },
        slug: {
          type: 'string',
          example: 'a-song-of-ice-and-fire',
          description: 'Blog\'s unique slug',
        },
        image: {
          type: 'string',
          example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
          description: 'Blog image url',
        },
        content: {
          type: 'string',
          example: 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began writing the first volume...',
          description: 'Blog\'s content',
        },
        category: {
          type: 'string',
          example: 'General',
          description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'blog created successfully',
    schema: {
      type: 'object',
      properties: {
        blog: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'blog\'s unique identifier',
            },
            title: {
              type: 'string',
              example: 'A Song of Ice and Fire',
              description: 'Blog\'s title',
            },
            slug: {
              type: 'string',
              example: 'a-song-of-ice-and-fire',
              description: 'blog\'s unique slug',
            },
            image: {
              type: 'string',
              example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
              description: 'Blog image url',
            },
            content: {
              type: 'string',
              example: 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began writing the first volume...',
              description: 'Blog\'s content',
            },
            category: {
              type: 'string',
              example: 'General',
              description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                  description: 'user\'s unique identifier',
                },
                firstName: {
                  type: 'string',
                  example: 'Bruce',
                  description: 'user\'s given name',
                },
                lastName: {
                  type: 'string',
                  example: 'Wayne',
                  description: 'user\'s family name',
                },
                email: {
                  type: 'string',
                  example: 'ade@test.test',
                  description: 'user\'s unique email',
                },
                createdAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account creation date',
                },
                updatedAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account latest updated date',
                },
              },
            },
            created_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s creation date',
            },
            updated_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'date blog was last updated',
            },
            published_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s publish date',
            },
            deleted_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s deletion date',
            },
          },
        },
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Post()
  @HttpCode(201)
  async createBlog(
    @Request() req,
    @Body() createBlogDto: CreateBlogDTO,
  ): Promise<{ blog: Blog }> {
    const { id } = req.user;
    const createdBlog: Blog = await this.blogsService.create(
      Object.assign(createBlogDto, { authorId: id }),
    );
    return { blog: createdBlog };
  }

  @ApiOperation({ summary: 'Fetch blogs' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiQuery({ name: 'status', description: 'Publish status of the blogs to fetch', enum: BLOG_STATUS, required: false })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: 'integer', example: 1 })
  @ApiQuery({ name: 'search', description: 'Search query', required: false, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'blogs fetched successfully',
    schema: {
      type: 'object',
      properties: {
        blogs: {
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'integer',
                example: 1,
                description: 'blog\'s unique identifier',
              },
              title: {
                type: 'string',
                example: 'A Song of Ice and Fire',
                description: 'Blog\'s title',
              },
              slug: {
                type: 'string',
                example: 'a-song-of-ice-and-fire',
                description: 'blog\'s unique slug',
              },
              image: {
                type: 'string',
                example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
                description: 'Blog image url',
              },
              content: {
                type: 'string',
                example: 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began writing the first volume...',
                description: 'Blog\'s content',
              },
              category: {
                type: 'string',
                example: 'General',
                description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
              },
              author: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 1,
                    description: 'user\'s unique identifier',
                  },
                  firstName: {
                    type: 'string',
                    example: 'Bruce',
                    description: 'user\'s given name',
                  },
                  lastName: {
                    type: 'string',
                    example: 'Wayne',
                    description: 'user\'s family name',
                  },
                  email: {
                    type: 'string',
                    example: 'ade@test.test',
                    description: 'user\'s unique email',
                  },
                  createdAt: {
                    type: 'date',
                    example: '2023-11-302023-11-30 10:45:06.883885',
                    description: 'user\'s account creation date',
                  },
                  updatedAt: {
                    type: 'date',
                    example: '2023-11-302023-11-30 10:45:06.883885',
                    description: 'user\'s account latest updated date',
                  },
                },
              },
              created_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s creation date',
              },
              updated_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'date blog was last updated',
              },
              published_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s publish date',
              },
              deleted_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s deletion date',
              },
            },
          },
        },
        totalPages: {
          type: 'integer',
          example: 5,
          description: 'Total number of pages',
        },
      },
    },
  })
  @Get()
  @HttpCode(200)
  async getBlogs(
    @Request() req,
    @Query('page') page: number,
    @Query('status') status: BLOG_STATUS,
    @Query('search') searchQuery: string
  ): Promise<{ blogs: Blog[]; totalPages: number }> {
    return await this.blogsService.findAll(status, page, searchQuery);
  }

  @ApiOperation({ summary: 'Fetch a blog by slug' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiResponse({
    status: 200,
    description: 'blog fetched successfully',
    schema: {
      type: 'object',
      properties: {
        blog: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'blog\'s unique identifier',
            },
            title: {
              type: 'string',
              example: 'A Song of Ice and Fire',
              description: 'Blog\'s title',
            },
            slug: {
              type: 'string',
              example: 'a-song-of-ice-and-fire',
              description: 'blog\'s unique slug',
            },
            image: {
              type: 'string',
              example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
              description: 'Blog image url',
            },
            content: {
              type: 'string',
              example: 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began writing the first volume...',
              description: 'Blog\'s content',
            },
            category: {
              type: 'string',
              example: 'General',
              description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                  description: 'user\'s unique identifier',
                },
                firstName: {
                  type: 'string',
                  example: 'Bruce',
                  description: 'user\'s given name',
                },
                lastName: {
                  type: 'string',
                  example: 'Wayne',
                  description: 'user\'s family name',
                },
                email: {
                  type: 'string',
                  example: 'ade@test.test',
                  description: 'user\'s unique email',
                },
                createdAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account creation date',
                },
                updatedAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account latest updated date',
                },
              },
            },
            created_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s creation date',
            },
            updated_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'date blog was last updated',
            },
            published_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s publish date',
            },
            deleted_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s deletion date',
            },
          },
        },
        relatedBlogs: {
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'integer',
                example: 4,
                description: 'blog\'s unique identifier',
              },
              title: {
                type: 'string',
                example: 'A Dance with Dragons',
                description: 'Blog\'s title',
              },
              slug: {
                type: 'string',
                example: 'a-dance-with-dragons',
                description: 'blog\'s unique slug',
              },
              image: {
                type: 'string',
                example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
                description: 'Blog image url',
              },
              content: {
                type: 'string',
                example: 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began writing the first volume...',
                description: 'Blog\'s content',
              },
              category: {
                type: 'string',
                example: 'General',
                description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
              },
              author: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 1,
                    description: 'user\'s unique identifier',
                  },
                  firstName: {
                    type: 'string',
                    example: 'Bruce',
                    description: 'user\'s given name',
                  },
                  lastName: {
                    type: 'string',
                    example: 'Wayne',
                    description: 'user\'s family name',
                  },
                  email: {
                    type: 'string',
                    example: 'ade@test.test',
                    description: 'user\'s unique email',
                  },
                  createdAt: {
                    type: 'date',
                    example: '2023-11-302023-11-30 10:45:06.883885',
                    description: 'user\'s account creation date',
                  },
                  updatedAt: {
                    type: 'date',
                    example: '2023-11-302023-11-30 10:45:06.883885',
                    description: 'user\'s account latest updated date',
                  },
                },
              },
              created_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s creation date',
              },
              updated_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'date blog was last updated',
              },
              published_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s publish date',
              },
              deleted_at: {
                type: 'date',
                example: '2023-11-302023-11-30 10:45:06.883885',
                description: 'blog\'s deletion date',
              },
            },
          }
        },
      },
    },
  })
  @Get(':slug')
  @HttpCode(200)
  async getBlog(
    @Param('slug') slug: string,
  ): Promise<{ blog: Blog, relatedBlogs: Blog[] }> {
    return await this.blogsService.findOne(slug);
  }

  @ApiOperation({ summary: 'Update a blog by slug' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'A Dance with Dragons',
          description: 'author\'s updated blog title',
        },
        image: {
          type: 'string',
          example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
          description: 'Blog updated image url',
        },
        content: {
          type: 'string',
          example: 'A Dance with Dragons is the fifth novel of seven planned in the epic fantasy series A Song of Ice and Fire by American author George R. R. Martin.',
          description: 'Blog\'s content',
        },
        category: {
          type: 'string',
          example: 'Adventure',
          description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
        },
      },
    }
  })
  @ApiResponse({
    status: 200,
    description: 'blog updated successfully',
    schema: {
      type: 'object',
      properties: {
        blog: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'blog\'s unique identifier',
            },
            title: {
              type: 'string',
              example: 'A Dance with Dragons',
              description: 'Blog\'s updated title',
            },
            slug: {
              type: 'string',
              example: 'a-dance-with-dragons-4456',
              description: 'blog\'s unique slug',
            },
            image: {
              type: 'string',
              example: 'https://dummyimage.com/157x100.png/ff4444/ffffff',
              description: 'Blog updated image url',
            },
            content: {
              type: 'string',
              example: 'A Dance with Dragons is the fifth novel of seven planned in the epic fantasy series A Song of Ice and Fire by American author George R. R. Martin.',
              description: 'Blog\'s updated content',
            },
            category: {
              type: 'string',
              example: 'Adventure',
              description: 'Category of the blog. Should be one of: \'General\', \'Adventure\', \'Travel\', \'Fashion\' or \'Technology\'',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                  description: 'user\'s unique identifier',
                },
                firstName: {
                  type: 'string',
                  example: 'Bruce',
                  description: 'user\'s given name',
                },
                lastName: {
                  type: 'string',
                  example: 'Wayne',
                  description: 'user\'s family name',
                },
                email: {
                  type: 'string',
                  example: 'ade@test.test',
                  description: 'user\'s unique email',
                },
                createdAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account creation date',
                },
                updatedAt: {
                  type: 'date',
                  example: '2023-11-302023-11-30 10:45:06.883885',
                  description: 'user\'s account latest updated date',
                },
              },
            },
            created_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s creation date',
            },
            updated_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'date blog was last updated',
            },
            published_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s publish date',
            },
            deleted_at: {
              type: 'date',
              example: '2023-11-302023-11-30 10:45:06.883885',
              description: 'blog\'s deletion date',
            },
          },
        },
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Patch(':slug')
  @HttpCode(200)
  async updateBlog(
    @Body() updatedBlogData: Partial<Blog>,
    @Param('slug') slug: string
  ): Promise<{ blog: Blog }> {
    const blog: Blog = await this.blogsService.update(slug, updatedBlogData);
    return { blog };
  }

  @ApiOperation({ summary: 'Delete a blog by slug' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiResponse({
    status: 200,
    description: 'blog deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Blog deleted successfully',
          description: 'server message after blog deletion',
        }
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Delete(':slug')
  @HttpCode(200)
  async deleteBlog(
    @Param('slug') slug: string
  ): Promise<{ message: string }> {
    await this.blogsService.remove(slug);
    return { message: 'Blog deleted successfully' };
  }

  @ApiOperation({ summary: 'Publish a blog by slug' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiResponse({
    status: 200,
    description: 'blog published successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Blog published successfully',
          description: 'server message after blog is published',
        }
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Get('publish/:slug')
  @HttpCode(200)
  async publishBlog(
    @Param('slug') slug: string
  ): Promise<{ message: string }> {
    const publishPayload: Partial<Blog> = {published_at: new Date()}
    await this.blogsService.update(slug, publishPayload);
    return { message: 'Blog published successfully' };
  }

  @ApiOperation({ summary: 'Get a signed upload url' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content_type: {
          type: 'string',
          example: 'image/png',
          description: 'Image mime type'
        }
      },
    }
  })
  @ApiResponse({
    status: 200,
    description: 'signed URL fetched successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://s3.bucket.url',
          description: 's3 bucket url',
        },
        fields: {
          type: 'object',
          properties: {
            bucket: {
              type: 'string',
              example: 'vt-blog-development-us-east-images-public',
              description: 's3 bucket name'
            },
            ['X-Amz-Algorithm']: {
              type: 'string',
              example: 'AWS4-HMAC-SHA256',
              description: 'encryption algorithm'
            },
            ['X-Amz-Credential']: {
              type: 'string',
              example: 'ABC12345676T3T5W/20240127/us-east-1/s3/aws4_request',
              description: 'encryption algorithm'
            },
            ['X-Amz-Date']: {
              type: 'string',
              example: '20240127T192303Z',
              description: 'timestamp'
            },
            key: {
              type: 'string',
              example: 'User/Images/vt-blog-1628778-1706383383427.png',
              description: 'File path in S3 bucket'
            },
            policy: {
              type: 'string',
              example: 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0yN1QxOToyODowM1oiLCJjb25kaXRpb25zIjpE2iOiIyMDI0MDEyN1QxOTIzy5wbmcifV19',
              description: 'encoded bucket policy'
            },
            ['X-Amz-Signature']: {
              type: 'string',
              example: '1a46e9fb703aba94bbff2d29b6412df01b',
              description: 'request signature'
            },
          }
        }
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Post('/upload_url')
  @HttpCode(200)
  async getUploadURL(
    @Body() uploadUrlPayload: SignedUrlDto
  ): Promise<PresignedPost> {
    return await this.imagesService.getSignedURL(uploadUrlPayload);
  }


}
