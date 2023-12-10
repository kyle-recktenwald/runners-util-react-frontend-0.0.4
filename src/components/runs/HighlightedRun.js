import classes from './HighlightedRun.module.css';

const HighlightedRun = (props) => {
  return (
    <figure className={classes.run}>
      <p>{props.dateTime}</p>
      <figcaption>{props.distance} in {props.duration}</figcaption>
    </figure>
  );
};

export default HighlightedRun;
