import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import cx from 'clsx';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';
import { useUpdateEffect } from 'ahooks';

import { InputText as PrimeInputText } from 'primereact/inputtext';
import { InputTextarea as PrimeInputTextarea } from 'primereact/inputtextarea';
import { InputNumber as PrimeInputNumber } from 'primereact/inputnumber';
import { InputSwitch as PrimeInputSwitch } from 'primereact/inputswitch';
import { MultiSelect as PrimeMultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

import { Row } from 'components/Group';
import { UploadInput, UploadImageInput, UploadInputInterface } from 'components/Upload';

import useDebounceState from 'hooks/useDebounceState';

import styles from './styles.module.sass';


function ManagedFormInputs({ formHook }) {
  const { control, formState: { errors }, register } = formHook;

  // Memoize the form upload inputs, only ditch the state of the error state changes
  const components = useMemo(() => {
    const _UploadImageInput = ({ ...props }: UploadInputInterface) => {
      return (
        <UploadImageInput
          {...props}
          formHook={formHook}
        />
      );
    };

    const _UploadFileInput = ({ ...props }: UploadInputInterface) => {
      return (
        <UploadInput
          {...props}
          formHook={formHook}
        />
      );
    };

    const _InputTextArea = (props: LInputTextAreaInterface) => {
      return (
        // @ts-ignore
        <InputTextArea controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputText = (props: LInputTextInterface) => {
      return (
        // @ts-ignore
        <InputText controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputNumber = (props) => {
      return (
        <InputNumber controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputDropdown = (props) => {
      return (
        <InputDropdown controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputSwitch = (props) => {
      return (
        <InputSwitch controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputSelectButton = (props) => {
      return (
        <InputSelectButton controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputMultiSelect = (props) => {
      return (
        <InputMultiSelect controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    const _InputCalendar = (props) => {
      return (
        <InputCalendar controlProps={{ control, errors }} fullWidth {...props} />
      );
    };

    return {
      UploadImageInput: _UploadImageInput,
      UploadFileInput: _UploadFileInput,
      InputText: _InputText,
      InputTextArea: _InputTextArea,
      InputNumber: _InputNumber,
      InputDropdown: _InputDropdown,
      InputMultiSelect: _InputMultiSelect,
      InputSwitch: _InputSwitch,
      InputCalendar: _InputCalendar,
      InputSelectButton: _InputSelectButton
    };
  }, [errors]);

  return components;
}

export function CustomForm({ formHook, onSubmit, className, children }: { formHook: any, onSubmit?: any, className?: string, children: any }) {
  const { handleSubmit } = formHook;

  const managedInputs = ManagedFormInputs({ formHook });
  const klass = cx('p-fluid', className);

  return onSubmit ? (
    <form onSubmit={handleSubmit(onSubmit)} className={klass}>
      {children(managedInputs)}
    </form>
  ) : (
    <form className={klass}>
      {children(managedInputs)}
    </form>
  );
}

export function Form({ defaultValues = {}, onSubmit, className, children }: { defaultValues?: any, onSubmit?: any, className?: string, children: any }) {
  const formHook = useForm({ defaultValues });
  const { handleSubmit } = formHook;

  const managedInputs = ManagedFormInputs({ formHook });
  const klass = cx('p-fluid', className);

  return onSubmit ? (
    <form onSubmit={handleSubmit(onSubmit)} className={klass}>
      {children(managedInputs)}
    </form>
  ) : (
    <form className={klass}>
      {children(managedInputs)}
    </form>
  );
}

export function FormField({ label, name, isRequired = false, control, errors, fullWidth, className, children }: {
  label?: string, name: string, isRequired?: boolean, control: any, errors: any, fullWidth?: boolean, className?: string, children: any
}) {
  const klass = cx('field', fullWidth && 'w-full', className);

  return (
    <div className={klass}>
      <label htmlFor={name} className={cx({ 'p-error': errors?.name })}>{isRequired ? '*' : ''}{label}</label>
      <Controller name={name} control={control} rules={{ required: isRequired ? `${label} is required.` : false }} render={({ field, fieldState }) => (
        children(field, fieldState)
      )} />
      {getFormErrorMessage()}
    </div>
  );

  function getFormErrorMessage() {
    return errors && errors[name] && <small className="p-error">{errors[name]?.message}</small>;
  }
}

export function ReadOnlyFormField({ label, isRequired = false, fullWidth = false, children }) {
  const klass = cx('field', fullWidth && 'w-full');

  return (
    <div className={klass}>
      <label>{isRequired ? '*' : ''}{label}</label>
      {children}
    </div>
  );
}

export function HiddenInput({ name, value, register, setValue }) {
  useEffect(() => {
    setValue(name, value);
  }, [name, value]);

  return (
    <input type="hidden" {...register(name)} />
  );
}

export interface LInputTextInterface {
  label?: string
  name: string
  isRequired?: boolean
  autoFocus?: boolean
  controlProps: any
  fullWidth?: boolean
  idProp?: string
}

export interface InputTextInterface {
  label?: string
  name: string,
  isRequired?: boolean
  autoFocus?: boolean
  controlProps: any
  fullWidth?: boolean
}

export function InputText({ label, name, isRequired, autoFocus, controlProps, fullWidth, ...props }: InputTextInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => (
        <PrimeInputText id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} {...props} />
      )}
    </FormField>
  );
}

export interface LInputTextAreaInterface {
  name: string
  label?: string
  isRequired?: boolean
  autoFocus?: boolean
  controlProps: any
  fullWidth?: boolean
  idProp?: string
}

export interface InputTextAreaInterface {
  label?: string
  name: string
  isRequired?: boolean
  controlProps: any
  fullWidth?: boolean
}

export function InputTextArea({ label, name, isRequired, controlProps, fullWidth, ...props }: InputTextAreaInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => (
        <PrimeInputTextarea id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} {...props} />
      )}
    </FormField>
  );
}

export interface InputNumberInterface {
  label?: string
  name: string
  isRequired?: boolean
  controlProps: any
  fullWidth?: boolean
}

export function InputNumber({ label, name, isRequired, controlProps, fullWidth, ...props }: InputNumberInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => (
        <PrimeInputNumber id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} onChange={({ value }) =>
          field.onChange(value)
        } {...props} />
      )}
    </FormField>
  );
}

export interface InputDropdownInterface {
  label?: string
  name: string
  isRequired?: boolean
  options?: Array<any>
  controlProps: any
  onChange?: Function
  fullWidth?: boolean
  className?: string
}

export function InputDropdown({ label, name, isRequired, options, controlProps, onChange, fullWidth, className, ...props }: InputDropdownInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth} className={className}>
      {(field, fieldState) => (
        <Dropdown id={field.name} value={field.value} onChange={(e) => {
          onChange && onChange(e);
          return field.onChange(e);
        }} options={options} className={cx({ 'p-invalid': fieldState.error })} placeholder="None" {...props} />
      )}
    </FormField>
  );
}

export interface InputSwitchInterface {
  name: string
  label?: string
  labelAlign?: string
  isRequired?: boolean
  checked?: boolean
  controlProps: any
  onChange?: Function
  fullWidth?: boolean
}

export function InputSwitch({ label, labelAlign, name, checked, controlProps, fullWidth, isRequired, onChange, ...props }: InputSwitchInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => (
        <PrimeInputSwitch id={field.name} {...field} className={cx(labelAlign === 'x' ? styles.inputSwitchY : styles.inputSwitch, { 'p-invalid': fieldState.error })} checked={field.value} onChange={(e) => {
          onChange && onChange(e);
          return field.onChange(e);
        }} {...props} />
      )}
    </FormField>
  );
}

export interface InputSelectButtonInterface {
  name: string
  label?: string
  isRequired?: boolean
  options: Array<any>
  controlProps: any
  onChange?: Function
  fullWidth?: boolean
}

export function InputSelectButton({ label, name, options, controlProps, fullWidth, isRequired, onChange, ...props }: InputSelectButtonInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => (
        <SelectButton id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} options={options} onChange={(e) => {
          onChange && onChange(e);
          return field.onChange(e);
        }} {...props} />
      )}
    </FormField>
  );
}

