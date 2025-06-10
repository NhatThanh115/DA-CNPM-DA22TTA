import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = `${t('about')} | BookHaven`;
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('about')} BookHaven</h1>

        <div className="prose lg:prose-lg max-w-none">
          <p className="text-lg mb-4">
            Welcome to BookHaven, your premier online destination for discovering and purchasing the best books from around the world.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Founded in 2023, BookHaven began with a simple mission: to connect readers with the books they love at competitive prices.
            What started as a small online bookstore has grown into a comprehensive platform offering thousands of titles across various genres.
          </p>

          <p className="mt-4">
            Our team consists of passionate book lovers dedicated to helping you find your next great read. We believe that books have the power to
            inspire, educate, and transform lives, and we're committed to making quality literature accessible to everyone.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Curated Selection: Each book in our collection is thoughtfully selected by our team of literary experts.</li>
            <li>Competitive Pricing: We work directly with publishers to offer you the best possible prices.</li>
            <li>Fast Shipping: Get your books delivered quickly and reliably to your doorstep.</li>
            <li>Expert Recommendations: Our personalized recommendation system helps you discover books you'll love.</li>
            <li>Community Focus: We organize virtual book clubs, author interviews, and reading challenges to foster a community of readers.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p>
            At BookHaven, we envision a world where everyone has access to the books that will enrich their lives.
            We're continuously expanding our catalog and enhancing our platform to provide you with the best possible book shopping experience.
          </p>

          
          <p className="mt-8 italic">
            Thank you for choosing BookHaven as your trusted source for literary adventures. Happy reading!
          </p>
        </div>
      </div>
    </div>
  );
}
