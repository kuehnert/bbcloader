import React from 'react';
import styles from './FavLinks.module.scss';
import classnames from 'classnames'

const FavLinks: React.FC = () => {
  const onClick = (url: string) => window.open(url, 'new', 'location=0');

  const links = [
    { name: 'Films', url: 'https://www.bbc.co.uk/iplayer/categories/films/most-recent', icon: 'mdi mdi-movie-open' },
    { name: 'Comedy', url: 'https://www.bbc.co.uk/iplayer/categories/comedy/most-recent', icon: 'mdi mdi-drama-masks' },
    {
      name: 'Drama',
      url: 'https://www.bbc.co.uk/iplayer/categories/drama-and-soaps/most-recent',
      icon: 'mdi mdi-knife',
    },
    { name: 'Box Sets', url: 'https://www.bbc.co.uk/iplayer/group/p05pn9jr', icon: 'mdi mdi-disc' },
    { name: 'Plex', url: 'https://app.plex.tv/', icon: 'mdi mdi-plex' },
  ];

  const makeChips = (className: string) => {
    return links.map((link) => (
      <div key={link.name} onClick={() => onClick(link.url)} className={className} color="secondary">
        <i className={classnames(link.icon, styles.icon)} />
        {link.name}
      </div>
    ));
  };

  return <div className={styles.favLinks}>{makeChips(styles.chip)}</div>;
};

export default FavLinks;
