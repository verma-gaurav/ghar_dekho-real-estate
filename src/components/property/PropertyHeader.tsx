import { MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
          {property.verification_status !== undefined && (
            property.verification_status ? (
              <span title="Verified">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </span>
            ) : (
              <span title="Property not verified, contact the team to verify the property">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </span>
            )
          )}
        </div>
        <div className="flex items-center text-muted-foreground mt-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location.locality}, {property.location.city}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-2xl md:text-3xl font-bold text-estate-500">
          {formatPrice(property.price)}
          {property.purpose === "rent" && <span className="text-base text-muted-foreground">/month</span>}
        </div>
        {property.purpose === "rent" && property.securityDeposit && (
          <div className="text-sm text-muted-foreground">
            Security: {formatPrice(property.securityDeposit)}
          </div>
        )}
      </div>
    </div>
  );
};
