import './Faqs.scss';
import icons from '~/utils/icons';

const { BsChevronDown } = icons;

const faqs = [
   {
      id: 'account',
      question: 'Làm sao để bắt đầu viết bài trên Dev Community?',
      answer: 'Đăng ký tài khoản, xác thực email rồi bấm "Create Post" ở thanh header. Bài viết hỗ trợ Markdown đầy đủ: heading, code block, ảnh, quote...',
   },
   {
      id: 'markdown',
      question: 'Trình soạn thảo hỗ trợ những gì?',
      answer: 'Editor dùng Markdown chuẩn kèm thanh công cụ nhanh cho in đậm, in nghiêng, link, danh sách, code block và upload ảnh trực tiếp lên Cloudinary.',
   },
   {
      id: 'tags',
      question: 'Tag để làm gì và nên gắn bao nhiêu tag?',
      answer: 'Tag giúp bài viết đến đúng người đọc quan tâm. Nên gắn tối đa 4 tag sát với nội dung; bạn cũng có thể theo dõi tag để trang chủ ưu tiên hiển thị chủ đề đó.',
   },
   {
      id: 'feed',
      question: 'Khác nhau giữa For you, Top và Latest?',
      answer: '"For you" lọc theo các tag bạn đang theo dõi, "Top" sắp xếp theo lượt thích, còn "Latest" là các bài mới đăng gần nhất.',
   },
   {
      id: 'bookmark',
      question: 'Lưu bài để đọc sau bằng cách nào?',
      answer: 'Bấm biểu tượng bookmark trên mỗi bài viết. Tất cả bài đã lưu nằm trong mục "Reading list" ở sidebar (chỉ hiện khi bạn đã đăng nhập).',
   },
   {
      id: 'notification',
      question: 'Tôi có được thông báo khi có người tương tác không?',
      answer: 'Có. Khi ai đó thích, bình luận hoặc theo dõi bạn, thông báo sẽ được đẩy realtime qua Socket.IO và hiển thị ở chuông thông báo trên header.',
   },
];

const Faqs = () => {
   return (
      <div className="faqs">
         <header className="faqs__head">
            <h1 className="faqs__title">Câu hỏi thường gặp</h1>
            <p className="faqs__subtitle">
               Những thắc mắc phổ biến nhất về cách sử dụng Dev Community.
            </p>
         </header>

         <div className="faqs__list">
            {faqs.map((item, index) => (
               <details key={item.id} className="faqs__item" open={index === 0}>
                  <summary className="faqs__question">
                     <span>{item.question}</span>
                     <span className="faqs__chevron">
                        <BsChevronDown size={16} />
                     </span>
                  </summary>
                  <p className="faqs__answer">{item.answer}</p>
               </details>
            ))}
         </div>
      </div>
   );
};

export default Faqs;
