import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const SITE_NAME = "NSS Engenharia";

const getOrCreateMeta = (selector: string, attribute: "name" | "property", value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  return element;
};

const Seo = ({ title, description, type = "website", noIndex = false }: SeoProps) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    getOrCreateMeta('meta[name="description"]', "name", "description").content = description;
    getOrCreateMeta('meta[name="robots"]', "name", "robots").content = noIndex
      ? "noindex, nofollow"
      : "index, follow";
    getOrCreateMeta('meta[property="og:title"]', "property", "og:title").content = fullTitle;
    getOrCreateMeta('meta[property="og:description"]', "property", "og:description").content = description;
    getOrCreateMeta('meta[property="og:type"]', "property", "og:type").content = type;
    getOrCreateMeta('meta[name="twitter:title"]', "name", "twitter:title").content = fullTitle;
    getOrCreateMeta('meta[name="twitter:description"]', "name", "twitter:description").content = description;
  }, [description, noIndex, title, type]);

  return null;
};

export default Seo;
