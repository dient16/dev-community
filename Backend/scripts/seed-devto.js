/**
 * Cào bài viết từ dev.to (public API) và insert vào MongoDB.
 * Tác giả được thay bằng danh tính tự chế (xem fake-identity.js).
 *
 * Cách dùng:
 *   node scripts/seed-devto.js            # thêm 30 bài mới
 *   node scripts/seed-devto.js 100        # thêm 100 bài mới (bỏ qua bài đã có)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcrypt');

const User = require('../src/models/user.model');
const Post = require('../src/models/post.model');
const Tag = require('../src/models/tag.model');
const { buildIdentity } = require('./fake-identity');

const LIMIT = parseInt(process.argv[2], 10) || 30;
const SEED_PASSWORD = 'Devto@123';
const PER_PAGE = 100;
const MAX_PAGES = 30;
const FALLBACK_IMAGE =
   'https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/placeholder.png';

const THEMES = ['#3b49df', '#e94b3c', '#0aa06e', '#f5a623', '#8e44ad', '#16a085', '#d35400', '#2c3e50'];
const themeFor = (name) => THEMES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % THEMES.length];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
   const res = await fetch(url, { headers: { 'User-Agent': 'dev-community-seeder' } });
   if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
   return res.json();
}

const fetchPage = (page) =>
   fetchJson(`https://dev.to/api/articles?per_page=${PER_PAGE}&page=${page}`);

async function uniqueIdentity(seedKey) {
   for (let salt = 0; salt < 50; salt += 1) {
      const identity = buildIdentity(seedKey, salt);
      const existing = await User.findOne({
         $or: [{ username: identity.username }, { email: identity.email }],
      });
      if (!existing) return { identity, existing: null };
      // Trùng ngay từ salt 0 nghĩa là seedKey này đã được tạo trước đó -> tái sử dụng
      if (salt === 0) return { identity, existing };
   }
   throw new Error(`Không sinh được username duy nhất cho "${seedKey}"`);
}

async function getOrCreateUser(devUser, hashedPassword, cache) {
   const seedKey = (devUser.username || devUser.name || 'anonymous').toLowerCase();
   if (cache.has(seedKey)) return cache.get(seedKey);

   const { identity, existing } = await uniqueIdentity(seedKey);
   const user = existing || (await User.create({ ...identity, password: hashedPassword }));

   cache.set(seedKey, user);
   return user;
}

async function importArticle(item, hashedPassword, userCache) {
   const detail = await fetchJson(`https://dev.to/api/articles/${item.id}`);
   const title = detail.title;
   const slug = slugify(title);

   if (await Post.findOne({ slug })) return null;

   const author = await getOrCreateUser(detail.user, hashedPassword, userCache);

   const post = await Post.create({
      title,
      image: detail.cover_image || detail.social_image || FALLBACK_IMAGE,
      body: detail.body_markdown || detail.description || '',
      slug,
      author: author._id,
   });

   if (detail.published_at) {
      const publishedAt = new Date(detail.published_at);
      await Post.updateOne(
         { _id: post._id },
         { $set: { createdAt: publishedAt, updatedAt: publishedAt } },
         { timestamps: false },
      );
   }

   for (const raw of (detail.tags || detail.tag_list || []).slice(0, 4)) {
      const name = String(raw).trim().toLowerCase();
      if (!name) continue;
      const tag = await Tag.findOneAndUpdate(
         { name },
         { $addToSet: { posts: post._id }, $setOnInsert: { theme: themeFor(name) } },
         { upsert: true, new: true },
      );
      await Post.updateOne({ _id: post._id }, { $addToSet: { tags: tag._id } });
   }

   await User.updateOne({ _id: author._id }, { $addToSet: { posts: post._id } });

   return { title, author };
}

async function main() {
   if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI in .env');
   await mongoose.connect(process.env.MONGODB_URI);
   console.log(`DB connected. Mục tiêu: thêm ${LIMIT} bài viết mới.`);

   const hashedPassword = bcrypt.hashSync(SEED_PASSWORD, bcrypt.genSaltSync(12));
   const userCache = new Map();

   let created = 0;
   let skipped = 0;
   let failed = 0;
   let page = 1;

   while (created < LIMIT && page <= MAX_PAGES) {
      const list = await fetchPage(page);
      if (!list.length) {
         console.log('Hết bài trên dev.to.');
         break;
      }
      console.log(`\n--- Trang ${page} (${list.length} bài) ---`);
      page += 1;

      for (const item of list) {
         if (created >= LIMIT) break;

         try {
            const result = await importArticle(item, hashedPassword, userCache);
            if (!result) {
               skipped += 1;
               continue;
            }
            created += 1;
            console.log(`[${created}/${LIMIT}] + ${result.title} (@${result.author.username})`);
            await sleep(250); // tránh rate limit của dev.to
         } catch (err) {
            failed += 1;
            console.error(`[x] ${item.title}: ${err.message}`);
         }
      }
   }

   const [totalPosts, totalUsers, totalTags] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Tag.countDocuments(),
   ]);

   console.log(
      `\nDone. Created: ${created}, skipped (đã có): ${skipped}, failed: ${failed}.` +
         `\nTổng trong DB: ${totalPosts} posts, ${totalUsers} users, ${totalTags} tags.` +
         `\nMật khẩu user seed: ${SEED_PASSWORD}`,
   );
   await mongoose.disconnect();
}

main().catch(async (e) => {
   console.error(e);
   await mongoose.disconnect().catch(() => {});
   process.exit(1);
});
