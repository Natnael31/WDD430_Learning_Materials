export default function Footer() {
  const currentYear = new Date().getFullYear();
  const teamName = "Handcraft Haven Team 08";

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: "fab fa-facebook-f",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: "fab fa-instagram",
    },
    { name: "Twitter", href: "https://twitter.com", icon: "fab fa-twitter" },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: "fab fa-tiktok",
    },
  ];

  return (
    <footer
      className="bg-gray-900 text-gray-300 py-8 md:py-12 px-4"
      style={{ fontFamily: "var(--font-roboto-slab)" }}
      role="contentinfo"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
          <div className="text-center md:text-left md:flex-1">
            <h2 className="text-white text-xl font-bold mb-3 md:mb-4">
              Handcrafted Haven
            </h2>
            <p className="text-sm text-gray-400 mb-3 md:mb-4 max-w-md mx-auto md:mx-0">
              Connecting talented creators with those who appreciate the beauty
              of handmade products.
            </p>
            <p className="text-xs text-gray-500">
              &copy; {currentYear} {teamName}.<br className="block md:hidden" />
              <span className="hidden md:inline"> </span>
              All rights reserved.
            </p>
          </div>

          <div className="text-center md:text-right md:flex-1">
            <h3 className="text-white text-lg font-semibold mb-3 md:mb-4">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-end space-x-5 md:space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-all duration-200 hover:scale-110 inline-block text-2xl md:text-2xl"
                  aria-label={`Visit our ${social.name} page`}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Stay updated with the latest creations and artist stories.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-2 text-center text-xs text-gray-500">
          <p>
            &copy; {currentYear} {teamName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
