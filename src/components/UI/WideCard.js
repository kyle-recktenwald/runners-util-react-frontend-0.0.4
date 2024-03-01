import classes from './WideCard.module.css';

const WideCard = (props) => {
  return <div className={classes.card}>{props.children}</div>;
};

export default WideCard;
