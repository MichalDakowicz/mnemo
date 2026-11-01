import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';

import { ActionSheet } from '@/components/ui/ActionSheet';
import { Pill } from '@/components/ui/Pill';
import { colors } from '@/theme/colors';

type Props = {
  label: string;
  title: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

/** Stands in for the web's native <select>: a pill showing the choice that opens the options in a sheet. */
export function SelectPill({ label, title, value, options, disabled, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? value;
  return (
    <>
      <Pill
        accessibilityLabel={`${label}: ${current}`}
        label={current}
        disabled={disabled}
        onPress={() => setOpen(true)}
        icon={<ChevronDown size={14} color={colors.muted} />}
        style={{ flexDirection: 'row-reverse' }}
      />
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        options={options.map((o) => ({ key: o.value, label: o.label, selected: o.value === value, onPress: () => onChange(o.value) }))}
      />
    </>
  );
}
