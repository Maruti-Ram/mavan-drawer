// Step 6 of the card 2.2 proof: the public types. types.mjs compiles this with `tsc --noEmit` against the installed
// package in each module resolution a customer may use. Every @ts-expect-error must be an error, or tsc fails on
// the unused directive.
import { useRef } from 'react';
import { Check, CheckFilled, Check2SmallFilled, Icon } from '@mavan/icons-react';
import type { IconName, IconProps } from '@mavan/icons-react';
// @ts-expect-error the component type is internal, not exported
import type { IconComponent } from '@mavan/icons-react';

export const name: IconName = 'check-2-small-filled';
// @ts-expect-error not a name in the set
export const wrong: IconName = 'check-99';
export const props: IconProps = {
  size: 16, optical: true, title: 'Done', className: 'x', style: { color: 'red' },
  onClick: (e) => { e.currentTarget.getBBox(); },
};

export function App() {
  const ref = useRef<SVGSVGElement>(null);
  return (
    <div>
      <Check {...props} ref={ref} />
      <CheckFilled size={20} aria-label="Done" />
      <Check2SmallFilled />
      <Icon name={name} size={24} ref={ref} />
      <Icon name="check-filled" optical />
      {/* @ts-expect-error not a name in the set */}
      <Icon name="no-such-icon" />
      {/* @ts-expect-error size is a number of pixels */}
      <Check size="16" />
      {/* @ts-expect-error optical is a boolean */}
      <Check optical="yes" />
      {/* @ts-expect-error Icon needs a name */}
      <Icon size={16} />
      {/* @ts-expect-error name is Icon's prop, not a component's (it would land on the <svg>) */}
      <Check name="x" />
    </div>
  );
}
