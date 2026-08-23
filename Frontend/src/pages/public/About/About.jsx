import './About.scss';
import icons from '~/utils/icons';

const { BsFillPostcardFill, BsTag, RiChat1Line, RiHeart2Line } = icons;

const features = [
   {
      id: 'write',
      icon: <BsFillPostcardFill size={22} />,
      title: 'Viết bằng Markdown',
      desc: 'Trình soạn thảo Markdown kèm preview, code block và upload ảnh trực tiếp.',
   },
   {
      id: 'tags',
      icon: <BsTag size={22} />,
      title: 'Khám phá theo tag',
      desc: 'Theo dõi chủ đề bạn quan tâm để trang chủ luôn hiển thị nội dung phù hợp.',
   },
   {
      id: 'discuss',
      icon: <RiChat1Line size={22} />,
      title: 'Thảo luận cùng cộng đồng',
      desc: 'Bình luận nhiều tầng, trả lời trực tiếp và nhận thông báo realtime.',
   },
   {
      id: 'save',
      icon: <RiHeart2Line size={22} />,
      title: 'Lưu và thích bài viết',
      desc: 'Bookmark bài hay vào Reading list để đọc lại bất cứ lúc nào.',
   },
];

const stack = ['React', 'Vite', 'React Query', 'SCSS', 'Ant Design', 'Node.js', 'Express', 'MongoDB', 'Socket.IO'];

const About = () => {
   return (
      <div className="about">
         <section className="about__hero">
            <span className="about__badge">Về chúng tôi</span>
            <h1 className="about__title">Nơi lập trình viên chia sẻ kiến thức</h1>
            <p className="about__lead">
               Dev Community là không gian mở để developer viết bài, đặt câu hỏi và học hỏi lẫn
               nhau — đơn giản, không quảng cáo, tập trung vào nội dung.
            </p>
         </section>

         <section className="about__features">
            {features.map((item) => (
               <article key={item.id} className="about__feature">
                  <span className="about__feature-icon">{item.icon}</span>
                  <h3 className="about__feature-title">{item.title}</h3>
                  <p className="about__feature-desc">{item.desc}</p>
               </article>
            ))}
         </section>

         <section className="about__section">
            <h2 className="about__subtitle">Sứ mệnh</h2>
            <p className="about__text">
               Chúng tôi tin rằng kiến thức trở nên giá trị hơn khi được chia sẻ. Mỗi bài viết ở đây
               đều có thể giúp một lập trình viên khác tiết kiệm hàng giờ debug. Vì vậy nền tảng
               được xây dựng quanh một mục tiêu duy nhất: giúp việc viết và tìm nội dung kỹ thuật
               trở nên dễ dàng nhất có thể.
            </p>
         </section>

         <section className="about__section">
            <h2 className="about__subtitle">Công nghệ sử dụng</h2>
            <p className="about__text">
               Dự án là một ứng dụng MERN hoàn chỉnh, mã nguồn mở và luôn chào đón đóng góp.
            </p>
            <ul className="about__stack">
               {stack.map((tech) => (
                  <li key={tech} className="about__stack-item">
                     {tech}
                  </li>
               ))}
            </ul>
         </section>
      </div>
   );
};

export default About;
