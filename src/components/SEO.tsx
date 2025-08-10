import React from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonicalPath }) => {
  React.useEffect(() => {
    document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    if (canonicalPath) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      const base = window.location.origin;
      link.setAttribute('href', `${base}${canonicalPath}`);
    }
  }, [title, description, canonicalPath]);

  return null;
};

export default SEO;
