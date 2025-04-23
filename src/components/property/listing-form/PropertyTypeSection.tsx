
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyType } from "@/types";

export const PropertyTypeSection = () => {
  const form = useFormContext();
  const propertyType = form.watch("type");

  const getSubTypeOptions = () => {
    if (propertyType === "residential") {
      return [
        { value: "flat", label: "Flat/Apartment" },
        { value: "house", label: "House/Villa" },
        { value: "floor", label: "Floor" },
        { value: "studio", label: "Studio Apartment" },
        { value: "serviced", label: "Serviced Apartment" },
        { value: "farmhouse", label: "Farmhouse" },
      ];
    }
    return [
      { value: "office", label: "Office Space" },
      { value: "retail", label: "Retail" },
      { value: "warehouse", label: "Warehouse" },
      { value: "industrial-land", label: "Industrial Land" },
      { value: "commercial-land", label: "Commercial Land" },
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Sub-Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property sub-type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getSubTypeOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
