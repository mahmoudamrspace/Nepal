'use client';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div 
      className="article-content text-lg leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}


