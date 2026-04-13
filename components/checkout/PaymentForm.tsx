'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentData } from '@/lib/validations';

interface PaymentFormProps {
  paymentData: Partial<PaymentData>;
  onPaymentChange: (data: Partial<PaymentData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function PaymentForm({
  paymentData,
  onPaymentChange,
  onValidationChange,
}: PaymentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    const updated = { ...paymentData, [field]: value };
    onPaymentChange(updated);

    // Clear error
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Validate
    validatePayment(updated);
  };

  const validatePayment = (data: Partial<PaymentData>) => {
    const newErrors: Record<string, string> = {};

    if (!data.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!data.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    if (!data.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the privacy policy';
    }

    if (data.paymentMethod === 'credit_card') {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
        newErrors.cardExpiry = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        newErrors.cardCvv = 'Please enter a valid CVV';
      }
      if (!data.cardName || data.cardName.length < 2) {
        newErrors.cardName = 'Please enter the cardholder name';
      }
    }

    setErrors(newErrors);
    onValidationChange(Object.keys(newErrors).length === 0 && !!data.paymentMethod && !!data.termsAccepted && !!data.privacyAccepted);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
          Payment Information
        </h2>
        <p className="text-gray-600">
          Choose your payment method and complete the payment details.
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-xl p-6 md:p-8 card-shadow">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['credit_card', 'bank_transfer', 'paypal'] as const).map((method) => (
            <motion.button
              key={method}
              type="button"
              onClick={() => updateField('paymentMethod', method)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentData.paymentMethod === method
                  ? 'border-[#485342] bg-[#485342]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {method === 'credit_card' && '💳'}
                  {method === 'bank_transfer' && '🏦'}
                  {method === 'paypal' && '🔵'}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {method === 'credit_card' && 'Credit Card'}
                  {method === 'bank_transfer' && 'Bank Transfer'}
                  {method === 'paypal' && 'PayPal'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red-500">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Credit Card Form */}
      {paymentData.paymentMethod === 'credit_card' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 md:p-8 card-shadow space-y-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Details</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentData.cardNumber || ''}
              onChange={(e) => updateField('cardNumber', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={paymentData.cardExpiry || ''}
                onChange={(e) => updateField('cardExpiry', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardExpiry && (
                <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={paymentData.cardCvv || ''}
                onChange={(e) => updateField('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.cardCvv ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardCvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cardCvv}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cardholder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentData.cardName || ''}
              onChange={(e) => updateField('cardName', e.target.value)}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                errors.cardName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Billing Address (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={paymentData.billingAddress?.street || ''}
                onChange={(e) => updateField('billingAddress', { ...paymentData.billingAddress, street: e.target.value })}
                placeholder="Street Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all"
              />
              <input
                type="text"
                value={paymentData.billingAddress?.city || ''}
                onChange={(e) => updateField('billingAddress', { ...paymentData.billingAddress, city: e.target.value })}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all"
              />
              <input
                type="text"
                value={paymentData.billingAddress?.country || ''}
                onChange={(e) => updateField('billingAddress', { ...paymentData.billingAddress, country: e.target.value })}
                placeholder="Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all"
              />
              <input
                type="text"
                value={paymentData.billingAddress?.postalCode || ''}
                onChange={(e) => updateField('billingAddress', { ...paymentData.billingAddress, postalCode: e.target.value })}
                placeholder="Postal Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Method Info */}
      {paymentData.paymentMethod === 'bank_transfer' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Bank Transfer Instructions</h3>
          <p className="text-blue-800 text-sm mb-4">
            You will receive bank transfer details via email after booking confirmation.
          </p>
        </motion.div>
      )}

      {paymentData.paymentMethod === 'paypal' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">PayPal Payment</h3>
          <p className="text-blue-800 text-sm mb-4">
            You will be redirected to PayPal to complete your payment after booking confirmation.
          </p>
        </motion.div>
      )}

      {/* Terms and Conditions */}
      <div className="bg-white rounded-xl p-6 md:p-8 card-shadow space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={paymentData.termsAccepted || false}
            onChange={(e) => updateField('termsAccepted', e.target.checked)}
            className="mt-1 w-5 h-5 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the <a href="/terms" target="_blank" className="text-[#485342] hover:underline font-semibold">Terms and Conditions</a> <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500 ml-8">{errors.termsAccepted}</p>
        )}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            checked={paymentData.privacyAccepted || false}
            onChange={(e) => updateField('privacyAccepted', e.target.checked)}
            className="mt-1 w-5 h-5 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
          />
          <label htmlFor="privacy" className="text-sm text-gray-700">
            I agree to the <a href="/privacy" target="_blank" className="text-[#485342] hover:underline font-semibold">Privacy Policy</a> <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.privacyAccepted && (
          <p className="text-sm text-red-500 ml-8">{errors.privacyAccepted}</p>
        )}

        <div className="flex items-start gap-2 pt-2">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-gray-600">
            Your payment information is secure and encrypted. We never store your full card details.
          </p>
        </div>
      </div>
    </div>
  );
}

