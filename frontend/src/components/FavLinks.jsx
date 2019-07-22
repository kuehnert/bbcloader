import React from 'react';
import { Chip, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LocalPlay } from '@material-ui/icons'

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

const onClick = (url) => window.open(url, '_blank', 'location=0');

const links = [
  { name: 'Films', url: 'https://www.bbc.co.uk/iplayer/categories/films/most-recent' },
  { name: 'Comedy', url: 'https://www.bbc.co.uk/iplayer/categories/comedy/most-recent' },
  { name: 'Drama', url: 'https://www.bbc.co.uk/iplayer/categories/drama-and-soaps/most-recent' },
  { name: 'Box Sets', url: 'https://www.bbc.co.uk/iplayer/group/p05pn9jr' },
];

const makeChips = (className) => {
  return links.map(link => <Chip key={link.name} label={link.name} onClick={() => onClick(link.url)} className={className} color="secondary" avatar={<Avatar><LocalPlay /></Avatar>} />);
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