// InputSelectButton

export interface InputMultiSelectInterface {
  label?: string
  name: string
  isRequired?: boolean
  options?: Array<any>
  controlProps: any
  onChange?: Function
  fullWidth?: boolean
}

export function InputMultiSelect({ label, name, options, controlProps, isRequired, fullWidth, onChange, ...props }: InputMultiSelectInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => {
        return (
          <PrimeMultiSelect id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} options={options} display="chip" onChange={(e) => {
            onChange && onChange(e.value);
            return field.onChange(e);
          }} {...props} />
        )
      }}
    </FormField>
  );
}

export interface InputCalendarInterface {
  label?: string
  name: string
  isRequired?: boolean
  controlProps: any
  onChange?: Function
  fullWidth?: boolean
}

export function InputCalendar({ label, name, controlProps, fullWidth, isRequired, onChange, ...props }: InputCalendarInterface) {
  const { control, errors } = controlProps;

  return (
    <FormField label={label} name={name} isRequired={isRequired} control={control} errors={errors} fullWidth={fullWidth}>
      {(field, fieldState) => {
        return (
          <Calendar id={field.name} {...field} className={cx({ 'p-invalid': fieldState.error })} onChange={(e) => {
            onChange && onChange(e.value);
            return field.onChange(e);
          }} {...props} />
        );
      }}
    </FormField>
  );
}

