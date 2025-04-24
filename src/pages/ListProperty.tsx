
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ListingForm from "@/components/property/ListingForm";
import { PropertyPurpose } from "@/types";

export default function ListProperty() {
  const { purpose } = useParams<{ purpose?: PropertyPurpose }>();
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-2">List Your Property</h1>
      <p className="text-muted-foreground mb-6">
        {purpose ? `List your property for ${purpose}` : 'Choose a listing type to get started'}
      </p>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <ListingForm defaultPurpose={purpose as PropertyPurpose} />
      </div>
    </div>
  );
}
