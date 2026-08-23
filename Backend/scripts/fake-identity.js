/**
 * Sinh danh tính "ảo" (tên, username, avatar, bio) cho user seed.
 * Deterministic: cùng một seed key luôn ra cùng một danh tính.
 */

const LAST_NAMES = [
   'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vu', 'Dang', 'Bui',
   'Do', 'Ho', 'Ngo', 'Duong', 'Ly', 'Phan', 'Truong', 'Dinh',
];

const MIDDLE_NAMES = ['Van', 'Thi', 'Minh', 'Quoc', 'Hoai', 'Ngoc', 'Gia', 'Tuan', ''];

const FIRST_NAMES = [
   'An', 'Bao', 'Chi', 'Dung', 'Duy', 'Giang', 'Ha', 'Hai', 'Hieu', 'Hung',
   'Khanh', 'Khoa', 'Lam', 'Linh', 'Long', 'Mai', 'Nam', 'Nhat', 'Phong', 'Phuc',
   'Quan', 'Quynh', 'Son', 'Tam', 'Thanh', 'Thao', 'Thinh', 'Trang', 'Trung', 'Tuan',
   'Vinh', 'Yen',
];

const ROLES = [
   'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
   'Mobile Developer', 'DevOps Engineer', 'Data Engineer',
   'UI/UX Designer', 'Software Engineer', 'Cloud Engineer', 'QA Engineer',
];

const LOCATIONS = [
   'Ha Noi, Viet Nam', 'Ho Chi Minh City, Viet Nam', 'Da Nang, Viet Nam',
   'Can Tho, Viet Nam', 'Hai Phong, Viet Nam', 'Hue, Viet Nam',
];

const SKILLS = [
   'JavaScript, React, Node.js', 'TypeScript, Next.js, GraphQL',
   'Python, Django, PostgreSQL', 'Go, Docker, Kubernetes',
   'Java, Spring Boot, MySQL', 'Flutter, Dart, Firebase',
   'Vue.js, Nuxt, Tailwind CSS', 'C#, .NET, Azure',
];

const AVATAR_STYLES = ['avataaars', 'bottts', 'lorelei', 'notionists', 'adventurer', 'personas'];

/** Hash chuỗi -> số nguyên dương, ổn định giữa các lần chạy. */
const hash = (str) => {
   let h = 2166136261;
   for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
   }
   return Math.abs(h);
};

const pick = (arr, seed, salt) => arr[hash(`${salt}:${seed}`) % arr.length];

const slugSafe = (str) =>
   str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '');

/**
 * @param {string} seedKey  khoá bất kỳ (vd: tên tác giả gốc) để sinh danh tính
 * @param {number} salt     thêm vào khi cần tránh trùng username
 */
const buildIdentity = (seedKey, salt = 0) => {
   const key = `${seedKey}#${salt}`;
   const lastname = pick(LAST_NAMES, key, 'last');
   const middle = pick(MIDDLE_NAMES, key, 'mid');
   const firstname = pick(FIRST_NAMES, key, 'first');
   const style = pick(AVATAR_STYLES, key, 'style');

   const fullFirst = middle ? `${middle} ${firstname}` : firstname;
   const suffix = hash(`u:${key}`) % 1000;
   const username = `${slugSafe(firstname)}${slugSafe(lastname)}${suffix}`;
   const role = pick(ROLES, key, 'role');

   return {
      username,
      firstname: fullFirst,
      lastname,
      email: `${username}@devcommunity.local`,
      avatar: `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(username)}`,
      bio: `${role} · yêu thích chia sẻ kiến thức lập trình.`,
      links: `https://github.com/${username}`,
      work: role,
      location: pick(LOCATIONS, key, 'loc'),
      skills: pick(SKILLS, key, 'skill'),
   };
};

module.exports = { buildIdentity };
