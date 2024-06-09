import './About.scss';

const About = () => {
    return (
        <div className="about">
            <h1 className="about__title">About Us</h1>
            <div className="about__section">
                <h2 className="about__subtitle">About the Website</h2>
                <p className="about__text">
                    This website is a community for web developers to share knowledge, ask questions, and collaborate on
                    projects. Our mission is to provide a platform where developers can learn from each other and grow
                    their skills.
                </p>
            </div>
            <div className="about__section">
                <h2 className="about__subtitle">About the Author</h2>
                <p className="about__text">
                    The author of this website is a passionate web developer with over 5 years of experience in the
                    field. They have a deep understanding of modern web technologies and enjoy sharing their knowledge
                    with the community.
                </p>
            </div>
        </div>
    );
};

export default About;