export function FormButton({ justify = 'start', ...props }) {
  return (
    <Row className={styles['right-button']} justify={justify}>
      <Button {...props} />
    </Row>
  );
};

export function FormSplitButton({ justify = 'start', items, ...props }) {
  return (
    <Row className={styles['right-button']} justify={justify}>
      <SplitButton model={items} {...props} />
    </Row>
  );
};

interface FormFooterButtonsInterface {
  justify?: string
  items?: Array<any> | undefined
  type?: string
  onClick?: Function | null
  onCancel?: Function | null
}

export function FormFooterButtons({ justify = 'end', items = [], onClick = null, onCancel = null, ...props }: FormFooterButtonsInterface) {
  const router = useRouter();

  const hasItems = items.length > 0;

  return (
    <Row justify={justify} {...props}>
      <FormButton type="button" label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => onCancel ? onCancel() : router.back()} />
      {!hasItems ? (
        <FormButton type={onClick ? 'button' : 'submit'} onClick={(e) => onClick && onClick(e)} label="Save" icon="pi pi-check" />
      ) : (
        <FormSplitButton type={onClick ? 'button' : 'submit'} onClick={(e) => onClick && onClick(e)} label="Save" icon="pi pi-check" items={items} />
      )}
    </Row>
  );
}

interface InputTextDebouncedProps {
  value: string
  onChange: (value?: string | React.Dispatch<any>) => void
  icon?: string
}

export function InputTextDebounced({ value = '', onChange, icon, ...rest }: InputTextDebouncedProps) {
  const [internalValue, setInternalValue, debouncedValue] = useDebounceState(value);

  useUpdateEffect(() => {
    onChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  if (icon) {
    return (
      <span className="p-input-icon-left">
        <i className={`pi ${icon}`} />

        <PrimeInputText
          value={internalValue}
          onChange={handleChange}
          {...rest}
        />
      </span>
    );
  }

  return (
    <PrimeInputText
      value={internalValue}
      onChange={handleChange}
      {...rest}
    />
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInternalValue(e.target.value);
  }
}
