import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryHero from '@/components/categories/CategoryHero';
import ContactInfoCards from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';
import MapSection from '@/components/contact/MapSection';
import { contactInfo } from '@/data/contactInfo';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CategoryHero
          title="CONTACT US"
          subtitle="We'd love to hear from you"
          heroImage="https://images.unsplash.com/photo-1618082445556-8b5e4fee89dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          ctaText="View Our Packages"
          ctaHref="/packages"
        />

        <ContactInfoCards contactInfo={contactInfo} />

        <ContactForm />

        <MapSection contactInfo={contactInfo} />
      </main>
      <Footer />
    </>
  );
}

