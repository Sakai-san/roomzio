import { FC, useRef, RefCallback, useLayoutEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

type RenameRoomFormProps = {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
};

export const RenameRoomForm: FC<RenameRoomFormProps> = ({
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const ree = useRef<HTMLElement>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useLayoutEffect(() => {
    ree.current?.focus();
  }, []);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={isValid && !isDirty ? onClose : handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => {
          const decorateCallbackRef =
            (cb: RefCallback<HTMLElement>) => (element: HTMLDivElement) => {
              ree.current = element;
              cb(element);
            };

          return (
            <TextField
              {...field}
              value={field.value ?? ""}
              size="small"
              fullWidth
              required
              label="Name"
              variant="outlined"
              disabled={isSubmitting}
              helperText={fieldState.error?.message ?? ""}
              error={Boolean(fieldState.error)}
              inputRef={decorateCallbackRef(ref)}
            />
          );
        }}
      />
    </Box>
  );
};
