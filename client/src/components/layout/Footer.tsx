import { ArrowRight } from "lucide-react";
import Container from "./Container";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[--color-dark] pt-20 pb-8 border-t border-[--color-border-dark] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[--color-accent]/20 to-transparent"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="font-display font-bold text-2xl tracking-tight text-[--color-text-inverse]">
                  WindStore
                </span>
              </div>
              <p className="text-[--color-text-dark-secondary] mb-6 text-sm leading-relaxed max-w-sm">
                The ultimate destination for premium Windows laptops. Customize
                your build and conquer your workflow.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[--color-text-inverse] hover:bg-[--color-accent] hover:text-[--color-dark] transition-all duration-150"
                >
                  <Image
                    src="/media_sosial_brand_icon/x.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[--color-text-inverse] hover:bg-[--color-accent] hover:text-[--color-dark] transition-all duration-150"
                >
                  <Image
                    src="/media_sosial_brand_icon/instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[--color-text-inverse] hover:bg-[--color-accent] hover:text-[--color-dark] transition-all duration-150"
                >
                  <Image
                    src="/media_sosial_brand_icon/youtube.svg"
                    alt="Youtube"
                    width={20}
                    height={20}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[--color-text-inverse] hover:bg-[--color-accent] hover:text-[--color-dark] transition-all duration-150"
                >
                  <Image
                    src="/media_sosial_brand_icon/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>

            {/* Column 2: Shop */}
            <div>
              <h4 className="font-display font-bold text-[--color-text-inverse] mb-6 text-lg">
                Shop
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    All Laptops
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Gaming
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    AI-Powered
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Professional
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Ultra Slim
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Deals
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="font-display font-bold text-[--color-text-inverse] mb-6 text-lg">
                Support
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Warranty
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-display font-bold text-[--color-text-inverse] mb-6 text-lg">
                Stay Updated
              </h4>
              <p className="text-[--color-text-dark-secondary] mb-4 text-sm">
                Subscribe to get special offers, free giveaways, and
                once-in-a-lifetime deals.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-[--color-border-dark] rounded-[--radius-lg] py-2 px-4 text-sm text-[--color-text-inverse] focus:outline-none focus:border-[--color-accent]/50 w-full"
                />
                <button className="bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-dark] p-2.5 rounded-[--radius-lg] transition-all duration-150 flex-shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8">
                <h4 className="font-display font-bold text-[--color-text-inverse] mb-4 text-lg">
                  Company
                </h4>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[--color-text-dark-secondary] hover:text-[--color-accent] transition-colors text-sm"
                    >
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="pt-8 border-t border-[--color-border-dark] text-center">
        <p className="text-[--color-text-dark-muted] text-sm">
          &copy; 2025 WindStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
