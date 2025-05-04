import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Mail, 
  MessageCircle, 
  Shield, 
  FileText, 
  Heart,
  ExternalLink, 
  Code
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wide text-white">
                Country<span className="text-blue-400">Explorer</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Discover and explore countries from around the world. Access detailed information about populations, languages, regions, and more.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 5.8a8.6 8.6 0 0 1-2.36.7 4.07 4.07 0 0 0 1.8-2.27 8.5 8.5 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.8 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C4 10.3 3.48 10.2 3 10a4.1 4.1 0 0 0 3.3 4.07 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.4a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.67-6.25 11.67-11.67l-.01-.53A8.74 8.74 0 0 0 22 5.8z"></path>
                </svg>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.26 3.26 0 012.85-1.4c1.7 0 3.25.8 3.25 3.71z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Features */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/countries/all" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>All Countries</span>
                </Link>
              </li>
              <li>
                <Link to="/countries/region" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Browse by Region</span>
                </Link>
              </li>
              <li>
                <Link to="/countries/language" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Browse by Language</span>
                </Link>
              </li>
              <li>
                <Link to="/statistics" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Statistics</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  <span>Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>REST Countries API</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Changelog</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                <a href="mailto:contact@countryexplorer.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  contact@countryexplorer.com
                </a>
              </li>
              <li className="flex items-start">
                <MessageCircle className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  Have questions? <a href="#" className="text-blue-400 hover:underline">Chat with us</a>
                </span>
              </li>
            </ul>
            
            <h3 className="text-white font-semibold text-lg mt-6 mb-3">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-2">Subscribe for updates on new features</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-700 text-white px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-r-md text-white text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer with copyright */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-2 md:mb-0">
            © {currentYear} CountryExplorer. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              <Shield className="w-4 h-4 inline-block mr-1.5" />
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              <FileText className="w-4 h-4 inline-block mr-1.5" />
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;