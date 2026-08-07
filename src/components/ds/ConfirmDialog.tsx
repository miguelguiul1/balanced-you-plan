import { ReactNode } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
};

/** Confirmação elegante antes de ações destrutivas. */
export const ConfirmDialog = ({
  trigger,
  title = "Tem certeza?",
  description = "Essa ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  destructive = true,
}: Props) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent className="rounded-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDialog;