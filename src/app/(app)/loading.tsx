import { PageLoadingSkeleton } from '@/components/page-loading-skeleton';

export default function AppLoading() {
  return (
    <PageLoadingSkeleton
      eyebrow="LOADING"
      titleWidth="w-80"
      descriptionWidth="w-full max-w-3xl"
      cardCount={4}
    />
  );
}
