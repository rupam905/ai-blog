import logo from './logo.svg'
import arrow from './arrow.svg'
import upload_area from './upload_area.svg'
import user_icon from './user_icon.svg'
import star_icon from './star_icon.svg'
import gradientBackground from './gradientBackground.png'

export const assets = {
    logo,
    arrow,
    upload_area,
    user_icon,
    star_icon,
    gradientBackground,
}
export const blogCategories = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']

export const footer_data = [
      {
          title: "Explore",
          links: [
              { label: "Home", to: "/" },
              { label: "Latest Stories", to: "/#stories" },
              { label: "Categories", to: "/#stories" },
              { label: "Search", to: "/#search-blogs" },
          ]
      },
      {
          title: "Company",
          links: [
              { label: "About Us", to: "/about" },
              { label: "Contact", to: "/contact" },
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
          ]
      },
      {
          title: "Follow Us",
          links: [
              { label: "Twitter", to: "#" },
              { label: "Instagram", to: "#" },
              { label: "Facebook", to: "#" },
              { label: "LinkedIn", to: "#" },
          ]
      }
  ];
