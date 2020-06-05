import React from 'react';
import Icon from '@mdi/react';
import styles from './FavLinks.module.scss';
import { mdiFilm } from '@mdi/js';

const FavLinks: React.FC = () => {
  const onClick = (url: string) => window.open(url, 'new', 'location=0');

  const links = [
    { name: 'Films', url: 'https://www.bbc.co.uk/iplayer/categories/films/most-recent', icon: mdiFilm },
    { name: 'Comedy', url: 'https://www.bbc.co.uk/iplayer/categories/comedy/most-recent', icon: mdiFilm },
    {
      name: 'Drama',
      url: 'https://www.bbc.co.uk/iplayer/categories/drama-and-soaps/most-recent',
      icon: mdiFilm,
    },
    { name: 'Box Sets', url: 'https://www.bbc.co.uk/iplayer/group/p05pn9jr', icon: mdiFilm },
    { name: 'Plex', url: 'https://app.plex.tv/', icon: mdiFilm },
  ];

  const makeChips = (className: string) => {
    return links.map((link) => (
      <div key={link.name} onClick={() => onClick(link.url)} className={className} color="secondary">
        <Icon path={link.icon} size={1} className={styles.icon}/>
        {link.name}
      </div>
    ));
  };

  return <div className={styles.favLinks}>{makeChips(styles.chip)}</div>;
};

export default FavLinks;
