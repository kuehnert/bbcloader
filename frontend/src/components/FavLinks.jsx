import React from 'react';
import { Chip, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

// const onClick = (url) => window.open(url, '_blank', 'location=0');
const onClick = (url) => window.open(url, 'new', 'location=0');

const links = [
  { name: 'Films', url: 'https://www.bbc.co.uk/iplayer/categories/films/most-recent', icon: 'mdi mdi-film' },
  { name: 'Comedy', url: 'https://www.bbc.co.uk/iplayer/categories/comedy/most-recent', icon: 'mdi mdi-film' },
  { name: 'Drama', url: 'https://www.bbc.co.uk/iplayer/categories/drama-and-soaps/most-recent', icon: 'mdi mdi-film' },
  { name: 'Box Sets', url: 'https://www.bbc.co.uk/iplayer/group/p05pn9jr', icon: 'mdi mdi-film' },
  { name: 'Plex', url: 'https://app.plex.tv/', icon: 'mdi mdi-film' },
];

const makeChips = (className) => {
  return links.map(link => <Chip key={link.name} label={link.name} onClick={() => onClick(link.url)} className={className} color="secondary" icon={<Icon path={mdiAccount}/>} />);
};

const FavLinks = () => {
  const classes = useStyles();
  const chips = makeChips(classes.chip);

  return (
    <div className={classes.root}>
      {chips}
    </div>
  );
};

export default FavLinks;
