
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StepBasicDetails = () => {
  const form = useFormContext();
  const propertyType = form.watch("type");

  // Get sub-type options based on selected property type
  const getSubTypeOptions = () => {
    if (propertyType === "residential") {
      return [
        { value: "flat", label: "Flat/Apartment" },
        { value: "house", label: "Independent House/Villa" },
        { value: "floor", label: "Independent/Builder Floor" },
        { value: "studio", label: "1 RK/Studio Apartment" },
        { value: "serviced", label: "Serviced Apartment" },
        { value: "farmhouse", label: "Farmhouse" },
        { value: "other", label: "Other" },
      ];
    }
    return [
      { value: "office", label: "Ready to move offices" },
      { value: "shell", label: "Bare shell offices" },
      { value: "retail", label: "Shops & Retail" },
      { value: "commercial-land", label: "Commercial/Institutional Land" },
      { value: "agriculture-land", label: "Agricultural/Farm Land" },
      { value: "industrial-land", label: "Industrial Land/Plots" },
      { value: "warehouse", label: "Warehouse" },
      { value: "cold-storage", label: "Cold Storage" },
      { value: "factory", label: "Factory & Manufacturing" },
      { value: "hotel", label: "Hotel/Resorts" },
      { value: "other", label: "Others" },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Step 1: Basic Details</div>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 3BHK Apartment in Green Valley" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="rent">Rent/Lease</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
