import { Body, Request, Controller, HttpCode, Post, UseGuards, Get, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../../services/blogs/blogs.service';
import { CreateBlogDTO } from '../../DTOs/createblog.dto';
import { Blog } from '../../entities/blog.entity';
import { AuthorizationGuard } from '../../../authorization/guards/authorization.guard';
import { BLOG_STATUS } from '../../constants/blogs.constants';
import { PaginationDto } from '../../DTOs/pagination.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {
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

  @ApiOperation({ summary: 'Fetch blogs by publish status' })
  @ApiBearerAuth()
  @ApiTags('Blogs')
  @ApiQuery({ name: 'status', description: 'Status of the blogs', enum: BLOG_STATUS, required: false })
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
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Get()
  @HttpCode(200)
  async getBlogs(
    @Request() req,
    @Query() paginationDto: PaginationDto,
    @Query('status') status: BLOG_STATUS,
    @Query('search') searchQuery: string
  ): Promise<{ blogs: Blog[]; totalPages: number }> {
    return await this.blogsService.findAll(status, paginationDto, searchQuery);
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
      },
    },
  })
  @UseGuards(AuthorizationGuard)
  @Get(':slug')
  @HttpCode(200)
  async getBlog(
    @Param('slug') slug: string,
  ): Promise<{ blog: Blog }> {
    const blog: Blog = await this.blogsService.findOne(slug);
    return { blog };
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


}
