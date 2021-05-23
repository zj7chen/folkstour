const FormikAdaptor =
  (Component) =>
  ({ field, form, ...props }) => {
    return (
      <Component
        id={field.id}
        name={field.name}
        value={field.value}
        onChange={(value) => form.setFieldValue(field.name, value)}
        onBlur={() => {
          console.log("blur");
          form.setFieldTouched(field.name, true);
        }}
        {...props}
      />
    );
  };

export default FormikAdaptor;
