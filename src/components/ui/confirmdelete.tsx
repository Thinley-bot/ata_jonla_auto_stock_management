import { Dispatch, SetStateAction } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

const ConfirmDelete = ({isOpen, setIsOpen, item, handleDelete}:{isOpen:boolean, setIsOpen:Dispatch<SetStateAction<boolean>>, item:string, handleDelete: () => void}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comfirm Delete</DialogTitle>
          <DialogDescription>
            {`The ${item } be will permanently deleted.`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button type="submit" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" variant="destructive" onClick={() => handleDelete()}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ConfirmDelete;
