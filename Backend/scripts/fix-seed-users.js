/**
 * Thay tên / username / avatar / bio của các user đã seed từ dev.to
 * bằng danh tính tự chế (không dùng dữ liệu của dev.to nữa).
 *
 *   node scripts/fix-seed-users.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const { buildIdentity } = require('./fake-identity');

async function uniqueIdentity(seedKey, userId) {
   for (let salt = 0; salt < 50; salt += 1) {
      const identity = buildIdentity(seedKey, salt);
      const clash = await User.findOne({
         _id: { $ne: userId },
         $or: [{ username: identity.username }, { email: identity.email }],
      });
      if (!clash) return identity;
   }
   throw new Error(`Không sinh được username duy nhất cho "${seedKey}"`);
}

async function main() {
   if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI in .env');
   await mongoose.connect(process.env.MONGODB_URI);
   console.log('DB connected');

   const users = await User.find({ email: /@devto\.seed$/ });
   console.log(`Tìm thấy ${users.length} user cần sửa`);

   for (const user of users) {
      const oldName = `${user.username}`;
      const identity = await uniqueIdentity(oldName, user._id);

      await User.updateOne({ _id: user._id }, { $set: identity });
      console.log(`✔ ${oldName} -> ${identity.username} (${identity.firstname} ${identity.lastname})`);
   }

   const left = await User.countDocuments({ email: /@devto\.seed$/ });
   console.log(`\nDone. Còn lại ${left} user dev.to.`);
   await mongoose.disconnect();
}

main().catch(async (e) => {
   console.error(e);
   await mongoose.disconnect().catch(() => {});
   process.exit(1);
});
