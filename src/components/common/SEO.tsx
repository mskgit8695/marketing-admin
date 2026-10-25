import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | OmniFlow Marketing Platform`;
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return (
    <>
      <title>{`${title} | OmniFlow Marketing Platform`}</title>
      {description && <meta name="description" content={description} />}
    </>
  );
}
