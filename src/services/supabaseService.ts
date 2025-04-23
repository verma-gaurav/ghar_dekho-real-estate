
// This is now a compatibility layer for imports if any left.
// All logic has been split into propertyService.ts and userService.ts.

// Re-export everything from propertyService and userService
export * from '@/services/propertyService';
export * from '@/services/userService';

// This file can be safely removed if all imports are updated to use the specific service files.
