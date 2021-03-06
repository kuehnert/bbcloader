import React from 'react';
import styles from './FavLinks.module.scss';
import classnames from 'classnames';

const FavLinks: React.FC = () => {
  // const onClick = (url: string) => window.open(url, 'new', 'location=0');
  const onClick = (url: string) => window.open(url, 'new');

  const links = [
    { name: 'Films', url: 'https://www.bbc.co.uk/iplayer/categories/films/most-recent', icon: 'mdi mdi-movie-open' },
    { name: 'Comedy', url: 'https://www.bbc.co.uk/iplayer/categories/comedy/most-recent', icon: 'mdi mdi-drama-masks' },
    {
      name: 'Drama',
      url: 'https://www.bbc.co.uk/iplayer/categories/drama-and-soaps/most-recent',
      icon: 'mdi mdi-knife',
    },
    { name: 'Box Sets', url: 'https://www.bbc.co.uk/iplayer/group/p05pn9jr', icon: 'mdi mdi-disc' },
  ];

  const makeChips = (className: string) => {
    return links.map((link) => (
      <div
        key={link.name}
        onClick={() => onClick(link.url)}
        className={classnames('p-col', className)}
        color="secondary"
      >
        <span>
          <i className={classnames(link.icon, styles.icon)} />
          <span className={styles.label}>{link.name}</span>
        </span>
      </div>
    ));
  };

  return <div className={classnames('p-grid', styles.favLinks)}>{makeChips(styles.chip)}</div>;
};

export default FavLinks;
