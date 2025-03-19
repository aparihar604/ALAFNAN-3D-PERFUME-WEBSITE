import './UniqueSection.css'; // External CSS file for styling

const UniqueSection = () => {
  return (
    <section className="unique-section">
      <h2>What Makes Us Unique</h2>
      <div className="content-container">
        <div className="content-block">
          <h3>Locally Inspired</h3>
          <p>
            Our perfumes are meticulously crafted to reflect the cultural heritage, traditions, and landscapes
            of various regions. From the vibrant streets of Marrakech to the serene cherry blossom gardens
            of Kyoto, each fragrance tells a unique story that resonates with its origin.
          </p>
        </div>
        <div className="content-block">
          <h3>High-Quality Ingredients</h3>
          <p>
            We believe that the key to an extraordinary scent lies in the quality of ingredients. That's why
            we collaborate with expert perfumers who source the finest and ethically-sourced materials from
            around the world. We never compromise on the quality of our products, ensuring a long-lasting and luxurious experience.
          </p>
        </div>
        <div className="content-block">
          <h3>Personalized Service</h3>
          <p>
            We understand that choosing the perfect scent is a deeply personal experience. Our team of fragrance
            experts is always ready to assist you in finding a fragrance that complements your personality and style.
            Whether you're exploring new scents or seeking to rediscover an old favorite, we're here to guide you every step of the way.
          </p>
        </div>
      </div>
      <p className="closing-text">
        Join us on this olfactory adventure as we celebrate the diverse tapestry of scents from around the world.
        Discover the captivating aromas that embrace the essence of local cultures and connect with the beauty of our shared humanity.
      </p>
      <p className="closing-signature">
        Thank you for being a part of our journey.<br />
        With love and gratitude,<br />
        The Local Face Perfumes Team
      </p>
    </section>
  );
};

export default UniqueSection;