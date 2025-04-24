
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const PropertyDescription = () => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormDescription>
            Provide a detailed description of your property. Highlight unique features, location benefits, and why a buyer or tenant should choose this property.
          </FormDescription>
          <FormControl>
            <Textarea 
              placeholder="Describe your property in detail..." 
              className="min-h-[150px] resize-y"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
