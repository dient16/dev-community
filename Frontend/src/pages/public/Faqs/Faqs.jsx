import './Faqs.scss';

const Faqs = () => {
    return (
        <div className="faqs">
            <h1 className="faqs__title">Frequently Asked Questions</h1>
            <div className="faqs__item">
                <div className="faqs__question">What is React?</div>
                <div className="faqs__answer">React is a JavaScript library for building user interfaces.</div>
            </div>
            <div className="faqs__item">
                <div className="faqs__question">What is BEM?</div>
                <div className="faqs__answer">
                    BEM stands for Block, Element, Modifier, a methodology for writing clean CSS.
                </div>
            </div>
            <div className="faqs__item">
                <div className="faqs__question">How do I use SCSS with React?</div>
                <div className="faqs__answer">
                    You can use SCSS in React by importing the SCSS file in your component file.
                </div>
            </div>
        </div>
    );
};

export default Faqs;
