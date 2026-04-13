import { PrismaClient, Role, PackageCategory, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { mockPackages } from '../data/mockPackages';
import { mockBlogPosts } from '../data/mockBlogPosts';
import { mockReviews } from '../data/mockReviews';

import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nepal.com' },
    update: {},
    create: {
      email: 'admin@nepal.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create authors from blog posts
  const authorMap = new Map<string, string>();
  const uniqueAuthors = new Map<string, typeof mockBlogPosts[0]['author']>();
  mockBlogPosts.forEach(post => {
    if (!uniqueAuthors.has(post.author.name)) {
      uniqueAuthors.set(post.author.name, post.author);
    }
  });

  for (const [name, authorData] of uniqueAuthors) {
    const author = await prisma.author.upsert({
      where: { name },
      update: {},
      create: {
        name: authorData.name,
        avatar: authorData.avatar,
        bio: authorData.bio,
      },
    });
    authorMap.set(name, author.id);
    console.log('✅ Created author:', author.name);
  }

  // Create tags
  const tagMap = new Map<string, string>();
  const allTags = new Set<string>();
  mockBlogPosts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));
  mockPackages.forEach(pkg => {
    // Extract tags from package if needed
  });

  for (const tagName of allTags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name: tagName,
        slug,
      },
    });
    tagMap.set(tagName, tag.id);
    console.log('✅ Created tag:', tag.name);
  }

  // Create blog posts
  console.log('📝 Creating blog posts...');
  for (const post of mockBlogPosts) {
    const authorId = authorMap.get(post.author.name)!;
    const tagIds = post.tags.map(tag => tagMap.get(tag)!).filter(Boolean);

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        images: post.images,
        authorId,
        category: post.category,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        featured: post.featured,
        views: post.views || 0,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        readingTime: post.readingTime,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        images: post.images,
        authorId,
        category: post.category,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        featured: post.featured,
        views: post.views || 0,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        readingTime: post.readingTime,
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    });
    console.log('✅ Created blog post:', post.title);
  }

  // Create packages
  console.log('📦 Creating packages...');
  for (const pkg of mockPackages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        shortDescription: pkg.shortDescription,
        fullDescription: pkg.fullDescription,
        price: pkg.price,
        currency: pkg.currency,
        duration: pkg.duration,
        location: pkg.location,
        difficulty: pkg.difficulty as Difficulty,
        groupSize: pkg.groupSize,
        images: pkg.images,
        featuredImage: pkg.featuredImage,
        category: pkg.category as PackageCategory,
        featured: pkg.featured,
        availableDates: pkg.availableDates,
        itinerary: pkg.itinerary as any,
        included: pkg.included,
        excluded: pkg.excluded,
        faq: pkg.faq as any,
        highlights: pkg.highlights,
      },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        shortDescription: pkg.shortDescription,
        fullDescription: pkg.fullDescription,
        price: pkg.price,
        currency: pkg.currency,
        duration: pkg.duration,
        location: pkg.location,
        difficulty: pkg.difficulty as Difficulty,
        groupSize: pkg.groupSize,
        images: pkg.images,
        featuredImage: pkg.featuredImage,
        category: pkg.category as PackageCategory,
        featured: pkg.featured,
        availableDates: pkg.availableDates,
        itinerary: pkg.itinerary as any,
        included: pkg.included,
        excluded: pkg.excluded,
        faq: pkg.faq as any,
        highlights: pkg.highlights,
      },
    });
    console.log('✅ Created package:', pkg.name);
  }

  // Create reviews
  console.log('⭐ Creating reviews...');
  // Delete existing reviews to avoid duplicates
  await prisma.review.deleteMany({});
  console.log('🗑️  Cleared existing reviews');

  for (const review of mockReviews) {
    await prisma.review.create({
      data: {
        platform: review.platform,
        reviewerName: review.reviewerName,
        reviewerAvatar: review.reviewerAvatar || null,
        rating: review.rating,
        reviewText: review.reviewText,
        date: new Date(review.date),
        reviewUrl: review.reviewUrl || null,
        verified: review.verified || false,
      },
    });
    console.log('✅ Created review from:', review.reviewerName);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

