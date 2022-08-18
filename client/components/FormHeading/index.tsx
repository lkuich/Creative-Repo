import BackButton from 'components/BackButton';
import { Row } from 'components/Group';

export default function FormHeading({ children }) {
  return (
    <Row align='center'>
      <BackButton />
      <h2>{children}</h2>
    </Row>
  );
}
