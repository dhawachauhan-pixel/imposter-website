import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './BlogTeaser.css';

export const BlogTeaser: React.FC = () => {
  const { t } = useI18n();

  const articles = [
    {
      id: 'words',
      title: t.blogTeaser.card1Title,
      category: t.blogTeaser.card1Category,
      readTime: t.blogTeaser.card1ReadTime,
      icon: '📝',
    },
    {
      id: 'strategy',
      title: t.blogTeaser.card2Title,
      category: t.blogTeaser.card2Category,
      readTime: t.blogTeaser.card2ReadTime,
      icon: '🎯',
    },
    {
      id: 'games-like',
      title: t.blogTeaser.card3Title,
      category: t.blogTeaser.card3Category,
      readTime: t.blogTeaser.card3ReadTime,
      icon: '🎲',
    },
  ];

  return (
    <section id="blog" className="section-wrapper" aria-label="Game Guides and Articles">
      <div className="section-header">
        <span className="badge badge-purple">{t.blogTeaser.badge}</span>
        <h2 className="heading-section">{t.blogTeaser.title}</h2>
        <p className="section-subtitle">{t.blogTeaser.subtitle}</p>
      </div>

      <div className="blog-cards-grid">
        {articles.map((article) => (
          <article key={article.id} className="blog-card">
            <div className="blog-card-meta">
              <span className="badge badge-muted">{article.category}</span>
              <span>{article.readTime}</span>
            </div>
            <h3 className="blog-card-title">{article.title}</h3>
            <div className="blog-card-read-more">
              <span>Read article</span>
              <span aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
