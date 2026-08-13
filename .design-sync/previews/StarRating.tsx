import { StarRating } from '@pantrychef/design-system';

export const Interactive = () => <StarRating value={4} onRate={() => {}} />;

export const Empty = () => <StarRating value={0} onRate={() => {}} />;

export const ReadOnly = () => <StarRating value={5} readOnly />;
