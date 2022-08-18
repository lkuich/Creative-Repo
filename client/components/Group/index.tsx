import cx from 'clsx';

import { GenericProps } from '../index';

import styles from './style.module.sass';

interface GroupProps extends GenericProps {
  direction?: 'row' | 'column';
  gap?: '0' | '1' | '2' | '3' | '4';
  fullWidth?: boolean;
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
}

function Group({ children, className, direction = 'row', gap = '2', fullWidth, align, justify = 'start', wrap, 'data-cy': dataCy, ...rest }: GroupProps) {
  const klass = cx(
    'flex',
    direction === 'column' ? 'flex-column' : 'flex-row',
    `gap-${gap}`,
    justify && `justify-content-${justify}`,
    align && `align-items-${align}`,
    className,
    fullWidth && styles['full-width'],
    wrap && 'flex-wrap'
  );

  return (
    <div className={klass} data-cy={dataCy} {...rest}>
      {children}
    </div>
  );
}

export function Row({ children, className, gap = '2', align, wrap, 'data-cy': dataCy, ...rest }: GroupProps) {
  return (
    <Group className={className} direction="row" gap={gap} align={align} wrap={wrap} data-cy={dataCy} {...rest}>
      {children}
    </Group>
  );
}

export function Column({ children, className, gap = '2', align, 'data-cy': dataCy, ...rest }: GroupProps) {
  return (
    <Group className={className} direction="column" gap={gap} align={align} data-cy={dataCy} {...rest}>
      {children}
    </Group>
  );
}

export function Grid({ children }) {

}
