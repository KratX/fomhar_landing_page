// import BannerSection from '../../components/banner-section';
// import ProductCarousel from '../../components/best-section';
import CardSection from '../../components/card-section';
import ClientsSection from '../../components/clients-section';
import Footer from '../../components/footer';
import HeroSection from '../../components/hero-section';
import MarqueeBar from '../../components/marquee-section';
import Navbar from '../../components/Navbar';
// import NewLaunches from '../../components/new-section';
import Newsletter from '../../components/newsletter';
import PopularSkincare from '../../components/products-section';
import PromoSection from '../../components/promo-section';
// import OurReview from '../../components/reviews-section';
import TestimonialsSection from '../../components/testimonial-section';
import WhatMakesUsBetterSection from '../../components/what-makes-us-better';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeBar />
        <PromoSection />
        {/* <section id="best-section">
          <ProductCarousel />
        </section> */}
        <section id="products-section">
          <PopularSkincare />
        </section>
        {/* <BannerSection /> */}
        <section id="card-section">
          <CardSection />
        </section>
        <TestimonialsSection />
        <ClientsSection />
        {/* <NewLaunches /> */}
        <WhatMakesUsBetterSection />
        {/* <OurReview /> */}
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}