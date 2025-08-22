import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex-grow py-16 bg-white flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">Contact</h3>
        <div className="flex justify-center mt-2 mb-6">
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Feel free to reach out to me for any inquiries or collaboration opportunities
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Address</h4>
                <p className="text-gray-600">Thanh Hoa, Vietnam</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Call Us</h4>
                <p className="text-gray-600">(+84) 913 118 423</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Email Us</h4>
                <p className="text-gray-600">ntq.145@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-4 contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <textarea
                  rows={5}
                  placeholder="Message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;