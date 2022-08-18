import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

export default function BackButton() {
  const router = useRouter();

  return (
    // eslint-disable-next-line react/forbid-component-props
    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-secondary p-button-text" style={{ 'fontSize': '2em' }} aria-label="Back" onClick={() => router.back()} />
  );
}
