
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

export const StepLocationDetails = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Step 2: Location Details</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Enter city" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.locality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locality</FormLabel>
              <FormControl>
                <Input placeholder="Enter locality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="location.subLocality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-locality (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter sub-locality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.society"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment/Society Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter apartment or society name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="location.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complete Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter complete property address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location.pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pin Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter pin code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
