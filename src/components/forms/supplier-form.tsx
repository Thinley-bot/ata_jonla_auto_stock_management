import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function SupplierForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_number: "",
  });

  const utils = api.useUtils();
  
  const createSupplier = api.supplierRoutes.createSupplier.useMutation({
    onSuccess: () => {
      utils.supplierRoutes.getPaginatedSuppliers.invalidate();
      setIsOpen(false);
      setFormData({
        supplier_name: "",
        supplier_number: "",
      });
      toast.success("Supplier created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_name || !formData.supplier_number) {
      toast.error("Please fill in all fields");
      return;
    }
    createSupplier.mutate({
      supplier_name: formData.supplier_name,
      supplier_number: formData.supplier_number,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Supplier</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="supplier_number">Supplier Number</Label>
              <Input
                id="supplier_number"
                name="supplier_number"
                value={formData.supplier_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createSupplier.isPending}>
            {createSupplier.isPending ? "Creating..." : "Create Supplier"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 