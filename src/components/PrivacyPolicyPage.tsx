import React from 'react';
import AppLayout from './AppLayout';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
const PrivacyPolicyPage = () => {
  return <AppLayout>
      

      <div className="glass-card p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-white mr-3" />
          <div>
            <h2 className="text-xl font-bold text-white">Your Privacy Matters</h2>
            <p className="text-white/70">Last updated: June 2023</p>
          </div>
        </div>

        <div className="space-y-6 text-white/90">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
            <p className="mb-3">
              We collect information you provide directly to us, such as when you create an account, 
              place an order, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Personal information (name, email, phone number)</li>
              <li>Address information for pickup and delivery</li>
              <li>Payment information (processed securely)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>To provide and improve our laundry services</li>
              <li>To process orders and payments</li>
              <li>To communicate with you about your orders</li>
              <li>To send promotional offers (with your consent)</li>
              <li>To ensure the security of our services</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Information Sharing</h3>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist us in operations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
            <p className="text-white/80">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. All payment 
              information is processed through secure, encrypted channels.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <p className="text-white/80">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@advancewashing.com
              <br />
              Phone: +91 9876543210
            </p>
          </section>
        </div>
      </div>
    </AppLayout>;
};
export default PrivacyPolicyPage;