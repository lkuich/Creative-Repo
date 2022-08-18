import { useRouter } from 'next/router';
import Link from 'next/link';
import cx from 'clsx';

import { BreadCrumb } from 'primereact/breadcrumb';

import styles from './styles.module.sass';

export default function Breadcrumb({ thisPage }: { thisPage?: string }) {
  const router = useRouter();

  const { asPath } = router;

  const homeKlass = cx('p-menuitem-icon', 'pi', 'pi-home', styles['link']);

  const home = { icon: 'pi pi-home', template: <a className={homeKlass}></a> };

  const paths = asPath.split('/').slice(1);

  const items = paths.map((p, i) => {
    const url = `/${paths.slice(0, i + 1).join('/')}`;

    if (thisPage && i === paths.length - 1) {
      return ({ label: thisPage });
    }

    return ({
      template: (
        <Link href={url}><a className={styles['link']}>{p.split('?')[0]}</a></Link>
      )
    });
  });

  return (
    <BreadCrumb model={items} home={home} className="mb-2" />
  );
}
