import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">FPT</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Alumni Connection</h3>
                <p className="text-xs text-gray-400">FPT University</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting FPT University alumni worldwide for networking, career
              growth, and knowledge sharing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/network"
                  className="hover:text-white transition-colors"
                >
                  Alumni Network
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-white transition-colors"
                >
                  Job Board
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/mentoring"
                  className="hover:text-white transition-colors"
                >
                  Mentoring
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/forums"
                  className="hover:text-white transition-colors"
                >
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>FPT University</li>
              <li>Ho Chi Minh City, Vietnam</li>
              <li>alumni@fpt.edu.vn</li>
              <li>+84 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2024 FPT University Alumni Connection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
