import { Instagram, Facebook, Linkedin, Youtube, BookOpen, Globe, Twitter } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const SocialLinks = () => {
  const { data: socialLinksData, isLoading } = useSocialLinks();

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      case 'blog': return BookOpen;
      default: return Globe;
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
        ))}
      </div>
    );
  }

  const socialLinks = socialLinksData || [];

  return (
    <div className="flex gap-4">
      {socialLinks.map((link) => {
        const Icon = getIcon(link.platform);
        return (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('http') ? "_blank" : "_self"}
            rel={link.url.startsWith('http') ? "noreferrer noopener" : undefined}
            className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-secondary hover:text-foreground transition-all duration-300"
            aria-label={link.platform}
          >
            <Icon size={28} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;