
import React from 'react';
import AppLayout from './AppLayout';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-white mr-3" />
          <div>
            <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
            <p className="text-white/70">Last updated: June 2023</p>
          </div>
        </div>

        <div className="space-y-6 text-white/90">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="text-white/80">
              By using Advance Washing services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. Service Description</h3>
            <p className="mb-3">Advance Washing provides:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Laundry and dry cleaning services</li>
              <li>Pickup and delivery services</li>
              <li>Garment care and maintenance</li>
              <li>Special fabric treatments</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. User Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Provide accurate contact and address information</li>
              <li>Ensure items are suitable for our cleaning processes</li>
              <li>Report any special care instructions</li>
              <li>Be available during scheduled pickup/delivery times</li>
              <li>Pay for services in a timely manner</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Pricing and Payment</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Prices are subject to change with notice</li>
              <li>Payment is due upon completion of service</li>
              <li>We accept various payment methods</li>
              <li>Late payment fees may apply</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Liability and Insurance</h3>
            <p className="mb-3 text-white/80">
              While we take utmost care of your garments, our liability is limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>10 times the cleaning charge for damaged items</li>
              <li>Original purchase price with valid receipt</li>
              <li>We are not liable for items left over 30 days</li>
              <li>Special items require prior notice and acceptance</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">6. Prohibited Items</h3>
            <p className="mb-3">We do not accept:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Items contaminated with hazardous materials</li>
              <li>Leather goods (unless specified)</li>
              <li>Wedding dresses (requires special service)</li>
              <li>Items with non-permanent stains</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Cancellation Policy</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Orders can be cancelled before pickup</li>
              <li>Cancellation fees may apply for scheduled pickups</li>
              <li>Refunds processed within 3-5 business days</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">8. Contact Information</h3>
            <p className="text-white/80">
              For questions about these Terms of Service:
              <br />
              Email: support@advancewashing.com
              <br />
              Phone: +91 9876543210
              <br />
              Address: 123 Laundry Street, City, State 12345
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default TermsOfServicePage;
