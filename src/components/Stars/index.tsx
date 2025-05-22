import { JSX } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import styles from './stars.module.css';

/**
 * Renders a star rating component.
 *
 * @param {number} rating - The rating value, which determines the number of filled stars.
 * @param {boolean} withText - A flag indicating whether to display the rating text.
 * @returns {JSX.Element} A JSX element containing the star rating and optional text.
 */
const Stars = ({
  rating,
  withText,
}: {
  rating: number;
  withText: boolean;
}): JSX.Element => {
  return (
    <div className={styles.stars}>
      <div className={styles.stars}>
        {Array.from({ length: 5 }, (_, index) =>
          index < rating ? <FaStar key={index} /> : <FaRegStar key={index} />
        )}
      </div>
      {withText && <span>({rating} stars)</span>}
    </div>
  );
};

export default Stars;
